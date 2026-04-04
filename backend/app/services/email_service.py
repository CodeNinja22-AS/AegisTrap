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
        print(f"[EMAIL SERVICE] Alert SUCCESS: Sent to {email}")
    except ConnectionRefusedError:
        print("[EMAIL SERVICE] Error: SMTP connection refused. Check your network/proxy.")
    except Exception as e:
        error_msg = str(e)
        if "Authentication failed" in error_msg or "535" in error_msg:
            print("[EMAIL SERVICE] Auth ERROR: Invalid credentials or App Password. Check MAIL_PASSWORD in .env")
        elif "550" in error_msg:
            print(f"[EMAIL SERVICE] Error: Rejected recipient {email}. Check if the address is valid.")
        else:
            print(f"[EMAIL SERVICE] Unexpected Error: {error_msg}")
