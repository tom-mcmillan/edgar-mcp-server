// src/config.js
export const config = {
  edgar: {
    baseUrl: 'https://data.sec.gov',
    userAgent: process.env.EDGAR_USER_AGENT || 'edgar-mcp-server contact@example.com',
    rateLimitMs: 100, // 10 requests per second max
    maxRetries: 3,
    retryDelayMs: 1000
  },
  server: {
    name: 'edgar-mcp-server',
    version: '1.0.0',
    description: 'SEC EDGAR filings and company data access',
    port: process.env.PORT || 3000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'simple'
  }
};