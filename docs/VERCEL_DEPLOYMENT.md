# Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend from this monorepo on Vercel.

## Quick Summary
- **Frontend**: Lives in root (src folder), deploys as a Vite app.
- **Backend**: Lives in `server` folder, deploys as a Node.js/Express API.
- Both have `vercel.json` config files that auto-configure Vercel.

---

## Frontend Deployment

### Step 1: Connect GitHub Repository
1. Go to [Vercel](https://vercel.com/dashboard).
2. Click **"Add New Project"**.
3. Select your GitHub repo containing this project.
4. Vercel auto-detects the root directory for the frontend.

### Step 2: Configure Project Settings
1. **Project Name**: Choose any name (e.g., `leave-mgmt-frontend`).
2. **Framework**: Should auto-detect as **Vite**.
3. **Root Directory**: Leave as `.` (root).
4. **Build Command**: Already configured in `vercel.json` as `npm run build`.

### Step 3: Add Environment Variables
1. Click **"Environment Variables"**.
2. Add this variable:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend-url.vercel.app/api
   ```
   *(Replace `your-backend-url` with your actual backend Vercel URL after deploying backend)*

### Step 4: Deploy
- Click **"Deploy"**.
- Wait for deployment to complete.
- Note your frontend URL (e.g., `https://leave-mgmt-frontend.vercel.app`).

---

## Backend Deployment

### Step 1: Connect GitHub Repository
1. Go to [Vercel](https://vercel.com/dashboard).
2. Click **"Add New Project"**.
3. Select the same GitHub repo.

### Step 2: Configure Project Settings
1. **Project Name**: Choose any name (e.g., `leave-mgmt-backend`).
2. **Root Directory**: Change to `server` (important!).
3. Build and dev commands auto-load from `server/vercel.json`.

### Step 3: Add Environment Variables
1. Click **"Environment Variables"**.
2. Add these variables:
   ```
   Name: MONGO_URI
   Value: mongodb+srv://root:123@cluster.03mpd0q.mongodb.net/?appName=Cluster
   
   Name: MONGO_DB
   Value: leave_mgmt
   
   Name: JWT_SECRET
   Value: your-strong-random-secret (use a random string)
   
   Name: CLIENT_URL
   Value: https://your-frontend-url.vercel.app
   ```
   *(Replace `your-frontend-url` with your actual frontend Vercel URL)*

### Step 4: Deploy
- Click **"Deploy"**.
- Wait for deployment to complete.
- Note your backend URL (e.g., `https://leave-mgmt-backend.vercel.app`).

---

## After Both Are Deployed

1. **Update Frontend Env Variables**:
   - Go to frontend project in Vercel > Settings > Environment Variables.
   - Update `VITE_API_BASE_URL` to your actual backend URL.
   - Redeploy frontend.

2. **Update Backend Env Variables**:
   - Go to backend project in Vercel > Settings > Environment Variables.
   - Update `CLIENT_URL` to your actual frontend URL.
   - Redeploy backend.

3. **Test**:
   - Visit your frontend URL.
   - Try registering/logging in.
   - Try creating a leave request to confirm the API connection works.

---

## Troubleshooting

**CORS errors?**
- Make sure `CLIENT_URL` in backend exactly matches your frontend URL (including https://).

**API not responding?**
- Make sure `VITE_API_BASE_URL` in frontend exactly matches your backend URL with `/api` appended.

**MongoDB connection failed?**
- Verify `MONGO_URI` is correct.
- Make sure your IP is whitelisted in MongoDB Atlas (usually set to `0.0.0.0` for Vercel).

**JWT errors?**
- Make sure `JWT_SECRET` is the same across redeploys.

---

## Environment Variables Reference

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Backend | MongoDB connection string |
| `MONGO_DB` | Backend | Database name |
| `JWT_SECRET` | Backend | Secret for signing JWTs |
| `CLIENT_URL` | Backend | Your frontend URL (for CORS) |
| `VITE_API_BASE_URL` | Frontend | Your backend API URL |

---

That's it! Both frontend and backend are now deployed and communicating on Vercel.
