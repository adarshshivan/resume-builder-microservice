# Possible Approaches Considered

Before building the Resume Builder, several architectural options were evaluated:


## 1. EC2-Based Server
A backend hosted on an EC2 instance running a Python/Node.js server.

### Pros:
- Full control
- Easy debugging

### Cons:
- Expensive
- Requires patching & maintenance


## 2. Container-Based (ECS / EKS)
Run the backend inside Docker containers.

### Pros:
- Highly scalable
- Portable across cloud providers

### Cons:
- Unnecessary complexity
- Requires cluster management
- More setup effort


## 3. Serverless (Lambda + API Gateway) — Chosen
Best fit for a lightweight resume tool.

### Pros:
- No servers to manage  
- Pay-per-use  
- Instant scaling  
- Simple integration with S3 & DynamoDB  

### Cons:
- Cold starts  
- API Gateway mapping requires care  


## 4. Static Hosting With No Backend
Store resumes in browser localStorage only.

### Pros:
- Very simple  
- Zero cost  

### Cons:
- No persistence  
- Cannot generate PDFs  

---
