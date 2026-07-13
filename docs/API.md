# 📡 API Documentation

Complete API reference for the Employee Leave Management System.

## Base URL

```
Development: http://localhost:5000/api
Production:  https://your-backend.vercel.app/api
```

---

## Authentication

All protected endpoints require a valid JWT token stored in an HTTP-only cookie named `token`.

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Required, must be "employee" or "manager"

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "leaveBalance": {
      "sick": 10,
      "casual": 5,
      "vacation": 5
    }
  }
}
```

---

### Login User

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "leaveBalance": {
      "sick": 10,
      "casual": 5,
      "vacation": 5
    }
  }
}
```

**Cookie Set:**
- `token`: JWT token (HTTP-only, secure in production)

---

### Logout User

```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Headers:** Requires authentication cookie

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "leaveBalance": {
      "sick": 10,
      "casual": 5,
      "vacation": 5
    }
  }
}
```

---

## Leave Requests

### Apply for Leave (Employee)

```http
POST /api/leaves
```

**Headers:** Requires authentication (employee role)

**Request Body:**
```json
{
  "leaveType": "sick",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Medical appointment and recovery"
}
```

**Validation Rules:**
- `leaveType`: Required, must be "sick", "casual", or "vacation"
- `startDate`: Required, valid date, must be today or future
- `endDate`: Required, valid date, must be >= startDate
- `reason`: Required, 10-500 characters

**Response (201 Created):**
```json
{
  "success": true,
  "leaveRequest": {
    "_id": "64def456...",
    "user": "64abc123...",
    "leaveType": "sick",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-17T00:00:00.000Z",
    "totalDays": 3,
    "reason": "Medical appointment and recovery",
    "status": "pending",
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
}
```

---

### Get My Requests (Employee)

```http
GET /api/leaves/my-requests
```

**Headers:** Requires authentication (employee role)

**Response (200 OK):**
```json
{
  "success": true,
  "leaveRequests": [
    {
      "_id": "64def456...",
      "leaveType": "sick",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-01-17T00:00:00.000Z",
      "totalDays": 3,
      "reason": "Medical appointment",
      "status": "approved",
      "managerComment": "Get well soon!",
      "createdAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

---

### Cancel Leave Request (Employee)

```http
DELETE /api/leaves/:id
```

**Headers:** Requires authentication (employee role)

**Constraints:**
- Can only cancel requests with status "pending"
- Can only cancel your own requests

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Leave request cancelled successfully"
}
```

---

### Get Leave Balance (Employee)

```http
GET /api/leaves/balance
```

**Headers:** Requires authentication (employee role)

**Response (200 OK):**
```json
{
  "success": true,
  "balance": {
    "sick": 7,
    "casual": 5,
    "vacation": 3
  }
}
```

---

### Get All Requests (Manager)

```http
GET /api/leaves/all
```

**Headers:** Requires authentication (manager role)

**Response (200 OK):**
```json
{
  "success": true,
  "leaveRequests": [
    {
      "_id": "64def456...",
      "user": {
        "_id": "64abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "leaveType": "sick",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-01-17T00:00:00.000Z",
      "totalDays": 3,
      "reason": "Medical appointment",
      "status": "pending",
      "createdAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

---

### Get Pending Requests (Manager)

```http
GET /api/leaves/pending
```

**Headers:** Requires authentication (manager role)

**Response (200 OK):**
```json
{
  "success": true,
  "leaveRequests": [
    {
      "_id": "64def456...",
      "user": {
        "_id": "64abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "leaveType": "vacation",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-05T00:00:00.000Z",
      "totalDays": 5,
      "reason": "Family vacation",
      "status": "pending",
      "createdAt": "2024-01-20T12:00:00.000Z"
    }
  ]
}
```

---

### Approve Leave Request (Manager)

```http
PUT /api/leaves/:id/approve
```

**Headers:** Requires authentication (manager role)

**Request Body:**
```json
{
  "comment": "Approved. Enjoy your time off!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "leaveRequest": {
    "_id": "64def456...",
    "status": "approved",
    "managerComment": "Approved. Enjoy your time off!",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

**Side Effects:**
- Deducts leave days from user's balance

---

### Reject Leave Request (Manager)

```http
PUT /api/leaves/:id/reject
```

**Headers:** Requires authentication (manager role)

**Request Body:**
```json
{
  "comment": "Rejected due to project deadline. Please reschedule."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "leaveRequest": {
    "_id": "64def456...",
    "status": "rejected",
    "managerComment": "Rejected due to project deadline. Please reschedule.",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

## Dashboard

### Employee Dashboard Stats

```http
GET /api/dashboard/employee
```

**Headers:** Requires authentication (employee role)

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalRequests": 15,
    "pending": 2,
    "approved": 10,
    "rejected": 3
  },
  "leaveBalance": {
    "sick": 7,
    "casual": 3,
    "vacation": 2
  },
  "upcomingLeaves": [
    {
      "_id": "64def456...",
      "leaveType": "vacation",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-05T00:00:00.000Z",
      "totalDays": 5
    }
  ],
  "recentDecisions": [
    {
      "_id": "64def789...",
      "leaveType": "sick",
      "status": "approved",
      "managerComment": "Get well soon!",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### Manager Dashboard Stats

```http
GET /api/dashboard/manager
```

**Headers:** Requires authentication (manager role)

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalEmployees": 25,
    "totalRequests": 150,
    "pending": 8,
    "approved": 120,
    "rejected": 22
  },
  "pendingRequests": [
    {
      "_id": "64def456...",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "leaveType": "vacation",
      "startDate": "2024-02-01T00:00:00.000Z",
      "totalDays": 5
    }
  ],
  "recentDecisions": [
    {
      "_id": "64def789...",
      "user": {
        "name": "Jane Smith"
      },
      "leaveType": "sick",
      "status": "approved",
      "managerComment": "Approved",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "monthlyTrends": [
    { "month": "Jan", "requests": 12 },
    { "month": "Feb", "requests": 18 },
    { "month": "Mar", "requests": 15 }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authenticated. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Leave request not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated endpoints

---

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (development)
- Configured `CLIENT_URL` environment variable (production)

Credentials (cookies) are allowed for cross-origin requests.
