
# Step by step tutorial

This guide explains how the entire system was implemented.

## 1. Create DynamoDB Table

Table name: `ResumeTable`  
Partition Key: `email` (String)

## 2. Create Lambda Functions

### Lambdas created:
- CreateResumeFunction  
- GetResumeFunction  
- UpdateResumeFunction  
- GenerateResumePdfFunction  

### Each function includes:
- boto3 DynamoDB calls  
- JSON input parsing  
- CORS-enabled responses  

## 3. Configure API Gateway

Routes created:

| Method | Path |
|--------|-------|
| POST | /resume |
| GET | /resume/{email} |
| PUT | /resume/{email} |
| GET | /resume/{email}/download |

All methods connected to their respective Lambdas.

## 4. Add CORS Support
Manually added:
- Method Response Headers  
- Integration Response Headers  
- OPTIONS method for each resource  

## 5. Create S3 Bucket
Bucket name example: `resume-builder-pdf-storage`

Configured for:
- Private access  
- Presigned URL downloads only  

## 6. Integrate PDF Generation
GenerateResumePDF Lambda:
- Reads DynamoDB resume  
- Formats basic PDF  
- Stores in S3  
- Returns presigned URL  

## 7. Build Frontend
HTML/CSS/JS  
Features:
- Live preview  
- Add/remove skills  
- Add/remove experience & education  
- Buttons for Save, Update, Load, Download PDF  

## 8. Add Fallback Demo Mode
JS checks:

If API returns a successful response → Use Cloud Mode  
Else → Switch to Local Demo Mode  

A UI badge shows:  
`Cloud Mode (Online)` or `Demo Mode (Local)`

## 9. Deploy to Vercel
- Push to GitHub  
- Import repo into Vercel  
- Deploy frontend instantly  

---
