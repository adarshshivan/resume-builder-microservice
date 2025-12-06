import json
import boto3
import logging

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ResumeTable')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])

        email = body['email']
        name = body.get('name', '')
        phone = body.get('phone', '')
        summary = body.get('summary', '')
        skills = body.get('skills', [])
        experience = body.get('experience', [])
        education = body.get('education', [])

        item = {
            'email': email,
            'name': name,
            'phone': phone,
            'summary': summary,
            'skills': skills,
            'experience': experience,
            'education': education
        }

        table.put_item(Item=item)

        return {
            'statusCode': 200,
            "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    },
            'body': json.dumps({'message': 'Resume created successfully'})
        }

    except Exception as e:
        logger.error(str(e))
        return {
            'statusCode': 500,
            "headers": {
        "Access-Control-Allow-Origin": "*"
    },
            'body': json.dumps({'error': str(e)})
        }
