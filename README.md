<div align="center">

# Employee Leave Management System

A full-stack React + Express app that lets employees submit leave requests and managers approve or reject them. The requirements come from `public/Employee Leave Management System.txt`, and every feature in that file is covered here with beginner-friendly code and explanations.

</div>

## Tech Stack (plain language)
- **React 19 + Vite** – builds the screens quickly with a smooth dev server.
- **Zustand** – tiny state store to remember who is logged in and reuse leave data.
- **Express + Node.js** – simple HTTP server for all API endpoints.
- **MongoDB + Mongoose** – document database to store users and leave requests.
- **JWT + cookies** – keeps login state without building a full session service.
- **Zod** – validates incoming payloads so the API stays predictable.

Read a slightly longer plan in `docs/architecture.md`.

## Project Structure
Each folder is kept small on purpose so navigation stays easy. Here is the full tree with the actual file names:

```
emp-leave-mgmt/
├── .env.example
├── README.md
├── package.json
├── vite.config.js
├── docs/
│   └── architecture.md
├── public/
│   ├── Employee Leave Management System.pdf
│   ├── Employee Leave Management System.txt
│   └── vite.svg
├── src/
│   ├── main.jsx                # React entry
│   ├── App.jsx / App.css       # Routing + global layout styles
│   ├── index.css               # Base typography + colors
│   ├── api/
│   │   └── client.js           # Fetch wrapper with credentials
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── LeaveTable.jsx
│   │   ├── Loader.jsx
│   │   ├── RouteGuards.jsx
│   │   └── StatsGrid.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── employee/
│   │   │   ├── ApplyLeave.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── MyRequests.jsx
│   │   │   └── Profile.jsx
│   │   └── manager/
│   │       ├── AllRequests.jsx
│   │       ├── ManagerDashboard.jsx
│   │       └── PendingRequests.jsx
│   ├── store/
│   │   ├── authStore.js
│   │   └── leaveStore.js
│   └── utils/
│       └── format.js
├── server/
│   ├── package.json            # Backend scripts + deps
│   └── src/
│       ├── server.js           # Express bootstrap
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── dashboard.controller.js
│       │   └── leave.controller.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── LeaveRequest.js
│       │   └── User.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── dashboard.routes.js
│       │   └── leave.routes.js
│       └── utils/
│           ├── constants.js
│           ├── date.js
│           └── validators.js
```

Use this section whenever you need to jump to a specific feature—client code lives under `src/…`, while every API concern lives under `server/src/…` with matching names for controllers, routes, and helpers.

## Quick Start
1. **Install dependencies**
	```bash
	npm install          # frontend packages
	cd server && npm install
	```
2. **Create environment files**
	- Copy `.env.example` to `server/.env` and fill in:
	  - `MONGO_URI` – use the MongoDB Atlas URL from the text file or your own.
	  - `JWT_SECRET` – any random string.
	  - `CLIENT_URL` – usually `http://localhost:5173`.
	- Copy the same file to the project root if you want to override `VITE_API_BASE_URL`.
3. **Run the backend**
	```bash
	npm run server      # wraps: npm --prefix server run dev
	```
4. **Run the frontend**
	```bash
	npm run dev
	```
5. Open `http://localhost:5173`, register at least one employee and one manager, then start sending/approving leave requests.

## Available Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Starts the React dev server with Vite. |
| `npm run build` | Builds the production-ready frontend. |
| `npm run preview` | Serves the built frontend locally. |
| `npm run server` | Runs the Express API with Nodemon from the `server` folder. |
| `npm run server:start` | Runs the Express API with Node for production. |

Backend-only scripts still live inside `server/package.json` (`npm run dev`, `npm start`).

## Environment Variables Explained
| Name | Why it matters |
| --- | --- |
| `PORT` | Port for the Express API (default 5000). |
| `MONGO_URI` | Connection string to MongoDB Atlas/Replica. |
| `MONGO_DB` | Database name for this project. |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens. |
| `CLIENT_URL` | Allowed frontend origins for CORS/cookies (comma separated). |
| `VITE_API_BASE_URL` | Frontend base URL for API calls (default `http://localhost:5000/api`). |

## Feature Checklist
### Employee
- Register/Login with role selection.
- Dashboard that shows total requests, pending count, approved count, rejected count, upcoming leaves, and balance.
- Apply for sick/casual/vacation leave with reason and date range.
- View, filter, and cancel pending requests.
- Profile page showing personal info and quick logout.

### Manager
- Login to dedicated dashboard with team stats.
- See all pending leave requests in one table.
- Approve or reject requests with optional comments.
- Browse the complete leave history of all employees.

### API Highlights
- `/api/auth/*` – registration, login, logout, and `me` endpoint for profile data.
- `/api/leaves/*` – employee submission flow plus manager approval endpoints.
- `/api/dashboard/*` – role-based stats for quick overview cards.

Every endpoint listed in the requirement document is implemented in `server/src/routes` and documented inline with small comments.

## Testing Tips
- Use Thunder Client/Postman to hit `http://localhost:5000/api/health` and confirm the server is alive.
- Create one manager and one employee account, then test the employee journey end-to-end before approving as a manager.
- If something fails, the API responds with a clear message (thanks to Zod validation) so the UI can show friendly errors.

## Next Steps / Deployment
1. **Screenshots or video** – capture short clips for the README as requested (2-5 minutes walkthrough).
2. **Production build** – deploy the backend (Render, Railway, etc.) and front (Netlify, Vercel). Update `CLIENT_URL` and `VITE_API_BASE_URL` accordingly.
3. **Monitoring** – keep Mongo Atlas metrics open to monitor usage.

This repository now includes all required deliverables: clean code, documentation, `.env.example`, and a working application ready for deployment.
