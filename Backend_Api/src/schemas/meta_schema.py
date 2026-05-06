# meta_schema.py
# Schemas Pydantic para o sistema de metas.
# Segue o mesmo padrão de user_schema.py:
#   MetaCreate   — o que o frontend envia
#   MetaUpdate   — edição parcial
#   MetaResponse — o que o backend retorna

from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

# ─── TIPOS VÁLIDOS ────────────────────────────────────────────────────────────
TIPOS_VALIDOS   = {'agua', 'energia', 'outros'}
PERIODOS_VALIDOS = {'semanal', 'mensal'}

# Unidade de medida padrão por tipo
UNIDADE_POR_TIPO = {
    'agua':    'L',
    'energia': 'kWh',
    'outros':  'R$',
}


class MetaCreate(BaseModel):
    """Dados enviados pelo frontend para criar uma nova meta."""
    tipo:        str   # 'agua' | 'energia' | 'outros'
    periodo:     str   # 'semanal' | 'mensal'
    valor_meta:  float # limite definido pelo usuário — deve ser > 0
    data_inicio: str   # 'YYYY-MM-DD' — string ISO local (sem conversão UTC)

    @field_validator('tipo')
    @classmethod
    def validar_tipo(cls, v: str) -> str:
        if v not in TIPOS_VALIDOS:
            raise ValueError(f"Tipo inválido. Use: {', '.join(TIPOS_VALIDOS)}")
        return v

    @field_validator('periodo')
    @classmethod
    def validar_periodo(cls, v: str) -> str:
        if v not in PERIODOS_VALIDOS:
            raise ValueError(f"Período inválido. Use: {', '.join(PERIODOS_VALIDOS)}")
        return v

    @field_validator('valor_meta')
    @classmethod
    def validar_valor(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("O valor da meta deve ser maior que zero.")
        return v

    @field_validator('data_inicio')
    @classmethod
    def validar_data(cls, v: str) -> str:
        # Garante formato YYYY-MM-DD
        try:
            from datetime import date
            date.fromisoformat(v)
        except ValueError:
            raise ValueError("data_inicio deve estar no formato YYYY-MM-DD.")
        return v


class MetaUpdate(BaseModel):
    """Dados para edição parcial de uma meta existente."""
    valor_meta: Optional[float] = None
    ativa:      Optional[bool]  = None

    @field_validator('valor_meta')
    @classmethod
    def validar_valor(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("O valor da meta deve ser maior que zero.")
        return v


class MetaResponse(BaseModel):
    """Dados retornados pelo backend após criar, editar ou listar metas."""
    id:             int
    id_usuario:     int
    tipo:           str
    periodo:        str
    valor_meta:     float
    unidade_medida: str
    data_inicio:    str
    data_fim:       str
    ativa:          bool
    created_at:     Optional[datetime] = None

    model_config = {"from_attributes": True}
