import json
import boto3
import logging
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ResumeTable')
s3 = boto3.client('s3')

BUCKET_NAME = "resume-builder-pdfs-adi"   # <-- UPDATE THIS

def draw_section_header(c, text, y):
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, text)
    return y - 20

def draw_text(c, text, y, font="Helvetica", size=12, indent=40):
    c.setFont(font, size)
    for line in text.split("\n"):
        c.drawString(indent, y, line)
        y -= 15
    return y - 5

def lambda_handler(event, context):
    try:
        email = event['pathParameters']['email']

        # Fetch resume
        response = table.get_item(Key={'email': email})
        item = response.get('Item')

        if not item:
            return {"statusCode": 404, "body": json.dumps({"error": "Resume not found"})}

        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        y = height - 60

        # ===== NAME HEADER =====
        c.setFont("Helvetica-Bold", 22)
        c.drawString(40, y, item['name'])
        y -= 30

        # ===== CONTACT =====
        c.setFont("Helvetica", 12)
        c.drawString(40, y, f"Email: {item['email']}   Phone: {item.get('phone', '')}")
        y -= 30

        # ===== SUMMARY =====
        y = draw_section_header(c, "Professional Summary", y)
        summary = item.get('summary', '')
        y = draw_text(c, summary, y)

        # ===== SKILLS =====
        y = draw_section_header(c, "Skills", y)
        skills_list = ", ".join(item.get('skills', []))
        y = draw_text(c, skills_list, y)

        # ===== EXPERIENCE =====
        y = draw_section_header(c, "Experience", y)
        experience_list = item.get('experience', [])

        for job in experience_list:
            c.setFont("Helvetica-Bold", 12)
            c.drawString(40, y, f"{job.get('role', '')} — {job.get('company', '')}")
            y -= 15

            c.setFont("Helvetica", 11)
            c.drawString(40, y, f"{job.get('start', '')} to {job.get('end', '')}")
            y -= 20

            for bullet in job.get('details', []):
                c.drawString(55, y, f"• {bullet}")
                y -= 15

            y -= 15

        # ===== EDUCATION =====
        y = draw_section_header(c, "Education", y)
        education_list = item.get('education', [])

        for edu in education_list:
            c.setFont("Helvetica-Bold", 12)
            c.drawString(40, y, edu.get("degree", ""))
            y -= 15

            c.setFont("Helvetica", 11)
            c.drawString(40, y, f"{edu.get('institution', '')} — {edu.get('year', '')}")
            y -= 25

        c.save()

        buffer.seek(0)

        pdf_key = f"pdfs/{email}.pdf"

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=pdf_key,
            Body=buffer,
            ContentType="application/pdf"
        )

        presigned_url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': pdf_key},
            ExpiresIn=3600
        )

        return {
            "statusCode": 200,
            "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    },
            "body": json.dumps({"download_url": presigned_url})
        }

    except Exception as e:
        logger.error(str(e))
        return {"statusCode": 500,
        "headers": {
        "Access-Control-Allow-Origin": "*"
    },
         "body": json.dumps({"error": str(e)})}

