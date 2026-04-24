import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from src.models.base import Base

# Carrega as variáveis do arquivo .env automaticamente
load_dotenv()

# Pega a URL do banco do .env
# Em produção: Supabase PostgreSQL
# Se não existir no .env, cai para o SQLite local (fallback para desenvolvimento)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./banco.sqlite")

# Configurações diferentes para SQLite e PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def criar_tabelas():
    Base.metadata.create_all(bind=engine)
