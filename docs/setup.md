# Setup Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/tom-mcmillan/edgar-mcp-server.git
cd edgar-mcp-server

# Install dependencies
npm install

# Set up environment variables
export EDGAR_USER_AGENT="YourApp your-email@example.com"
export LOG_LEVEL="info"
export NODE_ENV="development"

# Start the server
npm start
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EDGAR_USER_AGENT` | SEC requires a user agent with contact info | Yes | `edgar-mcp-server contact@example.com` |
| `LOG_LEVEL` | Logging verbosity (error, warn, info, debug) | No | `info` |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |

## Testing Local Setup
```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"healthy","name":"edgar-mcp-server","version":"1.0.0","toolCount":5}
```