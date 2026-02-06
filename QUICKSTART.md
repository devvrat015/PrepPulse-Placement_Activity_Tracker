# 🚀 Quick Start Guide

Get the Smart Placement Activity Tracker running in 5 minutes.

## Option 1: Automated Setup (Recommended)

### Windows PowerShell

```powershell
# Clone/navigate to project
cd mern-project

# Start MongoDB (if installed locally)
Start-Process mongod

# Start Backend
Start-Process powershell -ArgumentList "cd backend; npm install; npm start"

# Wait 10 seconds for backend to start
Start-Sleep -Seconds 10

# Start Frontend
Start-Process powershell -ArgumentList "cd frontend; npm install; npm start"

# Browser will auto-open at http://localhost:3000
```

### macOS/Linux Bash

```bash
cd mern-project

# Start MongoDB in background
mongod &

# Start Backend
cd backend && npm install && npm start &
sleep 10

# Start Frontend
cd frontend && npm install && npm start
```

## Option 2: Manual Setup (Step by Step)

### Step 1: Terminal 1 - Start MongoDB

```bash
mongod
```

### Step 2: Terminal 2 - Start Backend

```bash
cd backend
npm install
npm start
```

You should see:

```
MongoDB connected
Server running on port 5000
```

### Step 3: Terminal 3 - Start Frontend

```bash
cd frontend
npm install
npm start
```

Browser will open at `http://localhost:3000`

## First Steps

1. **Register Account**
   - Email: `test@example.com`
   - Password: `Test@123`
   - Name: `Test User`

2. **Add Your First Activity**
   - Click "Add Activity"
   - Type: DSA
   - Duration: 60 minutes
   - Confidence: 4/5
   - Notes: "Solved LeetCode problems"

3. **View Analytics**
   - Go to Dashboard
   - See your stats update in real-time

4. **Add Company Application**
   - Go to "Companies"
   - Add Google, Software Engineer
   - Status: Applied
   - Update status as you progress

## Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Verify Setup

1. Open http://localhost:5000/api/health
   - Should see: `{"status":"API is running"}`

2. Register new account and verify JWT token in localStorage

3. Add activity and check Analytics API:
   - Open DevTools → Network → Click activity creation
   - POST request to `/api/analytics/summary` should return score

## Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process  # Windows
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is installed and running
mongod --version

# For Windows, ensure MongoDB service is running
# Services → MongoDB Server → Start
```

### Blank Page After Login

- Clear browser cache (Ctrl+Shift+Delete)
- Check DevTools Console for errors
- Verify backend is running on port 5000

## Need Help?

Check these files for setup:

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Main: `README.md`
