# 🚀 Deployment Guide

Complete guide to deploying the Employee Leave Management System to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ A [GitHub](https://github.com) account with your code pushed
2. ✅ A [Vercel](https://vercel.com) account (free tier works)
3. ✅ A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

## Step 1: Set Up MongoDB Atlas

### Create a Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
5. Select a cloud provider and region closest to you
6. Click **"Create Cluster"**

### Configure Database Access

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Create a username and password
4. Set privileges to **"Read and write to any database"**
5. Click **"Add User"**

### Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or `0.0.0.0/0`)
4. Click **"Confirm"**

### Get Connection String

1. Go to **"Database"** → **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add database name before `?` (e.g., `...mongodb.net/leave_mgmt?...`)

**Example:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/leave_mgmt?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend to Vercel

### Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository

### Configure Build Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `server` |
| **Framework Preset** | Other |
| **Build Command** | `npm install` |
| **Output Directory** | `.` |
| **Install Command** | `npm install` |

### Set Environment Variables

Add these variables in Vercel's dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `MONGO_DB` | `leave_mgmt` | Database name |
| `JWT_SECRET` | `your-secret-key-123` | Any secure random string |
| `CLIENT_URL` | `https://your-frontend.vercel.app` | Frontend URL (update after frontend deploy) |

### Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Note your backend URL: `https://your-backend-xxx.vercel.app`

### Verify Backend

Test the health endpoint:
```
https://your-backend-xxx.vercel.app/api/health
```

Should return:
```json
{ "status": "ok", "timestamp": "..." }
```

---

## Step 3: Deploy Frontend to Vercel

### Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the **same** GitHub repository

### Configure Build Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `.` (root) |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Set Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-xxx.vercel.app/api` |

⚠️ Replace with your actual backend URL from Step 2.

### Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Note your frontend URL: `https://your-frontend-xxx.vercel.app`

---

## Step 4: Update Backend CORS

1. Go to your **backend** project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Update `CLIENT_URL` with your frontend URL
4. Click **"Save"**
5. Go to **Deployments** and click **"Redeploy"** on the latest deployment

---

## Step 5: Seed Database (Optional)

To populate demo data:

```bash
# Clone your repo locally
git clone https://github.com/yourusername/emp-leave-mgmt.git
cd emp-leave-mgmt/server

# Create .env with production MongoDB URI
echo "MONGO_URI=your-production-mongodb-uri" > .env

# Run seed script
npm run seed
```

---

## Troubleshooting

### ❌ CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Verify `CLIENT_URL` in backend matches your frontend URL exactly
2. Include `https://` in the URL
3. Redeploy backend after changing environment variables

### ❌ Cookies Not Working

**Problem:** Login works but user stays logged out

**Solution:**
1. Ensure both frontend and backend use `https://`
2. Verify cookie settings in `server/src/server.js`:
   ```javascript
   cookie: {
     secure: true,
     sameSite: 'none',
     domain: undefined
   }
   ```

### ❌ MongoDB Connection Fails

**Problem:** Database connection errors

**Solution:**
1. Check `MONGO_URI` format is correct
2. Verify IP whitelist includes `0.0.0.0/0`
3. Confirm database user has correct permissions
4. Check password doesn't have special characters that need URL encoding

### ❌ Build Fails

**Problem:** Vercel build errors

**Solution:**
1. Check build logs for specific errors
2. Verify `package.json` has all dependencies
3. Test build locally: `npm run build`
4. Ensure Node.js version is compatible (18+)

### ❌ API Returns 404

**Problem:** API routes not found

**Solution:**
1. Verify `vercel.json` in server folder:
   ```json
   {
     "builds": [
       { "src": "src/server.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "src/server.js" }
     ]
   }
   ```
2. Redeploy after fixing

---

## Environment Variables Summary

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/leave_mgmt
MONGO_DB=leave_mgmt
JWT_SECRET=your-super-secret-key
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to your project in Vercel
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### Update CORS

After adding custom domain:
1. Update `CLIENT_URL` to include both Vercel and custom domain
2. Use comma-separated values: `https://custom.com,https://project.vercel.app`

---

## Deployment Checklist

Before going live, verify:

- [ ] Backend health endpoint works
- [ ] Frontend loads without errors
- [ ] User can register
- [ ] User can login
- [ ] Cookies persist across page refreshes
- [ ] Employee can apply for leave
- [ ] Manager can approve/reject leaves
- [ ] Theme toggle works
- [ ] Charts render correctly

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
