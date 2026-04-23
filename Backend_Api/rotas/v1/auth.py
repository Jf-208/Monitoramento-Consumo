from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from banco_de_dados import get_db
from modelos.modelos import Usuario
from esquemas.usuario import UsuarioCriar, UsuarioResponse
from nucleo.seguranca import hash_senha, verificar_senha

# Aqui criamos o roteador de autenticação. É o carteiro que entrega as chamadas de /auth
auth_router = APIRouter(prefix='/auth', tags=['auth'])

# POST /auth/register
@auth_router.post('/register', response_model=UsuarioResponse)
def register(usuario_in: UsuarioCriar, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario_in.email).first()
    if usuario_existente:
        # raise para a função na hora e devolve o erro
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # O tempero do hash
    criptografada = hash_senha(usuario_in.senha)
    
    novo_usuario = Usuario(nome=usuario_in.nome, email=usuario_in.email, senha=criptografada)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

class LoginCriar(BaseModel):
    email: str
    senha: str

# POST /auth/login
@auth_router.post('/login')
def login(dados: LoginCriar, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Vê se o tempero bate
    if not verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Senha incorreta")
    
    return {
        "message": "Login realizado com sucesso!",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }

class SenhaAlterar(BaseModel):
    email: str
    senha_atual: str
    nova_senha: str

# PUT /auth/alterar-senha
@auth_router.put('/alterar-senha')
def alterar_senha(dados: SenhaAlterar, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if not verificar_senha(dados.senha_atual, usuario.senha):
        raise HTTPException(status_code=401, detail="Senha atual incorreta")
    
    # Gera o novo hash e salva
    nova_criptografada = hash_senha(dados.nova_senha)
    usuario.senha = nova_criptografada
    db.commit()
    
    return {"message": "Senha alterada com sucesso!"}
