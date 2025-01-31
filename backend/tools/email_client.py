import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv(dotenv_path=f"{os.getcwd()}/.env.local")

# Settings.
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

print(f"Sender email: {SENDER_EMAIL}")

target_email = "charles_nicholson@student.waylandps.org"

subject = "Test Email"
body = "This is a test email."

msg = MIMEMultipart()
msg["From"] = SENDER_EMAIL
msg["To"] = target_email
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

try:
    s = smtplib.SMTP("smtp.gmail.com", 587)
    s.starttls()
    s.login(SENDER_EMAIL, SENDER_PASSWORD)
    message = "Testing"
    s.sendmail(
        SENDER_EMAIL,
        target_email,
        msg.as_string(),
    )
    print(f"\nEmail sent successfully to {target_email} with message:\n{body}.")
except Exception as e:
    print(f"Failed to send email: {e}")
finally:
    s.quit()
