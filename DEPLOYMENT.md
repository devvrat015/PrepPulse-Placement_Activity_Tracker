# Deployment Guide

Complete guide to deploy the MERN application to production.

## Prerequisites

- GitHub account (for version control)
- MongoDB Atlas account (free tier available)
- Heroku/Railway account (backend)
- Vercel/Netlify account (frontend)
- Custom domain (optional)

## Step 1: Prepare Application for Production

### Backend - Update Configuration

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_change_this_to_something_very_long_and_random
PORT=5000
NODE_ENV=production
```

Add to `backend/package.json`:

```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Frontend - Build Optimization

Update `frontend/.env.local`:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

Build frontend:

```bash
cd frontend
npm run build
```

## Step 2: Deploy Backend

### Option A: Heroku

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   cd backend
   heroku create placement-tracker-api
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set JWT_SECRET="your_secret_key"
   heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **Check Logs**
   ```bash
   heroku logs --tail
   ```

### Option B: Railway

1. **Connect GitHub Repository**
   - Go to railway.app
   - Connect GitHub account
   - Select mern-project repository

2. **Create Backend Service**
   - New → GitHub Repo → mern-project
   - Root directory: `backend`
   - Environment:
     - `JWT_SECRET`
     - `MONGODB_URI`
     - `NODE_ENV=production`

3. **Deploy**
   - Click Deploy
   - Get production URL from Railway

### Option C: DigitalOcean App Platform

1. **Create New App**
   - New → App
   - Connect GitHub
   - Select backend folder

2. **Configure**
   - Language: Node.js
   - Environment variables
   - Database: Attach MongoDB

3. **Deploy**

## Step 3: Deploy MongoDB

### Using MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up free

2. **Create Cluster**
   - Choose AWS, region close to you
   - Create M0 (free) tier

3. **Create Database User**
   - Security → Database Access
   - Create user with strong password

4. **Whitelist IP**
   - Security → Network Access
   - Add your IP or "0.0.0.0/0" (less secure)

5. **Get Connection String**
   - Cluster → Connect
   - Copy Connection String
   - Replace `<username>` and `<password>`

Example URI:

```
mongodb+srv://user:password@cluster.mongodb.net/placement-tracker?retryWrites=true&w=majority
```

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   cd frontend
   vercel
   ```

3. **Configure**
   - Set production domain
   - Add environment variables:
     - `REACT_APP_API_URL=https://backend-domain.com/api`

4. **Auto-Deploy**
   - Connect GitHub for auto-deployment on push

### Option B: Netlify

1. **Build Locally**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Go to netlify.com
   - Drag & drop `build` folder
   - Or connect GitHub repo

3. **Set Environment**
   - Site settings → Build & deploy
   - Add environment variable: `REACT_APP_API_URL`

### Option C: GitHub Pages

1. **Add to `frontend/package.json`**

   ```json
   {
     "homepage": "https://username.github.io/mern-project"
   }
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   npm install --save-dev gh-pages
   npm run deploy
   ```

## Step 5: Setup Custom Domain

### With Vercel Frontend

1. **Add Domain**
   - Vercel Dashboard → Settings → Domains
   - Add your domain

2. **Update DNS**
   - Go to domain registrar (GoDaddy, Namecheap, etc.)
   - Add CNAME record:
     - Host: www
     - Value: cname.vercel-dns.com

### With Heroku Backend

1. **Add Domain to Heroku**

   ```bash
   heroku domains:add api.yourdomain.com
   ```

2. **Update DNS**
   - Add CNAME record:
     - Host: api
     - Value: your-heroku-app.herokuapp.com

## Step 6: SSL/HTTPS Setup

### Automatic (Recommended)

- **Vercel**: Automatic SSL (free)
- **Heroku**: Automatic SSL (free)
- **Railway**: Automatic SSL (free)

### Manual

If using custom domain with provider:

1. Enable free SSL (Let's Encrypt)
2. Auto-renew certificates
3. Update DNS to HTTPS

## Step 7: Verification

### Test Backend

```bash
curl https://your-backend-domain.com/api/health

# Should return:
# {"status":"API is running"}
```

### Test Frontend

1. Open https://your-frontend-domain.com
2. Register new account
3. Add activity
4. Verify analytics display

### Test API Connection

1. Open DevTools → Network
2. Create activity
3. Verify POST request to backend API

## Step 8: Monitor & Maintain

### Setup Monitoring

1. **Backend Logs**

   ```bash
   # Heroku
   heroku logs --tail

   # Railway
   railway logs
   ```

2. **Error Tracking**
   - Setup Sentry (free tier)
   - Or use cloud provider's logging

3. **Uptime Monitoring**
   - Use UptimeRobot (free)
   - Monitor backend health endpoint

### Database Backups

```bash
# Backup MongoDB Atlas automatically
# Settings → Backup → Enable daily backups
```

## Production Checklist

### Security

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS everywhere
- [ ] Enable CORS only for your domain
- [ ] Set secure cookies (if applicable)
- [ ] Regular security audits

### Performance

- [ ] Enable database indexes
- [ ] Setup CDN for static assets
- [ ] Enable gzip compression
- [ ] Monitor response times
- [ ] Setup caching (Redis optional)

### Maintenance

- [ ] Regular backups enabled
- [ ] Error logging configured
- [ ] Uptime monitoring active
- [ ] Auto-scaling configured
- [ ] Update dependencies regularly

### Documentation

- [ ] Document production URLs
- [ ] Keep deployment procedures updated
- [ ] Maintain runbook for common issues
- [ ] Document database schema changes

## Rollback Procedure

### Heroku

```bash
# Check release history
heroku releases

# Rollback to previous version
heroku rollback v10

# Verify
heroku logs --tail
```

### Railway

```bash
# Redeploy from specific commit
# Via Railway dashboard → Deployments
```

### Frontend (Vercel)

```bash
# Automatic - simply redeploy
vercel --prod
```

## Scaling Considerations

### When to Scale

- Backend: >1000 requests/minute
- Database: >5GB data

### Scaling Options

1. **Vertical Scaling**
   - Upgrade to larger server size
   - Upgrade MongoDB tier

2. **Horizontal Scaling**
   - Load balancer
   - Multiple backend instances
   - Database replication

3. **Caching**
   - Redis for sessions
   - CloudFlare for static assets

## Cost Estimation (Monthly)

| Service       | Free Tier  | Paid Tier     |
| ------------- | ---------- | ------------- |
| MongoDB Atlas | 512MB      | $57/month     |
| Heroku        | Deprecated | $7-500/month  |
| Railway       | $5 credits | Pay-as-you-go |
| Vercel        | Free       | $20+/month    |
| Netlify       | Free       | $9+/month     |

**Estimated Cost**: $10-20/month for hobby deployment

## Troubleshooting Production Issues

### 503 Service Unavailable

```
Cause: Backend server down or misconfigured
Fix: Check backend logs, verify environment variables
```

### CORS Errors

```
Cause: Frontend URL not whitelisted
Fix: Update backend CORS config with production domain
```

### Blank Frontend

```
Cause: API_URL pointing to wrong endpoint
Fix: Check REACT_APP_API_URL environment variable
```

### Database Connection Failed

```
Cause: IP not whitelisted or wrong connection string
Fix: Check MongoDB Atlas IP whitelist and credentials
```

## Support & Resources

- [Heroku Docs](https://devcenter.heroku.com)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express Production](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Optimization](https://reactjs.org/docs/optimizing-performance.html)

---

**Happy Deploying! 🚀**
