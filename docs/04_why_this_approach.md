# Why This Architecture Was Chosen

The serverless design was selected because it aligns perfectly with:


## Cost Efficiency
- pay only when Lambda runs.  
- DynamoDB Free Tier covers most usage.  
- API Gateway charges per call.

Perfect for personal learning projects and demos.


## Scalability
Automatically handles any number of requests without needing autoscaling config.



## Zero Maintenance
- No EC2 patching  
- No running servers  
- No operating system management  

## Seamless AWS Integrations
- Lambda → DynamoDB (CRUD)
- Lambda → S3 (PDF)
- Lambda → API Gateway (routing)


## Easy Frontend Hosting
Vercel simplifies global deployments with instant cache invalidation.

---
