export const mcpTools = [
  {
    name: "search_companies",
    description: "Search for companies in SEC database by name or ticker symbol",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Company name or ticker symbol to search for"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
          default: 10,
          minimum: 1,
          maximum: 100
        }
      },
      required: ["query"]
    }
  },
  {
    name: "get_company_info",
    description: "Get detailed company information by CIK (Central Index Key)",
    inputSchema: {
      type: "object",
      properties: {
        cik: {
          type: "string",
          description: "Central Index Key (CIK) of the company (can be padded or unpadded)"
        }
      },
      required: ["cik"]
    }
  },
  {
    name: "search_filings",
    description: "Search for SEC filings by company and optionally filter by form type",
    inputSchema: {
      type: "object",
      properties: {
        cik: {
          type: "string",
          description: "Company CIK"
        },
        form_type: {
          type: "string",
          description: "Type of form to filter by",
          enum: ["10-K", "10-Q", "8-K", "DEF 14A", "13F-HR", "4", "3", "S-1", "424B1"]
        },
        limit: {
          type: "number",
          description: "Number of filings to return (default: 20)",
          default: 20,
          minimum: 1,
          maximum: 100
        },
        before: {
          type: "string",
          description: "Get filings before this date (YYYY-MM-DD format)",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$"
        }
      },
      required: ["cik"]
    }
  },
  {
    name: "get_filing_content",
    description: "Get metadata and access URLs for a specific filing",
    inputSchema: {
      type: "object",
      properties: {
        accession_number: {
          type: "string",
          description: "Filing accession number (with or without dashes)"
        },
        cik: {
          type: "string",
          description: "Company CIK"
        }
      },
      required: ["accession_number", "cik"]
    }
  },
  {
    name: "get_company_facts",
    description: "Get structured financial data (XBRL) for a company",
    inputSchema: {
      type: "object",
      properties: {
        cik: {
          type: "string",
          description: "Company CIK"
        }
      },
      required: ["cik"]
    }
  }
];