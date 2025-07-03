# EDGAR MCP Server

A Model Context Protocol (MCP) server that provides access to SEC EDGAR filings and company data through standardized APIs.

## Features

- **Company Search**: Find companies by name or ticker symbol
- **Company Information**: Get detailed company profiles and metadata
- **Filing Search**: Search SEC filings by company and form type
- **Filing Content**: Access filing documents and metadata
- **Financial Facts**: Retrieve structured XBRL financial data
- **Rate Limiting**: Respects SEC API rate limits (10 requests/second)
- **Error Handling**: Robust retry logic and error reporting
- **Logging**: Comprehensive logging for debugging and monitoring

## Installation

\`\`\`bash
git clone <your-repo-url>
cd edgar-mcp-server
npm install
\`\`\`

## Configuration

Set environment variables:

\`\`\`bash
export EDGAR_USER_AGENT="your-app-name contact@example.com"
export LOG_LEVEL="info"
export NODE_ENV="production"
\`\`\`

## Usage

### As MCP Server

Start the server in MCP mode:

\`\`\`bash
npm start
\`\`\`

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

### Testing

\`\`\`bash
npm test
\`\`\`

## Available Tools

### search_companies
Search for companies by name or ticker symbol.

**Parameters:**
- \`query\` (string, required): Company name or ticker
- \`limit\` (number, optional): Max results (default: 10)

### get_company_info
Get detailed company information by CIK.

**Parameters:**
- \`cik\` (string, required): Central Index Key

### search_filings
Search SEC filings by company and form type.

**Parameters:**
- \`cik\` (string, required): Company CIK
- \`form_type\` (string, optional): Form type (10-K, 10-Q, 8-K, etc.)
- \`limit\` (number, optional): Max results (default: 20)
- \`before\` (string, optional): Date filter (YYYY-MM-DD)

### get_filing_content
Get filing metadata and access URLs.

**Parameters:**
- \`accession_number\` (string, required): Filing accession number
- \`cik\` (string, required): Company CIK

### get_company_facts
Get structured XBRL financial data.

**Parameters:**
- \`cik\` (string, required): Company CIK

## Example Usage with Claude

1. Configure Claude to use this MCP server
2. Ask: "Find Apple's recent 10-K filings"
3. The server will search for Apple, get its CIK, and return recent 10-K filings
4. You can then request specific filing content or financial facts

## API Rate Limits

This server respects SEC EDGAR API guidelines:
- Maximum 10 requests per second
- Proper User-Agent headers required
- Automatic retry with exponential backoff

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
`;# Cloud Run Deployment
