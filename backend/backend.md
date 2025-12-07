# Resume Builder – Backend (AWS Serverless)


This folder contains all backend logic for the Resume Builder Application, implemented using AWS Lambda, API Gateway, DynamoDB, and S3.

**The backend exposes REST endpoints for:**

- Creating a resume
- Loading a resume
- Updating a resume
- Generating a downloadable PDF version of the resume

This backend is fully serverless and designed for low-cost or free-tier operation.


## 1. Architecture Overview


![Architecture](../images/architecture/resume-builder-archi.png)


## 2. Lambda Functions Included in This Folder

**Place all the following scripts inside the /backend folder:**

| File Name |	Purpose |
|-----------|---------|
| create_resume.py	| M Creates a new resume (POST /resume) |
| get_resume.py |	Fetches a resume by email (GET /resume/{email}) |
| update_resume.py |	Updates selected fields of a resume (PUT /resume/{email}) |
| generate_resume_pdf.py |	Generates a downloadable PDF file and returns a pre-signed URL (GET /resume/{email}/download) |

**No health check function is included, as the frontend now detects AWS outage automatically.**

## 3. API Endpoints (Mapping Summary)

**These are the REST routes expected by the frontend:**

| Method	| Endpoint	| Lambda Function	Description |
|---------|-----------|-----------------------------|  
| POST	  | /resume	create_resume.py |	Save a new resume |
| GET	    | /resume/{email}	get_resume.py |	Retrieve resume by email |
| PUT	    | /resume/{email}	update_resume.py |	Update resume details |
| GET	    | /resume/{email}/download	generate_resume_pdf.py |	Generate & retrieve PDF via pre-signed URL |
| OPTIONS	| all routes |	—	Required for CORS |

## 4. DynamoDB Table Structure

**Table Name:**
`ResumeTable` (can rename; must match environment variable)

**Primary Key:**
`email` (String)

**Example Stored Item:**
```json
{
  "email": "akash10@gmail.com",
  "name": "John Doe",
  "phone": "9876543210",
  "summary": "Software Developer",
  "skills": ["React", "AWS"],
  "experience": [
    {
      "role": "Developer",
      "company": "ABC Corp",
      "start": "2022",
      "end": "2023",
      "details": ["Coding", "Testing"]
    }
  ],
  "education": [
    {
      "degree": "BCA",
      "institution": "XYZ College",
      "year": "2023"
    }
  ]
}
```

## 5. Required Environment Variables

**Each Lambda must include:**

| Variable |	Description |
|----------|--------------|
| DYNAMODB_TABLE | 	Name of the DynamoDB table |
| BUCKET_NAME |	S3 bucket for PDF storage (only for PDF lambda) |

## 6. IAM Permissions Required

**Attach these to the Lambda execution role:**

- Basic DynamoDB Access
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem"
  ],
  "Resource": "*"
}
```
- S3 Access (for PDF creation lambda)
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject"
  ],
  "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
}
```

## 7. Deploying the Backend (Original AWS Steps)

1. Create a DynamoDB table
2. Create Lambdas & upload scripts
3. Add environment variables
4. Create an S3 bucket (PDF)
5. Create API Gateway REST API
6. Configure routes + methods
7. Attach Lambdas to API routes
8. Enable CORS
9. Deploy API (prod stage)

## 8. Usage Flow (How Backend Works)

**POST /resume:**
Save resume into DynamoDB

**GET /resume/{email}:**
Retrieve resume → 
Return JSON

**PUT /resume/{email}:**
Update only the fields provided in the request body

**GET /resume/{email}/download:**
Build PDF →
Upload to S3 →
Return pre-signed URL
(Valid for ~1 hour)

---
