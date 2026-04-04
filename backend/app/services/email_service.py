import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "analyst@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""), # App Password goes here
    MAIL_FROM=os.getenv("MAIL_USERNAME", "analyst@gmail.com"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

fast_mail = FastMail(conf)

async def send_email(subject: str, email: EmailStr, body: str):
    """
    Sends an HTML formatted email report to the specified analyst.
    """
    if not conf.MAIL_PASSWORD:
        print("[EMAIL SERVICE] Skip sending: MAIL_PASSWORD not set in .env")
        return

    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=body,
        subtype="html"
    )

    try:
        await fast_mail.send_message(message)
        print(f"[EMAIL SERVICE] Alert sent to {email}")
    except Exception as e:
        print(f"[EMAIL SERVICE] Failed to send email: {str(e)}")
