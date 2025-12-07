# Project Overview – Resume Builder Serverless Application

The **Resume Builder** is a cloud-powered application that allows users to:

- Create resumes  
- Update resumes  
- Load previously saved resumes  
- Generate downloadable PDF versions  
- Experience a seamless fallback “Demo Mode” when backend APIs are offline  

The application integrates a **Vercel-hosted frontend** with a **fully serverless backend** built on AWS.


## Key Features

### 1. **Create Resume**
Users submit personal details, skills, experience, and education, which are stored in DynamoDB.

### 2. **Update Resume**
Existing records can be updated via a dedicated PUT endpoint.

### 3. **Load Resume**
Retrieve resume details by email address using a GET request.

### 4. **Generate PDF**
A Lambda function formats resume data into a PDF and stores it in S3 for download using a pre-signed URL.

### 5. **Fallback Demo Mode**
If backend API is unreachable:
- The frontend automatically switches to local JSON storage.
- Users can still experience a fully working demo.

### 6. **Responsive UI**
Clean HTML/CSS design with live resume preview.



##  Deployment Details

- **Frontend:** Deployed on Vercel  
- **Backend:** AWS Lambda + API Gateway  
- **Database:** DynamoDB  
- **Storage:** S3  

---
