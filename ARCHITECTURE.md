# MERN Stack Architecture

## Overview

This is a production-ready MERN (MongoDB, Express, React, Node.js) application following clean architecture principles and SOLID design patterns.

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema with password hashing
│   │   ├── Activity.js        # Activity schema
│   │   └── Application.js     # Application schema
│   ├── controllers/
│   │   ├── authController.js  # Auth logic (register, login, me)
│   │   ├── activityController.js # Activity CRUD
│   │   ├── applicationController.js # Application CRUD
│   │   └── analyticsController.js  # Complex analytics logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── analyticsRoutes.js
│   └── middleware/
│       └── auth.js            # JWT verification middleware
└── server.js                  # Express app entry point
```

### Data Flow

1. **Request** → Express Router
2. **Authentication** → Auth Middleware (JWT verification)
3. **Validation** → Controller (input validation)
4. **Database** → Mongoose Model (CRUD operations)
5. **Response** → JSON with status code

### Key Design Patterns

#### 1. Model-View-Controller (MVC)

- **Models**: Mongoose schemas with validation
- **Controllers**: Business logic and request handling
- **Routes**: URL-to-controller mapping

#### 2. Middleware Chain

```
Request → CORS → JSON Parser → Auth Middleware → Controller → Response
```

#### 3. JWT Authentication

- Token issued on login/register
- Verified on protected routes
- Stored in client localStorage
- Includes userId for data isolation

#### 4. Error Handling

```javascript
// Centralized error responses
try {
  // Business logic
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── api/
│   ├── axios.js              # Axios instance with interceptors
│   └── endpoints.js          # API endpoint functions
├── components/
│   ├── Header.js            # Navigation header
│   ├── ProtectedRoute.js    # Route protection
│   ├── StatCard.js          # Dashboard stat cards
│   ├── DistributionChart.js # Activity distribution chart
│   └── *.module.css         # Scoped styles
├── context/
│   └── AuthContext.js       # Auth state management
├── pages/
│   ├── Login.js             # Login page
│   ├── Register.js          # Registration page
│   ├── Dashboard.js         # Main dashboard with analytics
│   ├── AddActivity.js       # Activity form
│   ├── ActivityHistory.js   # Activity list
│   ├── Applications.js      # Company applications tracker
│   └── *.module.css         # Page styles
├── hooks/
│   ├── useAuth.js           # Auth context consumer
│   └── useFetch.js          # Data fetching hook
├── utils/
│   └── helpers.js           # Utility functions
├── App.js                   # Main app component with routing
└── index.js                 # React DOM render
```

### State Management Flow

```
AuthContext (Global Auth State)
├── user (currently logged-in user)
├── loading (initial auth check)
├── token (JWT in localStorage)
└── login/register/logout functions

Component State (Local)
├── Form data (useState)
├── API loading/error (useFetch)
└── UI state (modal open/close)
```

### Component Hierarchy

```
<App>
  <AuthProvider>
    <Header />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      ... other protected routes
    </Routes>
  </AuthProvider>
</App>
```

## API Contract

### Authentication

```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user: { id, name, email } }

POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email } }

GET /api/auth/me (requires auth)
Response: { _id, name, email, createdAt }
```

### Activities

```
POST /api/activities (requires auth)
Body: { date, type, duration, confidenceLevel, notes }
Response: { _id, userId, date, type, duration, confidenceLevel, notes, createdAt }

GET /api/activities (requires auth)
Response: Array<Activity>

GET /api/activities/weekly (requires auth)
Response: Array<Activity> (last 7 days)

DELETE /api/activities/:id (requires auth)
Response: { message: "Activity deleted" }
```

### Applications

```
POST /api/applications (requires auth)
Body: { companyName, role, appliedDate, status? }
Response: { _id, userId, companyName, role, status, appliedDate, createdAt }

GET /api/applications (requires auth)
Response: Array<Application>

PATCH /api/applications/:id (requires auth)
Body: { companyName?, role?, status?, appliedDate? }
Response: { updated application }

DELETE /api/applications/:id (requires auth)
Response: { message: "Application deleted" }
```

### Analytics

```
GET /api/analytics/summary (requires auth)
Response: {
  streak: number,
  weeklyEffort: number (hours),
  distribution: { DSA, RESUME, INTERVIEW, APPLICATION } (percentages),
  readinessScore: number (0-100),
  weakArea: { type, suggestion },
  totalActivities: number
}
```

## Authentication Flow

### Registration

```
User Registration Form
    ↓
POST /register with credentials
    ↓
Check if email exists
    ↓
Hash password with bcrypt (10 salt rounds)
    ↓
Save user to MongoDB
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Store token in localStorage
    ↓
