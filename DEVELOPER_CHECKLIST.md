# Developer Checklist

Complete reference guide for working with the Smart Placement Activity Tracker.

## 🚀 Getting Started Checklist

### Prerequisites

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] npm or yarn
- [ ] Code editor (VS Code, WebStorm, etc.)
- [ ] Git installed

### Initial Setup

- [ ] Clone/download project
- [ ] Read README.md
- [ ] Review QUICKSTART.md
- [ ] Copy `.env.example` → `.env` in backend
- [ ] Configure MongoDB connection string
- [ ] Set JWT_SECRET in .env
- [ ] Copy `.env.local.example` → `.env.local` in frontend
- [ ] Run `npm install` in backend/
- [ ] Run `npm install` in frontend/

### First Run

- [ ] Start MongoDB (`mongod`)
- [ ] Start backend (`npm start` in backend/)
- [ ] Verify API health: `curl http://localhost:5000/api/health`
- [ ] Start frontend (`npm start` in frontend/)
- [ ] Register test account
- [ ] Login successfully
- [ ] Add test activity
- [ ] View dashboard
- [ ] Check browser console for errors

---

## 📝 Development Workflow

### Adding a New Feature

#### New Activity Type

- [ ] Add to Activity enum in `backend/src/models/Activity.js`
- [ ] Update activity form in `frontend/src/pages/AddActivity.js`
- [ ] Update getActivityColor() in `frontend/src/utils/helpers.js`
- [ ] Update analytics logic if needed
- [ ] Test with new activity type

#### New Analytics Metric

- [ ] Add calculation in `backend/src/controllers/analyticsController.js`
- [ ] Add to response object
- [ ] Create component to display metric (e.g., StatCard)
- [ ] Add to dashboard `frontend/src/pages/Dashboard.js`
- [ ] Test calculation with sample data

#### New Application Status

- [ ] Add to Application enum in `backend/src/models/Application.js`
- [ ] Update status dropdown in `frontend/src/pages/Applications.js`
- [ ] Update getStatusColor() in `frontend/src/utils/helpers.js`
- [ ] Test status update flow

### Code Organization Best Practices

**Backend Structure**

```
Models define schema
├─ Controllers implement logic (NO database queries in routes)
├─ Routes map URLs to controllers
└─ Middleware handles cross-cutting concerns
```

**Frontend Structure**

```
Pages (full page views)
├─ Components (reusable pieces)
├─ Hooks (logic reuse)
├─ Context (global state)
└─ Utils (helper functions)
```

### Error Handling Checklist

**Backend**

- [ ] All routes have try-catch blocks
- [ ] Validate input in controller
- [ ] Check userId ownership for data
- [ ] Return meaningful error messages
- [ ] Use appropriate HTTP status codes
  - 400: Bad request (validation)
  - 401: Unauthorized (no token)
  - 403: Forbidden (no access)
  - 404: Not found
  - 500: Server error

**Frontend**

- [ ] Catch all API errors
- [ ] Display user-friendly error messages
- [ ] Set error state on failure
- [ ] Clear errors on success
- [ ] Show loading states

### Testing Checklist

#### Manual Testing

- [ ] Register with invalid email
- [ ] Register with duplicate email
- [ ] Login with wrong password
- [ ] Add activity with missing fields
- [ ] Add activity with negative duration
- [ ] Confidence level 1-5 only
- [ ] Delete and verify removal
- [ ] Logout and verify redirect
- [ ] Access protected route without token

#### Data Integrity

- [ ] Activities only show for logged-in user
- [ ] Applications only show for logged-in user
- [ ] Cannot delete other user's data
- [ ] Streak calculation is correct
- [ ] Weekly effort calculation is correct
- [ ] Distribution percentages sum to 100%
- [ ] Readiness score is 0-100

#### UI/UX

- [ ] Form validation messages are clear
- [ ] Loading states show during API calls
- [ ] Error messages are visible
- [ ] Mobile responsive (test on mobile)
- [ ] Links navigate correctly
- [ ] Buttons are clickable
- [ ] No console errors

---

## 🔧 Common Tasks

### Debug a Backend Issue

1. Check backend console for errors
2. Look at error message carefully
3. Check MongoDB connection:
   ```bash
   # Backend logs should show:
   # MongoDB connected
   ```
4. Check environment variables:
   ```bash
   echo $MONGODB_URI
   echo $JWT_SECRET
   ```
5. Test endpoint with curl:
   ```bash
   curl -X GET http://localhost:5000/api/health
   ```
6. Check request/response in browser DevTools

### Debug a Frontend Issue

1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for API failures
4. Verify token in localStorage:
   ```javascript
   console.log(localStorage.getItem("token"));
   ```
5. Check if API_URL is correct in .env.local
6. Look at Response tab in failed API call

### Add Logging

**Backend**

```javascript
console.log("Activity created:", activity);
console.error("Error details:", error.message);
```

**Frontend**

```javascript
console.log("User data:", user);
console.error("API error:", error.response?.data);
```

### Run Tests

**Backend - Manual Testing**

```bash
# Start backend
npm start

# In another terminal, run API tests
bash test.sh  # from API_TESTING.md
```

**Frontend - Manual Testing**

1. Register account
2. Add multiple activities
3. Check dashboard calculations
4. Update application status
5. Verify all pages render

### Update Dependencies

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update

