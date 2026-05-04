"""adicionar_campos_novos_consumo

Revision ID: a1b2c3d4e5f6
Revises: 392c09d03c78
Create Date: 2026-05-04 18:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '392c09d03c78'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adiciona colunas para suportar tipo "outros" e datas retroativas
    op.add_column('consumo', sa.Column('nome_custom', sa.String(120), nullable=True))
    op.add_column('consumo', sa.Column('valor_monetario', sa.Numeric(10, 2), nullable=True))
    op.add_column('consumo', sa.Column('data_personalizada', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    # Remove as colunas adicionadas
    op.drop_column('consumo', 'data_personalizada')
    op.drop_column('consumo', 'valor_monetario')
    op.drop_column('consumo', 'nome_custom')