Set user in AuthContext
    ↓
Redirect to Dashboard
```

### Login

```
User Login Form
    ↓
POST /login with email + password
    ↓
Find user by email
    ↓
Compare password with bcrypt
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Store in localStorage
    ↓
Set user in AuthContext
    ↓
Redirect to Dashboard
```

### Protected Request

```
API Call (GET /activities)
    ↓
Axios Interceptor adds Authorization header
    ↓
Header: "Authorization: Bearer <token>"
    ↓
Backend Auth Middleware verifies JWT
    ↓
Extract userId from token
    ↓
Attach userId to request
    ↓
Controller queries Activities by userId
    ↓
Return user-specific data
```

## Analytics Engine

### Calculation Pipeline

```
User Activities Database
    ↓
    ├─→ Calculate Streak
    │   ├─ Create date map from activities
    │   ├─ Count consecutive days from today backwards
    │   └─ Return count
    │
    ├─→ Calculate Weekly Effort
    │   ├─ Filter activities from last 7 days
    │   ├─ Sum duration (convert minutes to hours)
    │   └─ Return total
    │
    ├─→ Calculate Distribution
    │   ├─ Count activities per type
    │   ├─ Calculate percentage
    │   └─ Return { DSA: %, RESUME: %, ... }
    │
    ├─→ Calculate Readiness Score (0-100)
    │   ├─ Streak component (30%) = (streak/14) * 30
    │   ├─ Weekly effort (30%) = (hours/10) * 30
    │   ├─ Balance component (20%)
    │   │   ├─ +5 points per type represented
    │   │   └─ Penalty if any type > 70%
    │   ├─ Interview component (20%) = (interviews/5) * 20
    │   └─ Sum all components (cap at 100)
    │
    └─→ Identify Weak Area
        ├─ Find type with lowest percentage
        ├─ Return type + suggestion
        └─ Example: "Focus on DSA - solve more problems"
```

### Score Components

| Component     | Weight | Max Points | Calculation                  |
| ------------- | ------ | ---------- | ---------------------------- |
| Streak        | 30%    | 30         | (consecutive_days / 14) × 30 |
| Weekly Effort | 30%    | 30         | (hours / 10) × 30            |
| Balance       | 20%    | 20         | (+5 per type, -penalties)    |
| Interviews    | 20%    | 20         | (interviews / 5) × 20        |

## Error Handling

### Client-Side

```javascript
try {
  const result = await activityAPI.createActivity(data);
} catch (error) {
  const errorMessage = error.response?.data?.error || "Unknown error";
  setError(errorMessage);
}
```

### Server-Side

```javascript
try {
  // Business logic
  await activity.save();
  res.json(activity);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

## Security Measures

1. **Password Security**
   - bcryptjs hashing (10 salt rounds)
   - Passwords never logged or returned

2. **JWT Security**
   - Token expiration (7 days)
   - Verified on every protected request
   - Stored securely in localStorage

3. **Data Isolation**
   - userId field in every model
   - Controllers filter by userId
   - Users cannot access other users' data

4. **CORS**
   - Enabled for frontend domain
   - Prevents unauthorized cross-origin requests

5. **Input Validation**
   - Email format validation
   - Password length requirements
   - Type validation in controllers

## Performance Optimizations

1. **Database**
   - Indexes on userId fields (implicit through Mongoose)
   - Lean queries where needed

2. **Frontend**
   - CSS Modules for scoped styling
   - Component splitting
   - Lazy loading with React Router

3. **API**
   - Minimal response payload
   - No unnecessary data transformations

## Scalability Considerations

### Current Limitations

- Single MongoDB instance
- No caching layer
- No background jobs

### Future Improvements

- Redis caching for analytics
- Database indexing strategy
- Message queues for notifications
- Microservices architecture
- GraphQL for flexible queries

## Testing Strategy

### Backend Testing

```bash
# Manual testing with Postman
# Test endpoints:
# - POST /register (invalid email, duplicate email, weak password)
# - POST /login (wrong password, non-existent user)
# - Protected routes (no token, invalid token, expired token)
# - CRUD operations (missing fields, unauthorized access)
```

### Frontend Testing

```bash
# Manual testing checklist:
# - Register new account
# - Login with correct credentials
# - Add activity and verify analytics update
# - Edit/delete activities
# - Add company applications
# - Test responsive design on mobile
```

## Deployment Checklist

### Backend

- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas URI
- [ ] Enable CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Configure error logging
- [ ] Setup HTTPS

### Frontend

- [ ] Update REACT_APP_API_URL to production
- [ ] Run npm run build
- [ ] Test all forms
- [ ] Verify analytics calculations
- [ ] Check responsive design
- [ ] Setup CDN for assets
