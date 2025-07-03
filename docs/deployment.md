# Deployment Guide

## Google Cloud Run Deployment

### Prerequisites
- Google Cloud Project with billing enabled
- gcloud CLI installed and authenticated
- Docker installed (for local testing)

### Initial Deployment

1. **Enable Required APIs**
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

2. **Deploy from Source**
```bash
gcloud run deploy edgar-mcp-server \
  --source . \
  --port 3000 \
  --allow-unauthenticated \
  --region us-central1 \
  --set-env-vars="EDGAR_USER_AGENT=YourApp your@email.com,NODE_ENV=production"
```

### Continuous Deployment

The project is configured for automatic deployment via Cloud Build triggers:

1. **Push to GitHub** - Any push to the `main` branch triggers a build
2. **Cloud Build** - Builds the Docker container using the Dockerfile
3. **Cloud Run** - Automatically deploys the new container

### Custom Domain Setup

1. **Create Domain Mapping in Cloud Run**
```bash
gcloud run domain-mappings create \
  --service edgar-mcp-server \
  --domain mcp.yourdomain.com \
  --region us-central1
```

2. **Update DNS Records**
Add a CNAME record pointing to the Cloud Run service:
- Type: CNAME
- Name: mcp
- Value: [provided by Cloud Run]

### Environment Configuration

Production environment variables:
- `EDGAR_USER_AGENT`: Required by SEC (include contact email)
- `NODE_ENV`: Set to "production"
- `PORT`: Set by Cloud Run automatically

### Monitoring

View logs:
```bash
gcloud run services logs read edgar-mcp-server --region us-central1
```

View metrics in Cloud Console:
- CPU usage
- Memory usage
- Request count
- Latency