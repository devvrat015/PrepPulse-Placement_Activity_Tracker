# ⚡ Quick Reference Card

Handy cheat sheet for the Smart Placement Activity Tracker

---

## 🚀 Quick Start (Copy & Paste)

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend && npm install && npm start

# Terminal 3: Frontend
cd frontend && npm install && npm start
```

Access: http://localhost:3000

---

## 🔐 Test Credentials

```
Email: test@example.com
Password: Test@123
```

(Register a new account first)

---

## 🌐 Key URLs

| Service      | URL                                         |
| ------------ | ------------------------------------------- |
| Frontend     | http://localhost:3000                       |
| Backend API  | http://localhost:5000/api                   |
| Health Check | http://localhost:5000/api/health            |
| MongoDB      | mongodb://localhost:27017/placement-tracker |

---

## 📝 Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔌 API Endpoints Cheat Sheet

### Auth (3 endpoints)

```
POST   /auth/register              Register user
POST   /auth/login                 Login user
GET    /auth/me                    Get current user (auth required)
```

### Activities (4 endpoints)

```
POST   /activities                 Create activity (auth required)
GET    /activities                 Get all activities (auth required)
GET    /activities/weekly          Get last 7 days (auth required)
DELETE /activities/:id             Delete activity (auth required)
```

### Applications (4 endpoints)

```
POST   /applications               Create app (auth required)
GET    /applications               Get all apps (auth required)
PATCH  /applications/:id           Update app (auth required)
DELETE /applications/:id           Delete app (auth required)
```

### Analytics (1 endpoint)

```
GET    /analytics/summary          Get analytics (auth required)
```

---

## 📊 Activity Types

| Type        | Use Case              | Icon |
| ----------- | --------------------- | ---- |
| DSA         | LeetCode, algorithms  | 📚   |
| RESUME      | Resume updates        | 📄   |
| INTERVIEW   | Mock interviews       | 🎤   |
| APPLICATION | Applying to companies | 📤   |

---

## 📊 Application Statuses

| Status    | Meaning              | Icon |
| --------- | -------------------- | ---- |
| APPLIED   | Initial application  | 📝   |
| OA        | Online assessment    | 💻   |
| INTERVIEW | Interview stage      | 🎯   |
| OFFER     | Offer received       | 🎉   |
| REJECTED  | Application rejected | ❌   |

---

## 🎯 Readiness Score Formula

```
Readiness Score =
  (30% × Streak Component) +
  (30% × Weekly Effort Component) +
  (20% × Balance Component) +
  (20% × Interview Component)

Where:
  Streak = (days / 14) × 30
  Effort = (hours / 10) × 30
  Balance = Activity type distribution score (0-20)
  Interview = (count / 5) × 20

Result: 0-100 (color coded)
```

---

## 🛠️ Common Commands

### Backend

```bash
cd backend

npm install              # Install dependencies
npm start               # Start server
npm run dev             # Start with nodemon
npm test                # Run tests (if configured)
```

### Frontend

```bash
cd frontend

npm install              # Install dependencies
npm start               # Start dev server
npm run build           # Build for production
npm test                # Run tests (if configured)
```

### Database

```bash
mongod                  # Start MongoDB
mongo placement-tracker # Connect to database
db.dropDatabase()        # Reset database (dangerous!)
```

---

## 🧪 Test Sample Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### Create Activity

```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date":"2024-01-27T10:00:00Z",
    "type":"DSA",
    "duration":60,
    "confidenceLevel":4,
    "notes":"Solved problems"
  }'
```

### Get Analytics

```bash
curl -X GET http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 CSS Modules & Colors

### Activity Type Colors

```css
DSA: #667eea (purple)
RESUME: #764ba2 (dark purple)
INTERVIEW: #f093fb (pink)
APPLICATION: #4facfe (blue)
```

### Status Colors

```css
APPLIED: #4facfe (blue)
OA: #667eea (purple)
INTERVIEW: #f093fb (pink)
OFFER: #43e97b (green)
REJECTED: #fa709a (red)
```

### Score Colors

