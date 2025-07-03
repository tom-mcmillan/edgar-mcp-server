# Development Guide

## Project Structure
```
edgar-mcp-server/
├── src/
│   ├── server.js           # Main server entry point
│   ├── config.js           # Configuration management
│   ├── logger.js           # Winston logger setup
│   ├── mcp-tools.js        # MCP tool definitions
│   ├── services/
│   │   └── edgar-service.js # SEC EDGAR API integration
│   └── utils/
│       └── http-client.js   # HTTP client with rate limiting
├── test/
│   └── test.js             # Basic integration tests
├── docs/                   # Documentation
├── Dockerfile              # Container configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project overview
```

## Development Workflow

### Running Locally
```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Making Changes

1. **Adding New MCP Tools**
   - Define tool schema in `src/mcp-tools.js`
   - Implement handler in `src/server.js`
   - Add service method in `src/services/edgar-service.js`

2. **Modifying SEC API Integration**
   - Update methods in `src/services/edgar-service.js`
   - Respect rate limits (10 requests/second)
   - Handle errors gracefully

3. **Testing Changes**
   - Write tests in `test/` directory
   - Test locally before pushing
   - Verify Cloud Run deployment after merge

### Code Style
- Use ES6 modules
- Follow existing patterns
- Add JSDoc comments for functions
- Handle errors with proper logging

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin feature/your-feature

# Create pull request on GitHub
```

### Debugging

1. **Local Debugging**
   - Check logs in console
   - Use `LOG_LEVEL=debug` for verbose output
   - Test with curl or MCP client

2. **Production Debugging**
   - View Cloud Run logs
   - Check Cloud Build history
   - Monitor error rates in Cloud Console