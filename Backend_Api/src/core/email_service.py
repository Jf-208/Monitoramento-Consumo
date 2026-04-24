# email_service.py
# Serviço de envio de e-mail para recuperação de senha.
# Usa o SMTP nativo do Python (smtplib) com Gmail.
# As credenciais vêm do arquivo .env

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Garante que vai achar o .env dentro da pasta Backend_Api, não importa de onde o uvicorn for rodado
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))

def enviar_codigo_reset(email_destino: str, codigo: str) -> bool:
    """
    Envia um e-mail com o código de recuperação de senha.
    Retorna True se enviado com sucesso, False se falhou.
    """
    remetente = os.getenv("EMAIL_REMETENTE")
    senha_app = os.getenv("EMAIL_SENHA_APP")

    if not remetente or not senha_app:
        print("⚠️ Credenciais de e-mail não configuradas no .env")
        return False

    # Montagem do e-mail em HTML (visual profissional)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🔐 Wavunder - Código de Recuperação: {codigo}"
    msg["From"] = f"Wavunder App <{remetente}>"
    msg["To"] = email_destino

    texto = f"""
    🔐 Wavunder - Recuperação de Senha
    
    Olá! Recebemos uma solicitação para redefinir sua senha.
    Use o código abaixo:
    
    {codigo}
    
    ⏰ Este código expira em 10 minutos.
    Se você não solicitou essa redefinição, ignore este e-mail.
    """

    html = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0B1A3B; border-radius: 16px; padding: 32px; color: #fff;">
        <h1 style="color: #F5A623; font-size: 24px; margin-bottom: 8px;">🔐 Wavunder</h1>
        <p style="color: #8899AA; font-size: 14px; margin-bottom: 24px;">Recuperação de Senha</p>
        
        <p style="color: #CCDDE8; font-size: 16px;">Olá! Recebemos uma solicitação para redefinir sua senha.</p>
        <p style="color: #CCDDE8; font-size: 16px;">Use o código abaixo:</p>
        
        <div style="background: #152C58; border: 2px solid #F5A623; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #F5A623;">{codigo}</span>
        </div>
        
        <p style="color: #8899AA; font-size: 13px;">⏰ Este código expira em <strong>10 minutos</strong>.</p>
        <p style="color: #8899AA; font-size: 13px;">Se você não solicitou essa redefinição, ignore este e-mail.</p>
        
        <hr style="border: 1px solid #1E3A5F; margin: 24px 0;">
        <p style="color: #556677; font-size: 11px; text-align: center;">Wavunder App — Monitoramento Sustentável</p>
    </div>
    """

    parte_texto = MIMEText(texto, "plain")
    parte_html = MIMEText(html, "html")

    # A ordem importa: o HTML deve vir por último num MIMEMultipart alternative
    msg.attach(parte_texto)
    msg.attach(parte_html)

    try:
        # Conecta ao servidor SMTP do Gmail
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login(remetente, senha_app)
            servidor.sendmail(remetente, email_destino, msg.as_string())
        print(f"✅ E-mail enviado para {email_destino}")
        return True
    except Exception as e:
        print(f"❌ Erro ao enviar e-mail: {e}")
        return False
