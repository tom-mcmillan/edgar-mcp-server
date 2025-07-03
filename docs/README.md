# Edgar MCP Server Documentation

## Overview
The Edgar MCP Server provides Model Context Protocol (MCP) access to SEC EDGAR filings and company data. This server can be used with Claude Desktop or other MCP-compatible clients.

## Table of Contents
- [Setup Guide](./setup.md)
- [API Reference](./api-reference.md)
- [Deployment Guide](./deployment.md)
- [Development Guide](./development.md)
- [Troubleshooting](./troubleshooting.md)

## Quick Links
- **Production URL**: https://edgar-mcp-server-435514268870.us-central1.run.app
- **Health Check**: https://edgar-mcp-server-435514268870.us-central1.run.app/health
- **MCP Endpoint**: https://edgar-mcp-server-435514268870.us-central1.run.app/sse

## Architecture
The server is built with:
- Node.js + Express
- MCP SDK with SSE transport
- SEC EDGAR REST APIs
- Google Cloud Run deployment
- Continuous deployment from GitHub