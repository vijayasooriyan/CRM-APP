# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/login`) require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not found
- `500`: Server error

---

## Endpoints

### 1. Authentication

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin"
  }
}
```

#### Get Current User
```
GET /auth/me
```

**Success Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin"
  }
}
```

---

### 2. Leads

#### Get All Leads
```
GET /leads?page=1&limit=10&status=New&leadSource=Website&assignedSalesperson=John%20Doe&search=tech&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `status` (optional): Filter by status
- `leadSource` (optional): Filter by lead source
- `assignedSalesperson` (optional): Filter by salesperson name
- `search` (optional): Search in name, company, email
- `sortBy` (optional): Field to sort by (default: createdAt)
- `sortOrder` (optional): 'asc' or 'desc' (default: desc)

**Success Response (200):**
```json
{
  "leads": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "leadName": "John Smith",
      "companyName": "Tech Corp",
      "email": "john@techcorp.com",
      "phone": "+1-555-0101",
      "leadSource": "Website",
      "assignedSalesperson": "John Doe",
      "status": "New",
      "dealValue": 50000,
      "notes": [],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Single Lead
```
GET /leads/{leadId}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "leadName": "John Smith",
  "companyName": "Tech Corp",
  "email": "john@techcorp.com",
  "phone": "+1-555-0101",
  "leadSource": "Website",
  "assignedSalesperson": "John Doe",
  "status": "New",
  "dealValue": 50000,
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "content": "Follow up next week",
      "createdBy": "John Doe",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Create Lead
```
POST /leads
```

**Request Body:**
```json
{
  "leadName": "John Smith",
  "companyName": "Tech Corp",
  "email": "john@techcorp.com",
  "phone": "+1-555-0101",
  "leadSource": "Website",
  "assignedSalesperson": "John Doe",
  "status": "New",
  "dealValue": 50000
}
```

**Success Response (201):**
```json
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "leadName": "John Smith",
    "companyName": "Tech Corp",
    "email": "john@techcorp.com",
    "phone": "+1-555-0101",
    "leadSource": "Website",
    "assignedSalesperson": "John Doe",
    "status": "New",
    "dealValue": 50000,
    "notes": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Lead
```
PUT /leads/{leadId}
```

**Request Body:**
```json
{
  "status": "Contacted",
  "dealValue": 75000
}
```

**Success Response (200):**
```json
{
  "message": "Lead updated successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "leadName": "John Smith",
    "companyName": "Tech Corp",
    "email": "john@techcorp.com",
    "phone": "+1-555-0101",
    "leadSource": "Website",
    "assignedSalesperson": "John Doe",
    "status": "Contacted",
    "dealValue": 75000,
    "notes": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Delete Lead
```
DELETE /leads/{leadId}
```

**Success Response (200):**
```json
{
  "message": "Lead deleted successfully"
}
```

---

### 3. Notes

#### Add Note to Lead
```
POST /leads/{leadId}/notes
```

**Request Body:**
```json
{
  "content": "Follow up next week",
  "createdBy": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "Note added successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "leadName": "John Smith",
    "companyName": "Tech Corp",
    "email": "john@techcorp.com",
    "phone": "+1-555-0101",
    "leadSource": "Website",
    "assignedSalesperson": "John Doe",
    "status": "New",
    "dealValue": 50000,
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "content": "Follow up next week",
        "createdBy": "John Doe",
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Dashboard

#### Get Dashboard Statistics
```
GET /dashboard
```

**Success Response (200):**
```json
{
  "totalLeads": 25,
  "newLeads": 5,
  "qualifiedLeads": 8,
  "wonLeads": 10,
  "lostLeads": 2,
  "totalDealValue": 1250000,
  "totalWonValue": 750000,
  "leadsBySource": [
    {
      "_id": "Website",
      "count": 10
    },
    {
      "_id": "LinkedIn",
      "count": 8
    },
    {
      "_id": "Referral",
      "count": 5
    },
    {
      "_id": "Cold Email",
      "count": 2
    },
    {
      "_id": "Event",
      "count": 0
    }
  ],
  "leadsByStatus": [
    {
      "_id": "New",
      "count": 5
    },
    {
      "_id": "Contacted",
      "count": 7
    },
    {
      "_id": "Qualified",
      "count": 8
    },
    {
      "_id": "Proposal Sent",
      "count": 3
    },
    {
      "_id": "Won",
      "count": 10
    },
    {
      "_id": "Lost",
      "count": 2
    }
  ]
}
```

---

## Data Types & Validations

### Lead Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| leadName | String | Yes | Non-empty |
| companyName | String | Yes | Non-empty |
| email | String | Yes | Valid email format, unique |
| phone | String | Yes | At least 7 digits |
| leadSource | String | Yes | One of: Website, LinkedIn, Referral, Cold Email, Event |
| assignedSalesperson | String | Yes | Non-empty |
| status | String | No | One of: New, Contacted, Qualified, Proposal Sent, Won, Lost (default: New) |
| dealValue | Number | Yes | Non-negative |

### Status Values
- `New`: Freshly created lead
- `Contacted`: Initial contact has been made
- `Qualified`: Lead has been qualified as a potential customer
- `Proposal Sent`: A proposal has been sent to the lead
- `Won`: Deal has been closed successfully
- `Lost`: Lead is no longer being pursued

### Lead Source Values
- `Website`: Lead from company website
- `LinkedIn`: Lead from LinkedIn platform
- `Referral`: Lead from customer referral
- `Cold Email`: Lead from cold email campaign
- `Event`: Lead from conference or event

---

## Postman Collection

You can import this collection into Postman:

```json
{
  "info": {
    "name": "CRM API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"admin@example.com\", \"password\": \"password123\"}"
        }
      }
    },
    {
      "name": "Get All Leads",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/leads",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}]
      }
    }
  ]
}
```

---

## Rate Limiting

No rate limiting is currently implemented. Consider adding it in production.

## CORS

CORS is enabled for all origins in development. Configure as needed for production.