```css
0-40: #fa709a (red)
40-70: #f093fb (yellow/pink)
70-100: #43e97b (green)
```

---

## 🔐 Authentication Headers

```bash
# Add to all protected requests:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Example:
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/auth/me
```

---

## 📁 Important Files

| File                                | Purpose         |
| ----------------------------------- | --------------- |
| backend/server.js                   | Entry point     |
| backend/src/models/                 | Schemas         |
| backend/src/controllers/            | Logic           |
| backend/src/routes/                 | Endpoints       |
| frontend/src/App.js                 | Router          |
| frontend/src/pages/                 | Page components |
| frontend/src/context/AuthContext.js | Auth state      |

---

## 🐛 Debugging Shortcuts

### Backend Error?

1. Check console for error message
2. Verify MongoDB is running
3. Check .env file is configured
4. Restart backend server

### Frontend Error?

1. Open DevTools (F12)
2. Check Console tab
3. Check Network tab
4. Verify API_URL in .env.local

### API Call Failed?

1. Check Authorization header
2. Verify token is valid
3. Check request body format
4. See error response message

---

## 📊 Analytics Calculations

### Streak

```
Count consecutive days with activity from today backwards
Example: Activity on Day 1 & 2, skip Day 3 = Streak resets to 0
```

### Weekly Effort

```
Sum of all activity durations in past 7 days / 60 (minutes to hours)
```

### Distribution

```
For each type: (count of type / total activities) × 100
```

### Weak Area

```
Find type with lowest percentage
Return type name + personalized suggestion
```

---

## 🚀 Deployment Quick Links

| Platform      | URL                     | Purpose         |
| ------------- | ----------------------- | --------------- |
| Heroku        | heroku.com              | Deploy backend  |
| Railway       | railway.app             | Deploy backend  |
| Vercel        | vercel.com              | Deploy frontend |
| MongoDB Atlas | mongodb.com/cloud/atlas | Production DB   |

---

## 📚 Documentation Links

- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production guide
- [API_TESTING.md](./API_TESTING.md) - API examples
- [DEVELOPER_CHECKLIST.md](./DEVELOPER_CHECKLIST.md) - Dev guide

---

## ⌨️ Keyboard Shortcuts

| Action       | Shortcut     |
| ------------ | ------------ |
| DevTools     | F12          |
| Hard Refresh | Ctrl+Shift+R |
| Console      | Ctrl+Shift+J |
| Network      | Ctrl+Shift+E |
| Elements     | Ctrl+Shift+C |

---

## 🎓 Learning Resources

- JWT: jwt.io
- MongoDB: mongodb.com/docs
- React: react.dev
- Express: expressjs.com
- Mongoose: mongoosejs.com

---

## 💾 Backup Commands

```bash
# Backup MongoDB locally
mongodump --db placement-tracker --out backup/

# Restore MongoDB locally
mongorestore --db placement-tracker backup/placement-tracker/

# MongoDB Atlas: Automatic backups enabled
```

---

## 🆘 Emergency Commands

```bash
# Kill process on port 5000 (if stuck)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Reset all data
# MongoDB: dropDatabase()
# localStorage: localStorage.clear()
```

---

## 📋 Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment vars set
- [ ] Database backed up
- [ ] API tested
- [ ] UI responsive
- [ ] Code reviewed
- [ ] Documentation updated

---

## 🎯 Feature Quick Check

| Feature                | Status |
| ---------------------- | ------ |
| ✅ User registration   | Ready  |
| ✅ User login          | Ready  |
| ✅ Activity logging    | Ready  |
| ✅ Company tracking    | Ready  |
| ✅ Analytics engine    | Ready  |
| ✅ Streak calculation  | Ready  |
| ✅ Weekly effort       | Ready  |
| ✅ Distribution charts | Ready  |
| ✅ Readiness score     | Ready  |
| ✅ Weak area detection | Ready  |
| ✅ Protected routes    | Ready  |
| ✅ Responsive design   | Ready  |

---

**Remember**: When in doubt, check the documentation! 📚

**All 8 docs available**: DOCS_INDEX.md
