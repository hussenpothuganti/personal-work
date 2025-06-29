# Deployment Instructions for Render

## Quick Deploy

1. **Upload the zip file to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Choose "Deploy from Git repository" or "Upload from computer"
   - Upload the `QuantumPulse_Panel_Production.zip` file

2. **Configure Environment Variables**
   
   Set these environment variables in Render dashboard:
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://shaikmahammadhussain835:pgBZgM9gYvXmLzw1@hussain.vo52sy7.mongodb.net/quantumpulse?retryWrites=true&w=majority&appName=Hussain
   JWT_SECRET=quantumpulse_secure_jwt_secret_key_2024_production
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Build and Start Commands**
   
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Deploy**
   
   Click "Create Web Service" and wait for deployment to complete.

## Manual Deployment Steps

### Step 1: Prepare Environment
1. Ensure you have a MongoDB Atlas cluster ready
2. Update the `MONGO_URI` in environment variables with your database connection string
3. Generate a secure JWT secret for production

### Step 2: Configure Render Service
1. **Service Type**: Web Service
2. **Environment**: Node
3. **Plan**: Free (or upgrade as needed)
4. **Region**: Choose closest to your users

### Step 3: Build Configuration
```bash
# Build Command
npm install && npm run build

# Start Command  
npm start
```

### Step 4: Environment Variables
Set all required environment variables in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port (auto-set by Render) |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `CORS_ORIGIN` | `*` | CORS allowed origins |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

### Step 5: Domain Configuration
- Render will provide a free `.onrender.com` subdomain
- You can add a custom domain in the service settings
- SSL certificates are automatically provisioned

## Post-Deployment

### Health Check
Visit `https://your-app.onrender.com/api/health` to verify the API is working.

### Initialize Data
The application will automatically initialize sample data on first load.

### Monitor Logs
Check Render logs for any deployment issues or runtime errors.

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

2. **MongoDB Connection Issues**
   - Verify MONGO_URI is correct
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
   - Ensure database user has proper permissions

3. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Verify sensitive values are properly escaped

4. **CORS Errors**
   - Update CORS_ORIGIN if needed
   - Check frontend API calls use relative URLs

### Performance Optimization

1. **Free Tier Limitations**
   - Service sleeps after 15 minutes of inactivity
   - Cold starts may take 30+ seconds
   - Consider upgrading for production use

2. **Database Optimization**
   - Use MongoDB indexes for better performance
   - Consider connection pooling optimization
   - Monitor database metrics

### Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use strong, unique JWT secrets
   - Regularly rotate sensitive credentials

2. **CORS Configuration**
   - Restrict CORS_ORIGIN to specific domains in production
   - Review and update security headers

3. **Rate Limiting**
   - Adjust rate limits based on expected traffic
   - Monitor for abuse patterns
   - Consider implementing user-based rate limiting

## Support

For deployment issues:
- Check Render documentation: https://render.com/docs
- Review application logs in Render dashboard
- Contact support: support@quantumpulse.ai

---

**QuantumPulse Technologies** - Deployment Guide v1.0

