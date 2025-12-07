# Architecture Overview

The Resume Builder uses a modern, fully serverless design.


##  Architecture Diagram

![Architecture](../images/architecture/resume-builder-archi.png)
 

## DynamoDB Schema

**Partition Key:** `email` (String)  
**Attributes:**  
- name  
- phone  
- summary  
- skills (List)  
- experience (List of Maps)  
- education (List of Maps)  

## PDF Generation Workflow

1. User clicks “Download PDF”  
2. Frontend calls `/resume/{email}/download`  
3. Lambda fetches resume from DynamoDB  
4. Lambda renders PDF buffer  
5. PDF uploaded to S3  
6. Lambda returns **presigned URL**  
7. Frontend opens S3 URL for download  

## CORS Layer
Every Lambda returns headers:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*"
}
```

## Fallback Logic

- Frontend auto-detects API reachability:
- If /resume responds → Cloud Mode
- If unreachable → Demo Mode

---