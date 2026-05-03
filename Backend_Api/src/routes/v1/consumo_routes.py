# consumo_routes.py
# Rotas da API responsáveis por registrar e consultar dados de consumo (água, energia, vampiro).
# Todas as rotas recebem ou retornam dados em formato JSON.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

from src.database.connection import get_db
from src.models.models import Consumo, Usuario

consumo_router = APIRouter(prefix="/consumo", tags=["Consumo"])


# ─── SCHEMAS DE ENTRADA (o que o app envia) ───────────────────────────────────

class ConsumoRegistrar(BaseModel):
    """Dados necessários para registrar um novo consumo."""
    id_usuario: int
    tipo_consumo: str          # "agua", "energia", "vampiro"
    valor: float
    unidade_medida: str        # "L", "kWh"
    is_simulado: Optional[bool] = False


# ─── ROTA 1: Registrar consumo ────────────────────────────────────────────────

@consumo_router.post("/registrar")
def registrar_consumo(dados: ConsumoRegistrar, db: Session = Depends(get_db)):
    """
    Salva um novo registro de consumo no banco de dados.
    Chamado pelas telas de Água e Energia após o usuário confirmar os dados.
    """
    # Verifica se o usuário existe antes de registrar
    usuario = db.query(Usuario).filter(Usuario.id == dados.id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    novo_consumo = Consumo(
        id_usuario=dados.id_usuario,
        tipo_consumo=dados.tipo_consumo.lower(),
        valor=dados.valor,
        unidade_medida=dados.unidade_medida,
        is_simulado=dados.is_simulado,
        data_registro=datetime.now(timezone.utc),
    )
    db.add(novo_consumo)
    db.commit()
    db.refresh(novo_consumo)

    return {
        "id": novo_consumo.id,
        "id_usuario": novo_consumo.id_usuario,
        "tipo_consumo": novo_consumo.tipo_consumo,
        "valor": float(novo_consumo.valor),
        "unidade_medida": novo_consumo.unidade_medida,
        "is_simulado": novo_consumo.is_simulado,
        "data_registro": novo_consumo.data_registro.isoformat(),
        "mensagem": "Consumo registrado com sucesso",
    }


# ─── ROTA 2: Consumo semanal (últimos 7 dias, agrupado por dia) ───────────────

@consumo_router.get("/semanal/{id_usuario}")
def consumo_semanal(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os consumos dos ultimos 7 dias agrupados por data real.
    Gera labels dinamicos (Hoje, Ontem, dia da semana).
    """
    agora = datetime.now(timezone.utc)

    # Gerar os ultimos 7 dias em ordem (mais antigo primeiro)
    dias_range = [(agora - timedelta(days=i)).date() for i in range(6, -1, -1)]

    sete_dias_atras = datetime.combine(dias_range[0], datetime.min.time()).replace(tzinfo=timezone.utc)

    registros = (
        db.query(Consumo)
        .filter(Consumo.id_usuario == id_usuario, Consumo.data_registro >= sete_dias_atras)
        .all()
    )

    # Mapear por data real
    agua    = {d: 0.0 for d in dias_range}
    energia = {d: 0.0 for d in dias_range}
    vampiro = {d: 0.0 for d in dias_range}

    for r in registros:
        data = r.data_registro
        if data.tzinfo is None:
            data = data.replace(tzinfo=timezone.utc)
        dia = data.date()
        if dia in agua:
            if r.tipo_consumo == "agua":
                agua[dia] += float(r.valor)
            elif r.tipo_consumo == "energia":
                energia[dia] += float(r.valor)
            elif r.tipo_consumo == "vampiro":
                vampiro[dia] += float(r.valor)

    # Labels dinamicos (hoje, ontem, dias da semana)
    nomes_pt = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
    hoje = agora.date()
    ontem = hoje - timedelta(days=1)

    def label_dia(d):
        if d == hoje:
            return "Hoje"
        if d == ontem:
            return "Ontem"
        return nomes_pt[d.weekday()]

    labels = [label_dia(d) for d in dias_range]

    return {
        "dias":    labels,
        "agua":    [round(agua[d], 2)    for d in dias_range],
        "energia": [round(energia[d], 4) for d in dias_range],
        "vampiro": [round(vampiro[d], 4) for d in dias_range],
    }


# ─── ROTA 3: Resumo da semana atual ───────────────────────────────────────────

@consumo_router.get("/resumo/{id_usuario}")
def resumo_semanal(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os totais acumulados da semana atual para o usuário.
    Usado na Home para exibir as StatBars de Água e Energia.
    Também calcula valores poupados e percentuais.
    """
    agora = datetime.now(timezone.utc)
    sete_dias_atras = agora - timedelta(days=7)

    registros = (
        db.query(Consumo)
        .filter(
            Consumo.id_usuario == id_usuario,
            Consumo.data_registro >= sete_dias_atras,
        )
        .all()
    )

    # Soma os valores por categoria
    total_agua    = sum(float(r.valor) for r in registros if r.tipo_consumo == "agua")
    total_energia = sum(float(r.valor) for r in registros if r.tipo_consumo == "energia")
    total_vampiro = sum(float(r.valor) for r in registros if r.tipo_consumo == "vampiro")

    # Metas de referência semanal (base: média brasileira)
    META_AGUA_SEMANAL    = 700.0   # litros
    META_ENERGIA_SEMANAL = 15.0    # kWh
    META_VAMPIRO_SEMANAL = 3.5     # kWh

    # Calcula quanto o usuário "poupou" em relação à média de referência
    agua_poupada    = max(0.0, META_AGUA_SEMANAL - total_agua)
    energia_poupada = max(0.0, META_ENERGIA_SEMANAL - total_energia)

    # Calcula percentuais de uso em relação à meta (nunca passa de 100%)
    percentual_agua    = min(100, round((total_agua / META_AGUA_SEMANAL) * 100, 1))
    percentual_energia = min(100, round((total_energia / META_ENERGIA_SEMANAL) * 100, 1))
    percentual_outros  = min(100, round((total_vampiro / META_VAMPIRO_SEMANAL) * 100, 1))

    return {
        "total_agua_L":          round(total_agua, 2),
        "total_energia_kWh":     round(total_energia, 4),
        "total_vampiro_kWh":     round(total_vampiro, 4),
        "agua_poupada_L":        round(agua_poupada, 2),
        "energia_poupada_kWh":   round(energia_poupada, 4),
        "percentual_agua":       percentual_agua,
        "percentual_energia":    percentual_energia,
        "percentual_outros":     percentual_outros,
        "meta_agua_L":           META_AGUA_SEMANAL,
        "meta_energia_kWh":      META_ENERGIA_SEMANAL,
    }


# ─── ROTA 4: Histórico dos últimos 30 registros ───────────────────────────────

@consumo_router.get("/historico/{id_usuario}")
def historico_consumo(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os últimos 30 registros de consumo do usuário.
    Útil para debug e para futuras telas de histórico detalhado.
    """
    registros = (
        db.query(Consumo)
        .filter(Consumo.id_usuario == id_usuario)
        .order_by(Consumo.data_registro.desc())
        .limit(30)
        .all()
    )

    return [
        {
            "id":             r.id,
            "tipo_consumo":   r.tipo_consumo,
            "valor":          float(r.valor),
            "unidade_medida": r.unidade_medida,
            "is_simulado":    r.is_simulado,
            "data_registro":  r.data_registro.isoformat() if r.data_registro else None,
        }
        for r in registros
    ]
