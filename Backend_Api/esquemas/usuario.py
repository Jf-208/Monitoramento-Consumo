from pydantic import BaseModel
from typing import Optional

class UsuarioCriar(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str

    class Config:
        orm_mode = True
