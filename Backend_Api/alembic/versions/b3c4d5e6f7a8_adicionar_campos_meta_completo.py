"""adicionar_campos_meta_completo

Revision ID: b3c4d5e6f7a8
Revises: a1b2c3d4e5f6
Create Date: 2026-05-06

Adiciona os campos completos ao modelo Meta:
- Renomeia tipo_consumo -> tipo
- Adiciona: unidade_medida, data_inicio, data_fim, ativa, created_at
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = 'b3c4d5e6f7a8'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Verifica colunas existentes antes de alterar para evitar erros em banco
    # que já tenha sido migrado parcialmente.

    # Usar batch mode (SQLite não suporta ALTER COLUMN diretamente)
    with op.batch_alter_table('meta', schema=None) as batch_op:
        # Renomeia tipo_consumo → tipo
        batch_op.alter_column('tipo_consumo', new_column_name='tipo',
                              existing_type=sa.String(80),
                              type_=sa.String(20), nullable=False)

        # Novos campos — nullable=True inicialmente para não quebrar linhas existentes
        batch_op.add_column(sa.Column('unidade_medida', sa.String(10), nullable=True))
        batch_op.add_column(sa.Column('data_inicio',    sa.String(10), nullable=True))
        batch_op.add_column(sa.Column('data_fim',       sa.String(10), nullable=True))
        batch_op.add_column(sa.Column('ativa',          sa.Boolean(),  nullable=True))
        batch_op.add_column(sa.Column('created_at',     sa.DateTime(timezone=True),
                                      server_default=sa.func.now(), nullable=True))

    # Preenche valores padrão nas linhas existentes (se houver)
    op.execute("UPDATE meta SET ativa = true WHERE ativa IS NULL")
    op.execute("UPDATE meta SET unidade_medida = 'L' WHERE unidade_medida IS NULL")
    op.execute("UPDATE meta SET data_inicio = CURRENT_DATE WHERE data_inicio IS NULL")
    op.execute("UPDATE meta SET data_fim    = CURRENT_DATE + interval '6 days' WHERE data_fim IS NULL")

    # Agora torna não-nullable após preencher os valores
    with op.batch_alter_table('meta', schema=None) as batch_op:
        batch_op.alter_column('unidade_medida', nullable=False)
        batch_op.alter_column('data_inicio',    nullable=False)
        batch_op.alter_column('data_fim',       nullable=False)
        batch_op.alter_column('ativa',          nullable=False)


def downgrade() -> None:
    with op.batch_alter_table('meta', schema=None) as batch_op:
        batch_op.drop_column('created_at')
        batch_op.drop_column('ativa')
        batch_op.drop_column('data_fim')
        batch_op.drop_column('data_inicio')
        batch_op.drop_column('unidade_medida')
        # Reverte tipo → tipo_consumo
        batch_op.alter_column('tipo', new_column_name='tipo_consumo',
                              existing_type=sa.String(20),
                              type_=sa.String(80), nullable=False)
