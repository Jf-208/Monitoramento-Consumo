import logging
import os as _os
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.connection import get_db
from src.models.models import Usuario
from src.schemas.user_schema import UsuarioCriar, UsuarioResponse
from src.core.security import hash_senha, verificar_senha

# Logger do módulo — visível nos logs do Railway (aba Logs do serviço)
_logger = logging.getLogger(__name__)

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
    
    # SEGURANCA: Sempre retornar o mesmo erro, independente se foi email ou senha
    # Isso evita "user enumeration" — atacante nao consegue saber qual campo esta errado
    ERRO_GENERICO = HTTPException(
        status_code=401,
        detail="E-mail ou senha invalidos"
    )
    
    if not usuario:
        raise ERRO_GENERICO
    
    if not verificar_senha(dados.senha, usuario.senha):
        raise ERRO_GENERICO
    
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
    """
    Inicia o fluxo de recuperação de senha.
    Gera um código de 6 dígitos, salva com expiração de 15 min e envia por e-mail.
    Sempre retorna mensagem genérica (não revela se o e-mail existe ou não).
    """
    # Mensagem genérica — nunca revelar se o e-mail está cadastrado
    MENSAGEM_GENERICA = {"message": "Se o e-mail estiver cadastrado, você receberá o código em instantes."}

    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        # Retorna sucesso mesmo para e-mails inexistentes (evita enumeração)
        return MENSAGEM_GENERICA

    # Gera código aleatório de 6 dígitos
    codigo = str(random.randint(100000, 999999))

    # Salva o código e a data de expiração (15 minutos)
    usuario.codigo_reset = codigo
    usuario.codigo_reset_expira = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()

    # Envia o código por e-mail
    enviado = enviar_codigo_reset(dados.email, codigo)

    # Loga o resultado — visível nos logs do Railway (aba Logs do serviço)
    if enviado:
        _logger.info(f"[EMAIL OK] Codigo enviado para {dados.email}")
    else:
        _logger.error(
            f"[EMAIL FALHOU] Nao foi possivel enviar para {dados.email}. "
            f"Verifique EMAIL_REMETENTE e EMAIL_SENHA_APP nas variaveis do Railway."
        )

    return MENSAGEM_GENERICA

# ETAPA 2: Verifica o código e redefine a senha
@auth_router.post('/verificar-codigo')
def verificar_codigo(dados: VerificarCodigoRequest, db: Session = Depends(get_db)):
    """
    Conclui o fluxo de recuperação de senha.
    Valida o código (6 dígitos, não expirado), atualiza o hash bcrypt da senha.
    Invalida o código após uso bem-sucedido.
    """
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="E-mail não encontrado")

    # Verifica se o código é válido
    if usuario.codigo_reset != dados.codigo:
        raise HTTPException(status_code=400, detail="Código inválido")

    # Verifica se o código não expirou
    if usuario.codigo_reset_expira and usuario.codigo_reset_expira < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Código expirado. Solicite um novo.")

    # Redefine a senha com novo hash bcrypt
    usuario.senha = hash_senha(dados.nova_senha)
    # Invalida o código após uso — impede reutilização
    usuario.codigo_reset = None
    usuario.codigo_reset_expira = None
    db.commit()

    return {"message": "Senha redefinida com sucesso!"}


# ────────────────────────────────────────────────────────────────────────────
# DIAGNOSTICO: Testa envio de e-mail sem passar pelo fluxo de forgot-password.
# Usar para verificar se as variaveis EMAIL_REMETENTE / EMAIL_SENHA_APP
# estao corretamente configuradas no Railway Dashboard → Variables.
# ────────────────────────────────────────────────────────────────────────────
class TestarEmailRequest(BaseModel):
    destinatario: str

@auth_router.post('/testar-email')
def testar_email(dados: TestarEmailRequest):
    """
    Envia um e-mail de teste (codigo fixo 123456) para diagnosticar a configuracao SMTP.
    Retorna se as variaveis de ambiente estao configuradas e se o envio foi bem-sucedido.

    Como usar apos deploy no Railway:
        curl -X POST https://<sua-url>.up.railway.app/auth/testar-email \\
             -H 'Content-Type: application/json' \\
             -d '{"destinatario": "seu@email.com"}'

    Resposta quando funciona:
        {"enviado": true, "remetente_configurado": "seu@gmail.com", "senha_app_configurada": true}

    Resposta quando variaveis nao estao no Railway:
        {"enviado": false, "remetente_configurado": "NAO CONFIGURADO", "senha_app_configurada": false}
    """
    remetente = _os.getenv("EMAIL_REMETENTE", "NAO CONFIGURADO")
    senha_ok  = bool(_os.getenv("EMAIL_SENHA_APP", ""))

    # Log das variaveis carregadas (sem expor a senha)
    _logger.info(
        f"[DIAG] EMAIL_REMETENTE={remetente} | "
        f"EMAIL_SENHA_APP configurado={senha_ok}"
    )

    enviado = enviar_codigo_reset(dados.destinatario, "123456")

    return {
        "enviado": enviado,
        "remetente_configurado": remetente,
        "senha_app_configurada": senha_ok,
        "destinatario": dados.destinatario,
        "instrucao": (
            "Se enviado=false e senha_app_configurada=false, "
            "configure EMAIL_REMETENTE e EMAIL_SENHA_APP no Railway Dashboard -> Variables."
        )
    }
