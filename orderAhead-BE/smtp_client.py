import smtplib
import email.utils
from email.mime.text import MIMEText


def send_email(sender, recipient, content):

  msg = MIMEText('Welcome to order ahead.')
  msg['To'] = email.utils.formataddr(('Hi, ', recipient))
  msg['From'] = email.utils.formataddr(('From ', sender))
  msg['Subject'] = content

  client = smtplib.SMTP('127.0.0.1', 25)
  client.set_debuglevel(True) # show communication with the server

  try:
    client.sendmail(sender, [recipient], msg.as_string())
  finally:
    client.quit()
