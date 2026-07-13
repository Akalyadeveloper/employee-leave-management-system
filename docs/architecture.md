# 🏗️ System Architecture

This document describes the architecture of the Employee Leave Management System.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React     │  │   Zustand   │  │     Recharts        │  │
│  │   Router    │  │   Store     │  │     (Charts)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                          │                                   │
│                    API Client (fetch)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                     HTTPS + Cookies
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Express   │  │    JWT      │  │     Mongoose        │  │
│  │   Routes    │  │    Auth     │  │     (ODM)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                          │                                   │
│                    Zod Validation                            │
└─────────────────────────────────────────────────────────────┘
                           │
                      MongoDB Driver
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  ┌─────────────────┐  ┌────────────────────────────────┐    │
│  │     Users       │  │       LeaveRequests            │    │
│  └─────────────────┘  └────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Concepts

### User Roles
| Role | Description | Capabilities |
|------|-------------|--------------|
| **Employee** | Regular staff member | Apply, view, cancel leaves |
| **Manager** | Team supervisor | Approve, reject, view all leaves |

### Leave Types
| Type | Default Balance | Description |
|------|-----------------|-------------|
| **Sick** | 10 days | Medical/health related |
| **Casual** | 5 days | Personal errands |
| **Vacation** | 5 days | Planned time off |

### Leave Status Flow
```
┌──────────┐    Apply     ┌──────────┐
│  (new)   │ ───────────► │ Pending  │
└──────────┘              └──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │ Approved │    │ Rejected │    │ Cancelled│
        └──────────┘    └──────────┘    └──────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Layer | Tool | Purpose |
|-------|------|---------|
| UI Framework | React 19 + Vite | Fast component-based UI |
| State Management | Zustand | Lightweight global state |
| Routing | React Router v6 | Client-side navigation |
| Charts | Recharts | Data visualization |
| Styling | CSS Variables + Modules | Theming and scoped styles |
| API Client | Fetch with credentials | HTTP requests with cookies |

### Backend
| Layer | Tool | Purpose |
|-------|------|---------|
| Framework | Express 5 | HTTP server |
| Database | MongoDB + Mongoose 9 | Document storage + ODM |
| Authentication | JWT + HTTP-only Cookies | Stateless sessions |
| Validation | Zod | Request/response schemas |
| Password | bcryptjs | Secure hashing |

---

## 📦 Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,              // 2-50 characters
  email: String,             // unique, valid email
  password: String,          // bcrypt hashed
  role: 'employee' | 'manager',
  leaveBalance: {
    sick: Number,            // default: 10
    casual: Number,          // default: 5
    vacation: Number         // default: 5
  },
  createdAt: Date,
  updatedAt: Date
}
```

### LeaveRequest Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // ref: User
  leaveType: 'sick' | 'casual' | 'vacation',
  startDate: Date,
  endDate: Date,
  totalDays: Number,         // calculated
  reason: String,            // 10-500 characters
  status: 'pending' | 'approved' | 'rejected',
  managerComment: String,    // optional
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

```
┌────────┐         ┌────────┐         ┌────────┐
│ Client │         │ Server │         │   DB   │
└───┬────┘         └───┬────┘         └───┬────┘
    │                  │                  │
    │  POST /login     │                  │
    │ ────────────────►│                  │
    │                  │  Find user       │
    │                  │ ────────────────►│
    │                  │  User data       │
    │                  │ ◄────────────────│
    │                  │                  │
    │                  │  Verify password │
    │                  │  Generate JWT    │
    │                  │                  │
    │  Set-Cookie: JWT │                  │
    │ ◄────────────────│                  │
    │                  │                  │
    │  Subsequent requests               │
    │  (Cookie: JWT)   │                  │
    │ ────────────────►│                  │
    │                  │  Verify JWT      │
    │                  │  Extract user    │
    │                  │                  │
```

### Security Features
- ✅ HTTP-only cookies (prevents XSS token theft)
- ✅ Secure flag in production
- ✅ SameSite=None for cross-origin (Vercel)
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod

---

## 📁 Project Structure

### Frontend (`src/`)
```
src/
├── api/           # API client wrapper
├── components/    # Reusable UI components
│   ├── charts/    # Recharts components
│   └── ...
├── pages/         # Route components
│   ├── auth/      # Login, Register
│   ├── employee/  # Employee pages
│   └── manager/   # Manager pages
├── store/         # Zustand stores
├── ui/            # Theme system
└── utils/         # Helper functions
```

### Backend (`server/src/`)
```
server/src/
├── config/        # Database connection
├── controllers/   # Route handlers
├── middleware/    # Auth, error handling
├── models/        # Mongoose schemas
├── routes/        # Express routes
├── scripts/       # Database seeding
└── utils/         # Helpers, validators
```

---

## 🔄 State Management

### Zustand Stores

**authStore**
- `user` - Current user object
- `isAuthenticated` - Boolean flag
- `login()` - Authenticate user
- `logout()` - Clear session
- `checkAuth()` - Verify existing session

**leaveStore**
- `requests` - Leave request list
- `balance` - Leave balance object
- `fetchRequests()` - Load requests
- `applyLeave()` - Submit new request
- `cancelRequest()` - Remove pending request

---

## 🌐 API Design

### REST Conventions
- Resources: `/api/leaves`, `/api/auth`
- Actions: GET (read), POST (create), PUT (update), DELETE (remove)
- Responses: `{ success: boolean, data?: any, message?: string }`

### Error Handling
- 400: Validation errors
- 401: Authentication required
- 403: Forbidden (wrong role)
- 404: Resource not found
- 500: Server error

---

## 📈 Performance Considerations

### Frontend
- Vite for fast HMR and builds
- Lazy loading for routes (future)
- Auto-refresh every 10 seconds for real-time updates

### Backend
- MongoDB indexes on `user` and `status` fields
- Connection pooling via Mongoose
- Serverless-ready for Vercel deployment

---

## 🚀 Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Vercel CDN    │         │   Vercel Edge   │
│   (Frontend)    │ ◄─────► │   (Backend)     │
└─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  MongoDB Atlas  │
                            │   (Database)    │
                            └─────────────────┘
```

### Deployment Considerations
- Frontend: Static assets on Vercel CDN
- Backend: Serverless functions on Vercel
- Database: MongoDB Atlas (cloud-hosted)
- CORS: Configured for cross-origin cookies