# Check for breaking changes in changelogs
```

### Create Database Backup

**MongoDB Atlas**

1. Cluster → Backup
2. Take manual snapshot
3. Download backup

**Local MongoDB**

```bash
mongodump --db placement-tracker --out backup/
```

### Reset Database

**MongoDB Atlas**

1. Cluster → Collections
2. Delete all collections
3. Or delete entire database

**Local MongoDB**

```bash
mongo placement-tracker
db.dropDatabase()
exit
```

---

## 📊 Git Workflow

### Before Committing

- [ ] Test all changes locally
- [ ] Run `npm run build` (frontend)
- [ ] Check for console errors
- [ ] Review code for obvious issues
- [ ] Update documentation if needed

### Commit Message Format

```
[Feature/Fix/Docs] Brief description

Optional longer description
```

Examples:

```
[Feature] Add weekly effort analytics
[Fix] Correct streak calculation logic
[Docs] Update API documentation
```

### Pull Request Checklist

- [ ] All tests pass
- [ ] No console warnings
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] No sensitive data in code

---

## 🎨 Code Style Guidelines

### JavaScript

```javascript
// ✅ Good
const user = await User.findById(userId);
const activities = user.activities || [];

// ❌ Avoid
var user = User.findById(userId);
let actv = [];
```

### Function Naming

```javascript
// ✅ Good
function calculateReadinessScore() {}
function handleActivityDelete() {}
const isActivityValid = () => {};

// ❌ Avoid
function calc() {}
function delete_activity() {}
const valid = () => {};
```

### Comments

```javascript
// ✅ Good - explains why, not what
// Recompute streak in case user missed a day
const streak = calculateStreak(activities);

// ❌ Avoid - states obvious
// Loop through activities
activities.forEach((activity) => {});
```

---

## 🐛 Troubleshooting

### "MongoDB Connection Error"

```
Solution:
1. Check mongod is running
2. Verify MONGODB_URI in .env
3. For Atlas: check IP whitelist
4. Try: mongodb://localhost:27017/placement-tracker
```

### "Port 5000 Already in Use"

```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### "Token Expired"

```
Solution:
1. Logout and login again
2. Clear localStorage
3. Check JWT_SECRET didn't change
4. Token expires after 7 days
```

### "Blank Dashboard"

```
Solution:
1. Check browser console for errors
2. Verify REACT_APP_API_URL in .env.local
3. Check backend is running on port 5000
4. Login again
5. Add first activity
```

### "Changes Not Showing"

```
Solution:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Verify backend changes are saved
4. Restart backend server
```

---

## 📚 Important Files Reference

| File                                  | Purpose          | Edit For         |
| ------------------------------------- | ---------------- | ---------------- |
| `backend/server.js`                   | Entry point      | Port, middleware |
| `backend/src/models/*.js`             | Database schemas | Data structure   |
| `backend/src/controllers/*.js`        | Business logic   | Feature logic    |
| `backend/src/routes/*.js`             | API endpoints    | Routes/URLs      |
| `frontend/src/App.js`                 | Routing          | New pages        |
| `frontend/src/pages/*.js`             | Page components  | Page content     |
| `frontend/src/api/endpoints.js`       | API calls        | API methods      |
| `frontend/src/context/AuthContext.js` | Auth state       | Auth logic       |
| `.env` (backend)                      | Configuration    | Secrets          |
| `.env.local` (frontend)               | Configuration    | API URL          |

---

## 🚀 Deployment Checklist

Before deploying to production:

### Backend

- [ ] Change JWT_SECRET to strong random string
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Remove console.log statements (optional)
- [ ] Test all endpoints with production data
- [ ] Setup error logging (e.g., Sentry)
- [ ] Enable HTTPS
- [ ] Whitelist frontend domain in CORS

### Frontend

- [ ] Build: `npm run build`
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Test all forms and pages
- [ ] Check responsive design
- [ ] Remove console.log statements (optional)
- [ ] Test in production URLs
- [ ] Verify analytics calculations
- [ ] Setup analytics/tracking (optional)

### General

- [ ] Database backups enabled
- [ ] Monitor error logs
- [ ] Setup uptime monitoring
- [ ] Document production procedures
- [ ] Prepare rollback plan

---

## 📞 Quick Reference

### Command Shortcuts

```bash
# Backend
cd backend
npm install      # Install dependencies
npm start        # Start server
npm run dev      # Dev with nodemon

# Frontend
cd frontend
npm install      # Install dependencies
npm start        # Start dev server
npm run build    # Create production build

# Database
mongod           # Start MongoDB

# Testing
bash test.sh     # Run API tests (from API_TESTING.md)
```

### Environment Variables

**Backend (.env)**

```
MONGODB_URI=connection_string
JWT_SECRET=secret_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env.local)**

```
REACT_APP_API_URL=http://localhost:5000/api
```

### API URLs

```
Register:     POST   /api/auth/register
Login:        POST   /api/auth/login
Get User:     GET    /api/auth/me

Add Activity: POST   /api/activities
Get Activities: GET  /api/activities
Weekly:       GET    /api/activities/weekly
Delete:       DELETE /api/activities/:id

Add App:      POST   /api/applications
Get Apps:     GET    /api/applications
Update App:   PATCH  /api/applications/:id
Delete App:   DELETE /api/applications/:id

Analytics:    GET    /api/analytics/summary
```

---

## 📋 Pre-Deployment Final Checklist

- [ ] All features working locally
- [ ] No console errors in browser
- [ ] No MongoDB errors in backend
- [ ] All test cases pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Deployment plan reviewed
- [ ] Rollback plan prepared
- [ ] Team notified of deployment

---

**Keep this checklist handy during development!** ✅
