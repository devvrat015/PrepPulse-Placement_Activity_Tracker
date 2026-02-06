# API Testing Guide

Test all endpoints using curl, Postman, or Thunder Client.

## Prerequisites

- Backend running on http://localhost:5000
- MongoDB connected
- Get auth token from login endpoint

## Quick Test Script

Save as `test.sh` (Linux/macOS) and run: `bash test.sh`

```bash
#!/bin/bash

API="http://localhost:5000/api"
HEADER_JSON="Content-Type: application/json"

echo "=== Testing Smart Placement Tracker API ==="

# 1. REGISTER
echo -e "\n1. Testing REGISTER"
REGISTER=$(curl -s -X POST "$API/auth/register" \
  -H "$HEADER_JSON" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }')
echo "$REGISTER" | jq '.'
TOKEN=$(echo "$REGISTER" | jq -r '.token')

# 2. LOGIN
echo -e "\n2. Testing LOGIN"
LOGIN=$(curl -s -X POST "$API/auth/login" \
  -H "$HEADER_JSON" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }')
echo "$LOGIN" | jq '.'

# 3. GET ME
echo -e "\n3. Testing GET ME"
curl -s -X GET "$API/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 4. CREATE ACTIVITY
echo -e "\n4. Testing CREATE ACTIVITY"
ACTIVITY=$(curl -s -X POST "$API/activities" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" \
  -d '{
    "date": "2024-01-27T10:00:00Z",
    "type": "DSA",
    "duration": 60,
    "confidenceLevel": 4,
    "notes": "Solved 5 LeetCode problems"
  }')
echo "$ACTIVITY" | jq '.'
ACTIVITY_ID=$(echo "$ACTIVITY" | jq -r '._id')

# 5. GET ACTIVITIES
echo -e "\n5. Testing GET ACTIVITIES"
curl -s -X GET "$API/activities" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 6. GET WEEKLY ACTIVITIES
echo -e "\n6. Testing GET WEEKLY ACTIVITIES"
curl -s -X GET "$API/activities/weekly" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 7. CREATE APPLICATION
echo -e "\n7. Testing CREATE APPLICATION"
APPLICATION=$(curl -s -X POST "$API/applications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" \
  -d '{
    "companyName": "Google",
    "role": "Software Engineer",
    "appliedDate": "2024-01-25T00:00:00Z"
  }')
echo "$APPLICATION" | jq '.'
APP_ID=$(echo "$APPLICATION" | jq -r '._id')

# 8. GET APPLICATIONS
echo -e "\n8. Testing GET APPLICATIONS"
curl -s -X GET "$API/applications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 9. UPDATE APPLICATION
echo -e "\n9. Testing UPDATE APPLICATION"
curl -s -X PATCH "$API/applications/$APP_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" \
  -d '{
    "status": "OA"
  }' | jq '.'

# 10. GET ANALYTICS
echo -e "\n10. Testing GET ANALYTICS"
curl -s -X GET "$API/analytics/summary" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 11. DELETE ACTIVITY
echo -e "\n11. Testing DELETE ACTIVITY"
curl -s -X DELETE "$API/activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

# 12. DELETE APPLICATION
echo -e "\n12. Testing DELETE APPLICATION"
curl -s -X DELETE "$API/applications/$APP_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "$HEADER_JSON" | jq '.'

echo -e "\n=== All tests completed ==="
```

## Individual Endpoint Tests

### Auth Endpoints

#### 1. Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 3. Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-27T10:00:00Z"
}
```

---

### Activity Endpoints

#### 4. Create Activity

```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-27T10:00:00Z",
    "type": "DSA",
    "duration": 90,
    "confidenceLevel": 4,
    "notes": "Solved LeetCode Medium problems"
  }'
```

**Expected Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "date": "2024-01-27T10:00:00Z",
  "type": "DSA",
  "duration": 90,
  "confidenceLevel": 4,
  "notes": "Solved LeetCode Medium problems",
  "createdAt": "2024-01-27T10:15:00Z"
}
```

**Activity Types:**

- `DSA` - Data Structures & Algorithms
- `RESUME` - Resume Building
- `INTERVIEW` - Mock Interview
- `APPLICATION` - Company Application

#### 5. Get All Activities

```bash
curl -X GET http://localhost:5000/api/activities \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "date": "2024-01-27T10:00:00Z",
    "type": "DSA",
    "duration": 90,
    "confidenceLevel": 4,
    "notes": "Solved LeetCode Medium problems",
    "createdAt": "2024-01-27T10:15:00Z"
  },
  ...
]
```

#### 6. Get Weekly Activities (Last 7 Days)

