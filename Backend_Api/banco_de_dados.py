import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from modelos.base import Base

# ATENÇÃO: Para a banca, o SQLite é a melhor opção pois cria o arquivo do banco localmente 
# sem precisar instalar e configurar o PostgreSQL.
# Se DATABASE_URL não existir, ele cria um banco.sqlite na pasta atual.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./banco.sqlite")

# Configurações do SQLite (check_same_thread=False é necessário para o FastAPI com SQLite)
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
