# Smart Placement Activity Tracker

A production-ready MERN application for students to log placement preparation activities and track their progress with advanced analytics.

## Features

✅ **Authentication**: Secure register/login with JWT & bcrypt  
✅ **Activity Tracking**: Log DSA, Resume, Interview, and Application activities  
✅ **Company Tracker**: Manage job applications and their status  
✅ **Advanced Analytics**:

- **Streak**: Consecutive days with activities (min. 1/day)
- **Weekly Effort**: Total hours in last 7 days
- **Activity Distribution**: Percentage breakdown by type
- **Placement Readiness Score**: 0-100 based on streak, effort, balance, interviews
- **Weak Area Detection**: Identifies least performed activity with suggestions

📊 **Dashboard**: Real-time analytics with charts  
🔒 **User Data Isolation**: Users can only access their own data  
📱 **Responsive Design**: Works on mobile and desktop

## Tech Stack

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend**

- React 18 + Hooks
- React Router v6
- Context API for auth
- Axios for API calls
- Recharts for visualizations

## Project Structure

```
mern-project/
├── backend/
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose schemas (User, Activity, Application)
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Auth middleware
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios instances and endpoints
    │   ├── components/  # Reusable components
    │   ├── context/     # AuthContext
    │   ├── hooks/       # Custom hooks (useAuth, useFetch)
    │   ├── pages/       # Page components
    │   ├── utils/       # Helper functions
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`**

   ```
   MONGODB_URI=mongodb://localhost:27017/placement-tracker
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if using local MongoDB)

   ```bash
   # On Windows
   mongod

   # On macOS/Linux
   brew services start mongodb-community
   ```

6. **Start the backend server**

   ```bash
   npm start        # Production
   npm run dev      # Development (with nodemon)
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env.local` file** (optional)

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user (protected)
```

### Activities

```
POST   /api/activities         # Create activity
GET    /api/activities         # Get all activities (protected)
GET    /api/activities/weekly  # Get last 7 days activities (protected)
DELETE /api/activities/:id     # Delete activity (protected)
```

### Applications

```
POST   /api/applications       # Create application
GET    /api/applications       # Get all applications (protected)
PATCH  /api/applications/:id   # Update application (protected)
DELETE /api/applications/:id   # Delete application (protected)
```

### Analytics

```
GET    /api/analytics/summary  # Get analytics dashboard data (protected)
```

## Usage

### 1. Register Account

- Go to `/register`
- Enter name, email, and password
- Auto-login after successful registration

### 2. Add Activities

- Click "Add Activity" in navigation
- Select type (DSA, Resume, Interview, Application)
- Enter duration in minutes
- Rate your confidence level (1-5)
- Add optional notes
- Save activity

### 3. Track Companies

- Go to "Companies" section
- Add new application (company name, role, applied date)
- Update status as you progress (Applied → OA → Interview → Offer/Rejected)
- View all applications at a glance

### 4. View Analytics

- Dashboard automatically shows:
  - **Current Streak**: Days of consecutive activity logging
  - **Weekly Effort**: Total hours logged in past 7 days
  - **Activity Distribution**: Pie chart showing % per type
  - **Readiness Score**: 0-100 overall score
  - **Weak Area**: Type with lowest percentage + improvement suggestion

### 5. View Activity History

- All logged activities with full details
- Sort by date (newest first)
- Delete activities if needed
- See confidence levels and notes

## Readiness Score Calculation

The score is calculated from 4 components (total 100):

1. **Streak (30%)**: Consecutive days with ≥1 activity
   - Max 14+ days = 30 points

2. **Weekly Effort (30%)**: Total hours in last 7 days
   - Target: 10 hours/week = 30 points

3. **Activity Balance (20%)**: Mix of activity types
   - +5 points for each type represented
   - Penalty if any type exceeds 70%

4. **Interview Practice (20%)**: Number of mock interviews
   - 5+ interviews = 20 points

## Example Workflows

### Complete Setup (5 minutes)

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend && npm install && npm start

# Terminal 3: Start Frontend
cd frontend && npm install && npm start
```

Visit `http://localhost:3000` and register!

### Adding First Activity

1. Login/Register
2. Click "Add Activity"
3. Select "DSA", enter 60 minutes, confidence 3/5
4. Add note: "Solved 5 LeetCode problems"
5. Save
6. Check dashboard for updated stats

## Key Features Explained

### Streak System

- Counts consecutive days with at least 1 activity
- Resets if you miss a day (no activity logged)
- Visible on dashboard for motivation

### Weekly Effort

- Sums duration of all activities in past 7 days
- Displayed in hours
- Helps track workload consistency

### Weak Area Detection

- Identifies activity type with lowest percentage
- Provides personalized suggestion
- Updates as you log more activities
- Example: "Focus on Data Structures & Algorithms - solve more LeetCode problems"

## Testing

### Quick Test Data

1. Register an account
2. Add multiple activities of different types
3. Add some applications with various statuses
4. Check dashboard for analytics updates
5. Try deleting an activity and verify the refresh

### Testing Streak

- Add activity on Day 1
- Add activity on Day 2 (streak = 2)
- Skip Day 3 (streak resets to 0)
- Add activity on Day 4 (streak = 1)

## Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables
2. Ensure MongoDB Atlas connection string
3. Run `npm start` on deploy

### Frontend Deployment (Vercel/Netlify)

1. Build: `npm run build`
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy build folder

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: verify IP whitelist and connection string

### API Not Responding

- Check backend server is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env.local`
- Check browser console for CORS errors

### Activities Not Saving

- Check browser's localStorage has token
- Verify JWT token in Authorization header
- Check backend logs for error details

## Code Quality

- Clean, modular architecture
- Separation of concerns (controllers, models, routes)
- Error handling on all endpoints
- Input validation on forms
- Responsive CSS modules
- No external UI framework (minimal, clean design)
- Well-commented complex logic (analytics)

## Future Enhancements

- [ ] Email notifications for streaks
- [ ] Social sharing of stats
- [ ] AI-powered study recommendations
- [ ] Interview question bank
- [ ] Leaderboard with other users
- [ ] Mobile app with React Native
- [ ] Advanced charts (line graphs, heatmaps)
- [ ] Export analytics as PDF

## License

MIT
