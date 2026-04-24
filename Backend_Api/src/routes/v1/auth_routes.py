from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.models import Usuario
from src.schemas.user_schema import UsuarioCriar, UsuarioResponse
from src.core.security import hash_senha, verificar_senha

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

# ────────────────────────────────────────────────
# ESQUECI A SENHA (2 etapas)
# ────────────────────────────────────────────────
import random
from datetime import datetime, timedelta, timezone
from src.core.email_service import enviar_codigo_reset

class EsqueciSenhaRequest(BaseModel):
    email: str

class VerificarCodigoRequest(BaseModel):
    email: str
    codigo: str
    nova_senha: str

# ETAPA 1: Gera código de 6 dígitos e envia por e-mail
@auth_router.post('/esqueci-senha')
def esqueci_senha(dados: EsqueciSenhaRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="E-mail não encontrado")

    # Gera código aleatório de 6 dígitos
    codigo = str(random.randint(100000, 999999))
    
    # Salva o código e a data de expiração (10 minutos)
    usuario.codigo_reset = codigo
    usuario.codigo_reset_expira = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()

    # Envia o código por e-mail
    enviado = enviar_codigo_reset(dados.email, codigo)
    if not enviado:
        # Mesmo se o e-mail falhar, retorna o código no console para testes
        print(f"⚠️ Código para {dados.email}: {codigo}")
    
    return {"message": "Código enviado para o seu e-mail!"}

# ETAPA 2: Verifica o código e redefine a senha
@auth_router.post('/verificar-codigo')
def verificar_codigo(dados: VerificarCodigoRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="E-mail não encontrado")

    # Verifica se o código é válido
    if usuario.codigo_reset != dados.codigo:
        raise HTTPException(status_code=400, detail="Código inválido")
    
    # Verifica se o código não expirou
    if usuario.codigo_reset_expira and usuario.codigo_reset_expira < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Código expirado. Solicite um novo.")

    # Redefine a senha
    usuario.senha = hash_senha(dados.nova_senha)
    # Limpa o código usado
    usuario.codigo_reset = None
    usuario.codigo_reset_expira = None
    db.commit()

    return {"message": "Senha redefinida com sucesso!"}