```bash
curl -X GET http://localhost:5000/api/activities/weekly \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    ...
  }
]
```

#### 7. Delete Activity

```bash
curl -X DELETE http://localhost:5000/api/activities/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "message": "Activity deleted"
}
```

---

### Application Endpoints

#### 8. Create Application

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Google",
    "role": "Software Engineer, Backend",
    "status": "APPLIED",
    "appliedDate": "2024-01-20T00:00:00Z"
  }'
```

**Expected Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "companyName": "Google",
  "role": "Software Engineer, Backend",
  "status": "APPLIED",
  "appliedDate": "2024-01-20T00:00:00Z",
  "createdAt": "2024-01-27T10:15:00Z",
  "updatedAt": "2024-01-27T10:15:00Z"
}
```

**Status Options:**

- `APPLIED` - Initial application
- `OA` - Online Assessment
- `INTERVIEW` - Interview stage
- `OFFER` - Offer received
- `REJECTED` - Application rejected

#### 9. Get All Applications

```bash
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "companyName": "Google",
    "role": "Software Engineer, Backend",
    "status": "APPLIED",
    "appliedDate": "2024-01-20T00:00:00Z",
    "createdAt": "2024-01-27T10:15:00Z",
    "updatedAt": "2024-01-27T10:15:00Z"
  },
  ...
]
```

#### 10. Update Application

```bash
curl -X PATCH http://localhost:5000/api/applications/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INTERVIEW"
  }'
```

**Expected Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "companyName": "Google",
  "role": "Software Engineer, Backend",
  "status": "INTERVIEW",
  "appliedDate": "2024-01-20T00:00:00Z",
  "createdAt": "2024-01-27T10:15:00Z",
  "updatedAt": "2024-01-27T10:20:00Z"
}
```

#### 11. Delete Application

```bash
curl -X DELETE http://localhost:5000/api/applications/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "message": "Application deleted"
}
```

---

### Analytics Endpoint

#### 12. Get Analytics Summary

```bash
curl -X GET http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer <your_token_here>" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "streak": 5,
  "weeklyEffort": 12.5,
  "distribution": {
    "DSA": 40,
    "RESUME": 20,
    "INTERVIEW": 25,
    "APPLICATION": 15
  },
  "readinessScore": 72,
  "weakArea": {
    "type": "APPLICATION",
    "suggestion": "Apply to more companies - increase your placement chances"
  },
  "totalActivities": 20
}
```

---

## Error Test Cases

### 1. Invalid Email (Register)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "password": "Pass123"
  }'
```

**Expected Error:**

```json
{
  "error": "Email validation failed"
}
```

### 2. Duplicate Email

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "existing@example.com",
    "password": "Pass123"
  }'
```

**Expected Error:**

```json
{
  "error": "Email already registered"
}
```

### 3. Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here" \
  -H "Content-Type: application/json"
```

**Expected Error:**

```json
{
  "error": "Invalid token"
}
```

### 4. No Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Content-Type: application/json"
```

**Expected Error:**

```json
{
  "error": "No token provided"
}
```

### 5. Unauthorized Access (Different User's Activity)

```bash
# User A creates activity with ID: 507f1f77bcf86cd799439012
# User B tries to delete it
curl -X DELETE http://localhost:5000/api/activities/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <user_b_token>" \
  -H "Content-Type: application/json"
```

**Expected Error:**

```json
{
  "error": "Unauthorized"
}
```

---

## Postman Collection

Import into Postman:

1. File → Import
2. Paste this JSON:

```json
{
  "info": {
    "name": "Placement Tracker API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/register",
            "body": {
              "raw": "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Pass123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/login",
            "body": {
              "raw": "{\"email\":\"test@test.com\",\"password\":\"Pass123\"}"
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/auth/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Performance Testing

### Load Test (10 requests, 5 concurrent)

```bash
ab -n 10 -c 5 -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/analytics/summary
```

### Response Time

- Expected: < 200ms for all endpoints
- Analytics calculation: < 100ms

---

## Debugging Tips

1. **Check Token**

   ```bash
   jwt.io # Paste token to decode
   ```

2. **Monitor Backend Logs**

   ```bash
   # Terminal running backend
   # Look for: "MongoDB connected", errors
   ```

3. **Check Network in Browser DevTools**
   - Open DevTools → Network
   - Create activity
   - Check POST request headers and response

4. **Test Health Endpoint**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"API is running"}
   ```

---

## Notes

- Timestamps are in ISO 8601 format (UTC)
- All requests require `Content-Type: application/json`
- Protected routes require `Authorization: Bearer <token>` header
- Token expires in 7 days
- User can only access their own data
- Use `jq` to format JSON in curl output

Happy testing! 🧪
