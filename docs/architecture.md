# Employee Leave Management System – Build Plan

This document keeps the plan short and beginner friendly so you can follow every step without stress.

## 1. Overall Idea
- The app is split into a **frontend** (React + Zustand + Vite) and a **backend** (Node.js + Express + MongoDB via Mongoose).
- Users sign up or log in. Each user is either an **Employee** or a **Manager**.
- Employees create leave requests. Managers review the pending requests and approve or reject them.

## 2. Tech Choices (plain language)
| Layer | Tool | Simple reason |
| --- | --- | --- |
| Frontend | React 19 + Vite | Fast, component based UI with easy dev server |
| State | Zustand | Tiny store, single file, no boilerplate |
| Styling | CSS modules via simple `.css` files | Keeps focus on layout without extra libs |
| Data fetching | Lightweight `fetch` helpers | Fewer dependencies |
| Backend | Express | Minimal HTTP server |
| Database | MongoDB Atlas (URI in txt) | Document DB fits flexible leave records |
| ORM | Mongoose | Schema validation + helpers |
| Auth | JWT stored in HTTP-only cookies | Simple stateless sessions |
| Validation | Zod | Declarative schemas re-used on both sides |

## 3. Data Models
### User
```ts
{
  name: string,
  email: string,
  password: string (hashed),
  role: 'employee' | 'manager',
  leaveBalance: {
    sick: number,
    casual: number,
    vacation: number
  },
  createdAt: Date
}
```

### LeaveRequest
```ts
{
  user: ObjectId (ref User),
  leaveType: 'sick' | 'casual' | 'vacation',
  startDate: Date,
  endDate: Date,
  totalDays: number,
  reason: string,
  status: 'pending' | 'approved' | 'rejected',
  managerComment?: string,
  createdAt: Date
}
```

## 4. REST API Checklist
| Area | Endpoint | Purpose |
| --- | --- | --- |
| Auth | `POST /api/auth/register` | Create employee or manager |
|  | `POST /api/auth/login` | Returns JWT cookie + profile |
|  | `GET /api/auth/me` | Returns profile + balance |
| Employee Leaves | `POST /api/leaves` | Submit new request |
|  | `GET /api/leaves/my-requests` | List own requests |
|  | `DELETE /api/leaves/:id` | Cancel pending request |
|  | `GET /api/leaves/balance` | Current leave counters |
| Manager Leaves | `GET /api/leaves/all` | All requests |
|  | `GET /api/leaves/pending` | Pending queue |
|  | `PUT /api/leaves/:id/approve` | Approve |
|  | `PUT /api/leaves/:id/reject` | Reject with note |
| Dashboard | `GET /api/dashboard/employee` | Approved/pending totals, used days |
|  | `GET /api/dashboard/manager` | Team stats |

## 5. Frontend Pages
1. **Public**: Login, Register.
2. **Employee** (protected): Dashboard, Apply Leave, My Requests, Profile.
3. **Manager** (protected): Dashboard, Pending Requests, All Requests.

Each page uses shared UI pieces: header, sidebar, cards, tables.

## 6. State Flow (Zustand)
- `authStore` keeps `user`, `tokenReady`, and simple helpers (`login`, `logout`, `loadProfile`).
- `leaveStore` caches requests + balances per role.
- Stores call the fetch helper which already attaches credentials.

## 7. Simple Delivery Steps
1. **Backend first**: build Express server, connect to MongoDB, add routes + validation + auth middleware.
2. **Frontend**: scaffold pages, build auth flow, wire employee actions, then manager actions.
3. **Docs**: add README, `.env.example`, and screenshots/gifs once UI ready.
4. **Testing**: run `npm run dev` (frontend) + `npm run server` (backend) + sample API calls via Thunder Client/Postman.

This plan mirrors the instructions from `public/Employee Leave Management System.txt` so every evaluation point is covered.
