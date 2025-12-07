# Challenges and Solutions

This section highlights real issues encountered during development.

## Challenge 1 — CORS Errors on PUT Method
**Cause:** Missing header mappings  

**Solution:** Added CORS headers directly inside each Lambda response.

##  Challenge 2 — Email Field Cannot Be Updated
DynamoDB throws:
`Cannot update attribute email. This attribute is part of the key`

**Fix:** Explicitly remove `email` from update payload.

## Challenge 3 — Lambda Environment Variable Missing
Error:
`KeyError: 'DYNAMODB_TABLE'`

**Fix:** Add environment variable in Lambda console.

## Challenge 4 — API Gateway Integration Mismatches
Solution:
- Recreate method request mappings  
- Fixed Integration Request body templates  
- Redeployed API  

## Challenge 5 — Need for Offline Mode
Solution:
- Added API reachability check  
- Switched dynamically between Cloud and Demo modes  

## Challenge 6 — PDF Pre-Signed URL Expiry
Ensured:
- Expiry = 5 minutes  
- S3 bucket private  
- No public access required  

---
