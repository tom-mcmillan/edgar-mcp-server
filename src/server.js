import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';

import { EdgarService } from './services/edgar-service.js';
import { mcpTools } from './mcp-tools.js';
import { logger } from './logger.js';
import { config } from './config.js';

class EdgarMCPServer {
  constructor() {
    this.server = new Server({
      name: config.server.name,
      version: config.server.version,
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.edgarService = new EdgarService();
    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing available tools');
      return {
        tools: mcpTools,
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info('Tool execution requested', { tool: name, args });

      try {
        let result;
        
        switch (name) {
          case 'search_companies':
            result = await this.edgarService.searchCompanies(
              args.query, 
              args.limit
            );
            break;
            
          case 'get_company_info':
            result = await this.edgarService.getCompanyInfo(args.cik);
            break;
            
          case 'search_filings':
            result = await this.edgarService.searchFilings(
              args.cik,
              args.form_type,
              args.limit,
              args.before
            );
            break;
            
          case 'get_filing_content':
            result = await this.edgarService.getFilingContent(
              args.accession_number,
              args.cik
            );
            break;
            
          case 'get_company_facts':
            result = await this.edgarService.getCompanyFacts(args.cik);
            break;
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        logger.info('Tool execution completed', { tool: name, success: true });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Tool execution failed', { 
          tool: name, 
          error: error.message,
          args 
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: true,
                message: error.message,
                tool: name,
                arguments: args
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const app = express();
    const port = config.server.port;

    // Enable CORS for all origins
    app.use(cors());

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.json({ 
        status: 'healthy',
        name: config.server.name,
        version: config.server.version,
        toolCount: mcpTools.length
      });
    });

    // MCP SSE endpoint
    app.get('/sse', async (_req, res) => {
      logger.info('New SSE connection established');
      
      const transport = new SSEServerTransport('/sse', res);
      await this.server.connect(transport);
    });

    app.listen(port, () => {
      logger.info('EDGAR MCP Server started', {
        name: config.server.name,
        version: config.server.version,
        toolCount: mcpTools.length,
        port: port,
        endpoints: {
          health: `http://localhost:${port}/health`,
          sse: `http://localhost:${port}/sse`
        }
      });
    });
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new EdgarMCPServer();
  server.run().catch((error) => {
    logger.error('Server startup failed', { error: error.message });
    process.exit(1);
  });
}

export { EdgarMCPServer };