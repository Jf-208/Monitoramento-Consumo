from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, ForeignKey, Boolean
from sqlalchemy.sql import func
from src.models.base import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)
    codigo_reset = Column(String(6), nullable=True)
    codigo_reset_expira = Column(DateTime(timezone=True), nullable=True)


class Consumo(Base):
    __tablename__ = "consumo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    tipo_consumo = Column(String(120), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    unidade_medida = Column(String(120), nullable=False)
    data_registro = Column(DateTime(timezone=True), server_default=func.now())
    is_simulado = Column(Boolean, default=False)
    nome_custom = Column(String(120), nullable=True)          # para tipo "outros": nome livre do consumo
    valor_monetario = Column(Numeric(10, 2), nullable=True)   # valor em R$ (obrigatorio em "outros", opcional nos demais)
    data_personalizada = Column(DateTime(timezone=True), nullable=True)  # data informada pelo usuario para registros retroativos


class Meta(Base):
    __tablename__ = "meta"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    tipo_consumo = Column(String(80), nullable=False)
    valor_meta = Column(Numeric(10, 2), nullable=False)
    periodo = Column(String(20), nullable=False)


class Dica(Base):
    __tablename__ = "dicas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo_consumo = Column(String(100))
    descricao = Column(Text, nullable=False)
