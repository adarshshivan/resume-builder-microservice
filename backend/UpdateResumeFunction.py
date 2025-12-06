import json
import boto3
import os
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["DYNAMODB_TABLE"])

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))  # DEBUG LOG

    try:
        email = event["pathParameters"]["email"]
        body = json.loads(event["body"])

        # Remove email if present
        body.pop("email", None)

        # If body is empty → reject
        if not body:
            raise Exception("Request body is empty or invalid")

        update_expr = []
        expr_attr_vals = {}

        # Build safe update expression
        for key, value in body.items():
            update_expr.append(f"#{key} = :{key}")
            expr_attr_vals[f":{key}"] = value

        update_expression = "SET " + ", ".join(update_expr)

        # Add ExpressionAttributeNames for reserved keywords
        expr_attr_names = {f"#{key}": key for key in body.keys()}

        print("UpdateExpression:", update_expression)
        print("ExpressionAttributeValues:", expr_attr_vals)

        table.update_item(
            Key={"email": email},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_vals,
            ReturnValues="UPDATED_NEW"
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": json.dumps({"message": "Resume updated successfully"})
        }

    except Exception as e:
        print("UPDATE ERROR:", str(e))  # Print actual error to logs
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
