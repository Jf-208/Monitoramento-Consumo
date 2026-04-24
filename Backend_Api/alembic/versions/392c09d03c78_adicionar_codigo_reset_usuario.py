"""adicionar_codigo_reset_usuario

Revision ID: 392c09d03c78
Revises: 
Create Date: 2026-04-23 23:36:14.631224

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '392c09d03c78'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adiciona as colunas de reset de senha na tabela usuario
    op.add_column('usuario', sa.Column('codigo_reset', sa.String(length=6), nullable=True))
    op.add_column('usuario', sa.Column('codigo_reset_expira', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    # Remove as colunas caso precise reverter
    op.drop_column('usuario', 'codigo_reset_expira')
    op.drop_column('usuario', 'codigo_reset')
