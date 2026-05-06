# consumo_routes.py
# Rotas da API responsaveis por registrar e consultar dados de consumo (agua, energia, outros).
# Todas as rotas recebem ou retornam dados em formato JSON.
# Inclui novas rotas para resumo-mensal, PUT /registro e DELETE /registro.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

from src.database.connection import get_db
from src.models.models import Consumo, Usuario, Meta

consumo_router = APIRouter(prefix="/consumo", tags=["Consumo"])


# ─── SCHEMAS DE ENTRADA (o que o app envia) ───────────────────────────────────

class ConsumoRegistrar(BaseModel):
    """Dados necessarios para registrar um novo consumo."""
    id_usuario: int
    tipo_consumo: str          # "agua", "energia", "outros"
    valor: float
    unidade_medida: str        # "L", "kWh", "" (vazio para outros sem unidade)
    is_simulado: Optional[bool] = False
    nome_custom: Optional[str] = None
    valor_monetario: Optional[float] = None
    data_personalizada: Optional[str] = None  # ISO 8601: "2026-05-01T10:00:00Z"


# ─── ROTA 1: Registrar consumo ────────────────────────────────────────────────

@consumo_router.post("/registrar")
def registrar_consumo(dados: ConsumoRegistrar, db: Session = Depends(get_db)):
    """
    Salva um novo registro de consumo no banco de dados.
    Chamado pelas telas de Agua, Energia e Outros apos o usuario confirmar os dados.
    Se data_personalizada for informada, usa ela em vez de datetime.now() para data_registro.
    """
    # Verifica se o usuario existe antes de registrar
    usuario = db.query(Usuario).filter(Usuario.id == dados.id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Determina a data de registro: personalizada ou agora
    data_final = datetime.now(timezone.utc)
    if dados.data_personalizada:
        try:
            data_final = datetime.fromisoformat(dados.data_personalizada.replace("Z", "+00:00"))
        except Exception:
            pass  # fallback para now()

    novo_consumo = Consumo(
        id_usuario=dados.id_usuario,
        tipo_consumo=dados.tipo_consumo.lower(),
        valor=dados.valor,
        unidade_medida=dados.unidade_medida,
        is_simulado=dados.is_simulado,
        nome_custom=dados.nome_custom,
        valor_monetario=dados.valor_monetario,
        data_registro=data_final,
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
        "nome_custom": novo_consumo.nome_custom,
        "valor_monetario": float(novo_consumo.valor_monetario) if novo_consumo.valor_monetario else None,
        "data_registro": novo_consumo.data_registro.isoformat(),
        "mensagem": "Consumo registrado com sucesso",
    }


# ─── ROTA 2: Consumo semanal (ultimos 7 dias, agrupado por dia) ───────────────

@consumo_router.get("/semanal/{id_usuario}")
def consumo_semanal(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os consumos dos ultimos 7 dias agrupados por data real.
    Gera labels dinamicos (Hoje, Ontem, dia da semana).
    Substitui 'vampiro' por 'outros' (valor monetario em R$).
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
    outros  = {d: 0.0 for d in dias_range}

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
            elif r.tipo_consumo == "outros":
                outros[dia] += float(r.valor_monetario or 0)

    # Labels FIXOS — sempre dia da semana, nunca "Hoje"/"Ontem"
    nomes_pt = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

    # dias_range já está definido acima como os últimos 7 dias (mais antigo → mais recente)
    labels = [nomes_pt[d.weekday()] for d in dias_range]

    return {
        "dias":    labels,
        "agua":    [round(agua[d], 2)    for d in dias_range],
        "energia": [round(energia[d], 4) for d in dias_range],
        "outros":  [round(outros[d], 2)  for d in dias_range],
    }


# ─── ROTA 3: Resumo da semana atual ───────────────────────────────────────────

@consumo_router.get("/resumo/{id_usuario}")
def resumo_semanal(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os totais acumulados da semana atual para o usuario.
    Usado na Home para exibir as StatBars de Agua e Energia.
    Inclui total em R$ dos consumos 'outros'.
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
    total_outros  = sum(float(r.valor_monetario or 0) for r in registros if r.tipo_consumo == "outros")

    # Metas de referencia semanal (base: media brasileira)
    META_AGUA_SEMANAL    = 700.0   # litros
    META_ENERGIA_SEMANAL = 15.0    # kWh

    # Calcula percentuais de uso em relacao a meta (nunca passa de 100%)
    percentual_agua    = min(100, round((total_agua / META_AGUA_SEMANAL) * 100, 1))
    percentual_energia = min(100, round((total_energia / META_ENERGIA_SEMANAL) * 100, 1))

    return {
        "total_agua_L":          round(total_agua, 2),
        "total_energia_kWh":     round(total_energia, 4),
        "total_outros_reais":    round(total_outros, 2),
        "percentual_agua":       percentual_agua,
        "percentual_energia":    percentual_energia,
        "meta_agua_L":           META_AGUA_SEMANAL,
        "meta_energia_kWh":      META_ENERGIA_SEMANAL,
    }


# ─── ROTA 4: Resumo mensal (ultimos 30 dias) ──────────────────────────────────

@consumo_router.get("/resumo-mensal/{id_usuario}")
def resumo_mensal(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os totais acumulados dos ultimos 30 dias para o usuario.
    Usado na Home para exibir as StatBars mensais e o card de Gasto Mensal.
    Calcula gastos em R$ diretamente no backend para evitar divergencia por arredondamento.
    """
    agora = datetime.now(timezone.utc)
    trinta_dias_atras = agora - timedelta(days=30)

    registros = (
        db.query(Consumo)
        .filter(
            Consumo.id_usuario == id_usuario,
            Consumo.data_registro >= trinta_dias_atras,
        )
        .all()
    )

    total_agua    = sum(float(r.valor) for r in registros if r.tipo_consumo == "agua")
    total_energia = sum(float(r.valor) for r in registros if r.tipo_consumo == "energia")
    total_outros  = sum(float(r.valor_monetario or 0) for r in registros if r.tipo_consumo == "outros")

    # Metas de referencia mensal (base: media brasileira)
    META_AGUA_MENSAL    = 3000.0   # litros
    META_ENERGIA_MENSAL = 60.0     # kWh

    percentual_agua    = min(100, round((total_agua / META_AGUA_MENSAL) * 100, 1))
    percentual_energia = min(100, round((total_energia / META_ENERGIA_MENSAL) * 100, 1))

    # Gastos em R$ calculados no backend (fonte unica de verdade)
    gasto_agua_reais    = round(total_agua * 0.0065, 2)      # R$ 6,50/m3
    gasto_energia_reais = round(total_energia * 0.87, 2)     # R$ 0,87/kWh
    gasto_outros_reais  = round(total_outros, 2)
    gasto_total_reais   = round(gasto_agua_reais + gasto_energia_reais + gasto_outros_reais, 2)

    return {
        "total_agua_L":          round(total_agua, 2),
        "total_energia_kWh":     round(total_energia, 4),
        "total_outros_reais":    round(total_outros, 2),
        "percentual_agua":       percentual_agua,
        "percentual_energia":    percentual_energia,
        "meta_agua_L":           META_AGUA_MENSAL,
        "meta_energia_kWh":      META_ENERGIA_MENSAL,
        "gasto_agua_reais":      gasto_agua_reais,
        "gasto_energia_reais":   gasto_energia_reais,
        "gasto_outros_reais":    gasto_outros_reais,
        "gasto_total_reais":     gasto_total_reais,
    }


# ─── ROTA 5: Historico dos ultimos 100 registros (ordem cronologica) ──────────

@consumo_router.get("/historico/{id_usuario}")
def historico_consumo(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna os ultimos 100 registros de consumo do usuario em ordem cronologica (ASC).
    Mais antigo primeiro, como uma linha do tempo.
    Inclui nome_custom e valor_monetario para registros tipo 'outros'.
    """
    registros = (
        db.query(Consumo)
        .filter(Consumo.id_usuario == id_usuario)
        .order_by(Consumo.data_registro.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id":              r.id,
            "tipo_consumo":    r.tipo_consumo,
            "nome_custom":     r.nome_custom,
            "valor":           float(r.valor),
            "valor_monetario": float(r.valor_monetario) if r.valor_monetario else None,
            "unidade_medida":  r.unidade_medida,
            "data_registro":   r.data_registro.isoformat() if r.data_registro else None,
        }
        for r in registros
    ]


# ─── ROTA 6: Editar registro individual ──────────────────────────────────────

class ConsumoEditar(BaseModel):
    """Campos editaveis de um registro. tipo_consumo e id_usuario sao imutaveis."""
    nome_custom: Optional[str] = None
    valor: Optional[float] = None
    unidade_medida: Optional[str] = None
    valor_monetario: Optional[float] = None
    data_registro: Optional[str] = None  # ISO 8601

@consumo_router.put("/registro/{id_registro}")
def editar_registro(id_registro: int, dados: ConsumoEditar, db: Session = Depends(get_db)):
    """
    Atualiza os campos enviados (nao nulos) de um registro existente.
    tipo_consumo e id_usuario sao imutaveis — o frontend nunca envia esses campos.
    """
    registro = db.query(Consumo).filter(Consumo.id == id_registro).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Registro não encontrado")

    if dados.nome_custom is not None:
        registro.nome_custom = dados.nome_custom or None  # string vazia vira None
    if dados.valor is not None:
        registro.valor = dados.valor
    if dados.unidade_medida is not None:
        registro.unidade_medida = dados.unidade_medida
    if dados.valor_monetario is not None:
        registro.valor_monetario = dados.valor_monetario
    if dados.data_registro is not None:
        try:
            registro.data_registro = datetime.fromisoformat(dados.data_registro.replace("Z", "+00:00"))
        except Exception:
            pass  # mantem a data original se o parse falhar

    db.commit()
    db.refresh(registro)

    return {
        "id":              registro.id,
        "tipo_consumo":    registro.tipo_consumo,
        "nome_custom":     registro.nome_custom,
        "valor":           float(registro.valor),
        "valor_monetario": float(registro.valor_monetario) if registro.valor_monetario else None,
        "unidade_medida":  registro.unidade_medida,
        "data_registro":   registro.data_registro.isoformat() if registro.data_registro else None,
        "mensagem":        "Registro atualizado com sucesso",
    }


# ─── ROTA 7: Apagar registro individual ──────────────────────────────────────

@consumo_router.delete("/registro/{id_registro}")
def apagar_registro(id_registro: int, db: Session = Depends(get_db)):
    """
    Apaga um unico registro de consumo pelo ID.
    NAO confundir com /usuario/{id_usuario} que apaga o usuario inteiro.
    """
    registro = db.query(Consumo).filter(Consumo.id == id_registro).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    db.delete(registro)
    db.commit()
    return {"mensagem": "Registro apagado com sucesso"}


# ─── ROTA 8: Apagar conta do usuario ─────────────────────────────────────────

@consumo_router.delete("/usuario/{id_usuario}")
def apagar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    """
    Apaga permanentemente o usuario e todos os seus consumos (CASCADE).
    Usado pela tela de Perfil quando o usuario confirma a exclusao da conta.
    """
    usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    # Apaga dependências manualmente para contornar falhas de CASCADE no SQLite
    db.query(Consumo).filter(Consumo.id_usuario == id_usuario).delete()
    db.query(Meta).filter(Meta.id_usuario == id_usuario).delete()
    
    db.delete(usuario)
    db.commit()
    return {"mensagem": "Conta apagada com sucesso"}
