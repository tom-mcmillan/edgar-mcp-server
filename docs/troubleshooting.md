# Troubleshooting Guide

## Common Issues

### 1. Build Failures in Cloud Run

**Error:** `unable to evaluate symlinks in Dockerfile path`
- **Cause:** Dockerfile not committed to GitHub
- **Solution:** Ensure Dockerfile is added and pushed to repository

**Error:** `PERMISSION_DENIED: Build failed`
- **Cause:** Cloud Build service account lacks permissions
- **Solution:** Grant Cloud Run Developer role to Cloud Build service account

### 2. Runtime Errors

**Error:** `EACCES: permission denied, mkdir 'logs'`
- **Cause:** File system is read-only in Cloud Run
- **Solution:** Logger is configured to only use console output in production

**Error:** `429 Too Many Requests`
- **Cause:** Exceeding SEC rate limits
- **Solution:** Built-in rate limiter handles this automatically with retry logic

### 3. Connection Issues

**Issue:** Health endpoint returns 404
- **Possible Causes:**
  - Server not running
  - Wrong URL or port
  - Deployment not complete

**Issue:** SSE endpoint not connecting
- **Check:**
  - CORS is enabled
  - Client supports SSE
  - No proxy blocking SSE connections

### 4. SEC API Issues

**Issue:** Empty responses from SEC
- **Check:**
  - Valid CIK format (10 digits, padded with zeros)
  - Company exists in SEC database
  - Form type is valid

**Issue:** User agent errors
- **Solution:** Set proper EDGAR_USER_AGENT environment variable

### 5. Deployment Issues

**Issue:** Continuous deployment not triggering
- **Check:**
  - Cloud Build trigger is active
  - Trigger is watching correct branch
  - GitHub webhook is connected

**Issue:** Custom domain not working
- **Verify:**
  - Domain mapping created in Cloud Run
  - DNS records updated
  - SSL certificate provisioned (can take 15-30 minutes)

## Debug Commands

### Check Service Status
```bash
gcloud run services describe edgar-mcp-server --region us-central1
```

### View Recent Logs
```bash
gcloud run services logs read edgar-mcp-server --region us-central1 --limit=50
```

### Test Endpoints
```bash
# Health check
curl https://your-service-url/health

# Test with specific user agent
curl -H "User-Agent: TestApp test@example.com" https://your-service-url/health
```

### Check Build History
```bash
gcloud builds list --limit=5
```

## Getting Help

1. Check Cloud Run logs for detailed error messages
2. Review SEC EDGAR documentation for API requirements
3. File issues on GitHub repository
4. Check MCP protocol documentation for client integration