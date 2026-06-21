"""
Contact form handler for bbc-alicia.org (Bible Baptist Church Alicia).

Receives a JSON POST from the /visit/ page form, validates it, and emails
the church inbox via Amazon SES. Mirrors the reachthephilippines pattern.

Env vars:
  RECIPIENT  - where messages are delivered (the church inbox)
  SENDER     - verified SES "From" address (the church domain)
"""
import json
import os
import re
import boto3

ses = boto3.client("ses", region_name="us-east-1")

TO_ADDR   = os.environ.get("RECIPIENT", "debogz4ever@gmail.com")
FROM_ADDR = os.environ.get("SENDER", "Bible Baptist Church Alicia <noreply@bbc-alicia.org>")

ALLOWED_ORIGINS = {
    "https://bbc-alicia.org",
    "https://www.bbc-alicia.org",
    "https://main.dx0zjjm59ozhh.amplifyapp.com",
}
DEFAULT_ORIGIN = "https://bbc-alicia.org"

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _cors(origin):
    return {
        "Access-Control-Allow-Origin": origin if origin in ALLOWED_ORIGINS else DEFAULT_ORIGIN,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }


def _response(status, body, origin):
    return {"statusCode": status, "headers": _cors(origin), "body": json.dumps(body)}


def lambda_handler(event, context):
    headers = event.get("headers") or {}
    origin = headers.get("origin") or headers.get("Origin") or ""

    method = (
        event.get("httpMethod")
        or event.get("requestContext", {}).get("http", {}).get("method")
        or "POST"
    )
    if method == "OPTIONS":
        return {"statusCode": 204, "headers": _cors(origin), "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return _response(400, {"error": "Invalid JSON body."}, origin)

    name    = (body.get("name") or "").strip()[:200]
    email   = (body.get("email") or "").strip()[:200]
    subject = (body.get("subject") or "").strip()[:200]
    message = (body.get("message") or "").strip()[:5000]
    honey   = (body.get("website") or "").strip()  # honeypot

    if honey:
        # Spam bot filled the hidden honeypot field. Pretend success.
        return _response(200, {"ok": True}, origin)

    if not name or not email or not message:
        return _response(400, {"error": "Please fill in your name, email, and message."}, origin)
    if not EMAIL_RE.match(email):
        return _response(400, {"error": "That email address doesn't look right."}, origin)

    ses_subject = f"[bbc-alicia.org] {subject or 'New message'}"
    text_body = (
        f"New message submitted via bbc-alicia.org/visit/\n\n"
        f"From:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {subject or '(none)'}\n"
        f"\n"
        f"Message:\n"
        f"{message}\n"
    )

    try:
        ses.send_email(
            Source=FROM_ADDR,
            Destination={"ToAddresses": [TO_ADDR]},
            ReplyToAddresses=[email],
            Message={
                "Subject": {"Data": ses_subject, "Charset": "UTF-8"},
                "Body": {"Text": {"Data": text_body, "Charset": "UTF-8"}},
            },
        )
    except Exception as e:
        return _response(500, {"error": f"Could not send message: {type(e).__name__}"}, origin)

    return _response(200, {"ok": True}, origin)
