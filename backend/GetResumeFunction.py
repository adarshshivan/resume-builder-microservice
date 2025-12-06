import json
import boto3
import logging

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ResumeTable')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        email = event['pathParameters']['email']

        response = table.get_item(Key={'email': email})
        item = response.get('Item')

        if not item:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Resume not found'})
            }

        return {
            'statusCode': 200,
            "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
    },
            'body': json.dumps(item)
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
