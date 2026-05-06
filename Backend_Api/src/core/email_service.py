# email_service.py
# Serviço de envio de e-mail para recuperação de senha.
# Tenta porta 587 (STARTTLS) primeiro; em caso de falha, tenta porta 465 (SSL).
# As credenciais vêm do arquivo .env
# IMPORTANTE: EMAIL_SENHA_APP deve ser uma "Senha de App" do Google, NÃO a senha normal.
# Como gerar: myaccount.google.com → Segurança → Verificação em 2 etapas → Senhas de app

import smtplib
import ssl
import logging
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Garante que vai achar o .env dentro da pasta Backend_Api, não importa de onde o uvicorn for rodado
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger(__name__)


def enviar_codigo_reset(destinatario: str, codigo: str) -> bool:
    """
    Envia o código de recuperação de senha por e-mail.
    Mantém o nome original para compatibilidade com auth_routes.py.
    Internamente chama enviar_email_reset com fallback duplo (587 STARTTLS → 465 SSL).

    @param destinatario - endereço de e-mail do usuário
    @param codigo       - código de 6 dígitos gerado para reset
    @returns bool       - True se enviou, False se falhou (loga o erro)
    """
    return enviar_email_reset(destinatario, codigo)


def enviar_email_reset(destinatario: str, codigo: str) -> bool:
    """
    Envia o código de recuperação de senha por e-mail.
    Tenta porta 587 (STARTTLS) primeiro; em caso de falha, tenta porta 465 (SSL).

    Requer no .env:
      EMAIL_REMETENTE=seu@gmail.com
      EMAIL_SENHA_APP=xxxx xxxx xxxx xxxx   ← Senha de App do Google, NÃO a senha normal

    Para gerar Senha de App: myaccount.google.com → Segurança → Senhas de app

    @param destinatario - endereço de e-mail do usuário
    @param codigo       - código de 6 dígitos gerado para reset
    @returns bool       - True se enviou, False se falhou (loga o erro)
    """
    remetente = os.getenv("EMAIL_REMETENTE", "")
    senha_app = os.getenv("EMAIL_SENHA_APP", "")

    if not remetente or not senha_app:
        logger.error("EMAIL_REMETENTE ou EMAIL_SENHA_APP não configurados no .env")
        return False

    # ── Monta a mensagem ──────────────────────────────────────────────────────
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Wavunder — Código de recuperação de senha"
    msg["From"]    = f"Wavunder <{remetente}>"
    msg["To"]      = destinatario

    texto_plano = (
        f"Seu código de recuperação Wavunder é: {codigo}\n\n"
        "Este código expira em 15 minutos.\n"
        "Se você não solicitou a recuperação, ignore este e-mail."
    )

    html = f"""
    <html><body style="font-family:sans-serif;background:#0d1117;color:#e6edf3;padding:32px;">
      <div style="max-width:480px;margin:auto;background:#161b22;border-radius:12px;padding:32px;">
        <h2 style="color:#1D9E75;margin-top:0;">Wavunder 🌊</h2>
        <p>Olá! Você solicitou a recuperação de senha.</p>
        <p>Seu código de verificação é:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;
                    color:#1D9E75;text-align:center;padding:20px 0;">
          {codigo}
        </div>
        <p style="color:#8b949e;font-size:13px;">
          Este código expira em <strong>15 minutos</strong>.<br>
          Se você não fez esta solicitação, ignore este e-mail.
        </p>
      </div>
    </body></html>
    """

    msg.attach(MIMEText(texto_plano, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    # ── Tentativa 1: porta 587 STARTTLS ──────────────────────────────────────
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
            server.ehlo()
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(remetente, senha_app)
            server.sendmail(remetente, destinatario, msg.as_string())
        logger.info(f"E-mail enviado via porta 587 para {destinatario}")
        return True
    except Exception as e1:
        logger.warning(f"Porta 587 falhou: {e1} — tentando porta 465...")

    # ── Tentativa 2: porta 465 SSL ────────────────────────────────────────────
    try:
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx, timeout=10) as server:
            server.login(remetente, senha_app)
            server.sendmail(remetente, destinatario, msg.as_string())
        logger.info(f"E-mail enviado via porta 465 para {destinatario}")
        return True
    except Exception as e2:
        logger.error(f"Porta 465 também falhou: {e2}")
        return False
