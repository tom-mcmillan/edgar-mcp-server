# API Reference

## MCP Tools Available

### 1. search_companies
Search for companies by name or ticker symbol.

**Parameters:**
- `query` (string, required): Company name or ticker to search
- `limit` (number, optional): Maximum results to return (default: 10)

**Example:**
```json
{
  "tool": "search_companies",
  "arguments": {
    "query": "Apple",
    "limit": 5
  }
}
```

### 2. get_company_info
Get detailed information about a specific company.

**Parameters:**
- `cik` (string, required): Central Index Key (CIK) of the company

**Example:**
```json
{
  "tool": "get_company_info",
  "arguments": {
    "cik": "0000320193"
  }
}
```

### 3. search_filings
Search for SEC filings by company and form type.

**Parameters:**
- `cik` (string, required): Company's CIK
- `form_type` (string, optional): Form type (e.g., "10-K", "10-Q", "8-K")
- `limit` (number, optional): Maximum results (default: 20)
- `before` (string, optional): Date filter in YYYY-MM-DD format

**Example:**
```json
{
  "tool": "search_filings",
  "arguments": {
    "cik": "0000320193",
    "form_type": "10-K",
    "limit": 10
  }
}
```

### 4. get_filing_content
Get the content and metadata for a specific filing.

**Parameters:**
- `accession_number` (string, required): Filing accession number
- `cik` (string, required): Company's CIK

**Example:**
```json
{
  "tool": "get_filing_content",
  "arguments": {
    "accession_number": "0000320193-24-000069",
    "cik": "0000320193"
  }
}
```

### 5. get_company_facts
Get structured XBRL financial data for a company.

**Parameters:**
- `cik` (string, required): Company's CIK

**Example:**
```json
{
  "tool": "get_company_facts",
  "arguments": {
    "cik": "0000320193"
  }
}
```

## HTTP Endpoints

### Health Check
```
GET /health
```

Returns server status and configuration.

**Response:**
```json
{
  "status": "healthy",
  "name": "edgar-mcp-server",
  "version": "1.0.0",
  "toolCount": 5
}
```

### MCP SSE Endpoint
```
GET /sse
```

Server-Sent Events endpoint for MCP protocol communication. Used by MCP clients like Claude Desktop.