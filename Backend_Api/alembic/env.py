import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Garante que o diretório raiz do projeto está no sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Carrega o .env para pegar a DATABASE_URL
load_dotenv()

# Importa o Base com todos os modelos registrados
# É ESSENCIAL importar os modelos aqui para que o Alembic os detecte
from modelos.base import Base
import modelos.modelos  # noqa: F401 — registra os modelos no Base

# Configuração do Alembic
config = context.config

# Injeta a DATABASE_URL do .env no config do Alembic
# O configparser interpreta % como sintaxe especial, então precisamos escapar %% 
database_url = os.getenv("DATABASE_URL", "sqlite:///./banco.sqlite")
config.set_main_option("sqlalchemy.url", database_url.replace("%", "%%"))

# Configura logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadados dos modelos — o Alembic usa isso para detectar mudanças
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Modo offline: gera o SQL sem conectar ao banco."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Modo online: conecta ao banco e aplica as migrações."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Detecta mudanças de tipo de coluna
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
