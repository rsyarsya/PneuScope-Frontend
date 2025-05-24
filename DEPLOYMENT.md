# PneuScope Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Vercel account for frontend deployment
- Render.com or Railway account for backend services
- MongoDB Atlas cluster
- Environment variables configured

### 1. Frontend Deployment (Vercel)

The frontend is automatically deployed to Vercel when you push to the main branch.

**Environment Variables Required:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_ML_API_URL` - Your ML service URL
- `NEXT_PUBLIC_SOCKET_URL` - Your Socket.io server URL (usually same as API URL)

**Deployment Steps:**
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on git push

### 2. Backend Deployment (Render.com)

**Environment Variables Required:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Frontend URL for CORS
- `NODE_ENV=production`
- `PORT=5000`

**Deployment Steps:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `backend`
4. Configure build command: `npm install && npm run build`
5. Configure start command: `npm start`
6. Add environment variables
7. Deploy

### 3. ML Service Deployment (Render.com)

**Environment Variables Required:**
- `PORT=8000`
- `ENV=production`

**Deployment Steps:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `ml-service`
4. Configure build command: `pip install -r requirements.txt`
5. Configure start command: `python app.py`
6. Add environment variables
7. Deploy

### 4. Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Create database user with read/write permissions
3. Whitelist your deployment IPs (or use 0.0.0.0/0 for development)
4. Get connection string and add to `MONGODB_URI`

### 5. Domain Configuration

**Production URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- ML Service: `https://your-ml-service.onrender.com`

**Update Environment Variables:**
\`\`\`bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_ML_API_URL=https://your-ml-service.onrender.com
CORS_ORIGIN=https://your-app.vercel.app
\`\`\`

### 6. Health Checks

All services include health check endpoints:
- Frontend: Available at root URL
- Backend: `GET /health`
- ML Service: `GET /health`

### 7. Monitoring

**Recommended monitoring setup:**
- Vercel Analytics for frontend performance
- Render metrics for backend services
- MongoDB Atlas monitoring for database
- Custom logging for application events

## 🔧 Local Development

\`\`\`bash
# Install dependencies
npm run install:all

# Set up environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ml-service/.env.example ml-service/.env

# Start all services
npm run dev
\`\`\`

## 📊 Performance Optimization

### Frontend
- Next.js automatic code splitting
- Image optimization with next/image
- Static generation where possible
- CDN delivery via Vercel

### Backend
- Connection pooling for MongoDB
- JWT token caching
- Gzip compression
- Rate limiting for API endpoints

### ML Service
- Model caching in memory
- Async request handling
- Batch prediction support
- Response compression

## 🔒 Security Considerations

### Production Security Checklist
- [ ] HTTPS enabled on all services
- [ ] JWT secrets are cryptographically secure
- [ ] Database access restricted to application IPs
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive data
- [ ] Logging configured for security events

### HIPAA Compliance Notes
For medical data handling:
- Implement audit logging
- Add data encryption at rest
- Configure secure data transmission
- Implement user access controls
- Add data retention policies
- Ensure vendor compliance (MongoDB Atlas, hosting providers)

## 🚨 Troubleshooting

### Common Issues

**Socket.io Connection Failed:**
- Check CORS configuration
- Verify WebSocket support on hosting platform
- Ensure proper URL configuration

**Database Connection Issues:**
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user permissions

**ML Service Timeout:**
- Increase request timeout limits
- Optimize model inference time
- Add request queuing for high load

**Authentication Issues:**
- Verify JWT secret consistency
- Check cookie settings for cross-domain
- Ensure HTTPS in production

## 📈 Scaling Considerations

### Horizontal Scaling
- Multiple backend instances behind load balancer
- ML service auto-scaling based on CPU usage
- Database read replicas for query performance

### Vertical Scaling
- Increase server resources during peak usage
- Optimize database queries and indexing
- Implement caching layers (Redis)

### Cost Optimization
- Use Vercel's free tier for frontend
- Render's free tier for development/testing
- MongoDB Atlas free tier for prototyping
- Scale resources based on actual usage
\`\`\`

Let's also create a comprehensive testing setup:
