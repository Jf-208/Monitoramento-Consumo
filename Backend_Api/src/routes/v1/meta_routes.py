# meta_routes.py
# Rotas do sistema de metas — GET, POST, PUT, DELETE.
# Segue o mesmo padrão de consumo_routes.py:
#   - Isolamento por id_usuario em TODA query (segurança de dados)
#   - HTTPException com mensagens em português
#   - Injeção de get_db via Depends
#
# Registrado em main.py com prefixo '/metas' e tag 'metas'.

import logging
from datetime import date, timedelta
from calendar import monthrange
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.connection import get_db
from src.models.models import Meta
from src.schemas.meta_schema import MetaCreate, MetaUpdate, MetaResponse, UNIDADE_POR_TIPO

_logger = logging.getLogger(__name__)

meta_router = APIRouter(prefix='/metas', tags=['metas'])


# ─── HELPER: calcular data_fim ────────────────────────────────────────────────
def _calcular_data_fim(data_inicio_str: str, periodo: str) -> str:
    """
    Calcula data_fim a partir de data_inicio e período.
    Nunca confiamos no frontend para esse cálculo.

    Semanal: data_inicio + 6 dias (período de 7 dias inclusive).
    Mensal:  último dia do mês de data_inicio.
    """
    inicio = date.fromisoformat(data_inicio_str)

    if periodo == 'semanal':
        fim = inicio + timedelta(days=6)
    else:  # mensal
        ultimo_dia = monthrange(inicio.year, inicio.month)[1]
        fim = date(inicio.year, inicio.month, ultimo_dia)

    return fim.isoformat()


# ─── HELPER: validar propriedade ─────────────────────────────────────────────
def _verificar_propriedade(meta: Optional[Meta], id_usuario: int) -> Meta:
    """Levanta 404 se meta não existe, 403 se pertence a outro usuário."""
    if meta is None:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    if meta.id_usuario != id_usuario:
        # Retorna 403 e não 404 para não vazar informação sobre existência
        raise HTTPException(status_code=403, detail="Acesso negado.")
    return meta


# ─── GET /metas/ativas ────────────────────────────────────────────────────────
@meta_router.get('/ativas', response_model=List[MetaResponse])
def listar_metas_ativas(id_usuario: int, db: Session = Depends(get_db)):
    """
    Retorna todas as metas ativas do usuário logado, ordenadas por created_at DESC.
    id_usuario é lido do header X-User-Id pelo frontend (via api.js).
    """
    metas = (
        db.query(Meta)
        .filter(Meta.id_usuario == id_usuario, Meta.ativa == True)
        .order_by(Meta.created_at.desc())
        .all()
    )
    return metas


# ─── POST /metas ──────────────────────────────────────────────────────────────
@meta_router.post('', response_model=MetaResponse, status_code=201)
def criar_meta(dados: MetaCreate, id_usuario: int, db: Session = Depends(get_db)):
    """
    Cria uma nova meta de consumo.
    data_fim é calculado aqui no backend — nunca aceito do cliente.
    unidade_medida é determinado automaticamente pelo tipo.
    """
    data_fim = _calcular_data_fim(dados.data_inicio, dados.periodo)

    nova_meta = Meta(
        id_usuario=id_usuario,
        tipo=dados.tipo,
        periodo=dados.periodo,
        valor_meta=float(dados.valor_meta),
        unidade_medida=UNIDADE_POR_TIPO[dados.tipo],
        data_inicio=dados.data_inicio,
        data_fim=data_fim,
        ativa=True,
    )
    db.add(nova_meta)
    db.commit()
    db.refresh(nova_meta)

    _logger.info(f"[META CRIADA] usuario={id_usuario} tipo={dados.tipo} periodo={dados.periodo}")
    return nova_meta


# ─── PUT /metas/{id} ──────────────────────────────────────────────────────────
@meta_router.put('/{meta_id}', response_model=MetaResponse)
def atualizar_meta(meta_id: int, dados: MetaUpdate, id_usuario: int, db: Session = Depends(get_db)):
    """
    Atualiza valor_meta e/ou ativa de uma meta existente.
    Verifica propriedade antes — retorna 403 se a meta pertence a outro usuário.
    """
    meta = db.query(Meta).filter(Meta.id == meta_id).first()
    _verificar_propriedade(meta, id_usuario)

    if dados.valor_meta is not None:
        meta.valor_meta = dados.valor_meta
    if dados.ativa is not None:
        meta.ativa = dados.ativa

    db.commit()
    db.refresh(meta)
    return meta


# ─── DELETE /metas/{id} ───────────────────────────────────────────────────────
@meta_router.delete('/{meta_id}', status_code=204)
def deletar_meta(meta_id: int, id_usuario: int, db: Session = Depends(get_db)):
    """
    Hard delete da meta.
    Escolha: hard delete em vez de soft (ativa=False) porque o endpoint
    PUT já oferece desativação explícita. Hard delete evita acúmulo de
    registros obsoletos e simplifica as queries de listagem.
    Retorna 204 No Content.
    """
    meta = db.query(Meta).filter(Meta.id == meta_id).first()
    _verificar_propriedade(meta, id_usuario)

    db.delete(meta)
    db.commit()
    # 204 → sem corpo de resposta
