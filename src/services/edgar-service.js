// src/services/edgar-service.js
import { HttpClient } from '../utils/http-client.js';
import { logger } from '../logger.js';
import { config } from '../config.js';

export class EdgarService {
  constructor() {
    this.httpClient = new HttpClient();
    this.baseUrl = config.edgar.baseUrl;
  }

  async searchCompanies(query, limit = 10) {
    logger.info('Searching companies', { query, limit });
    
    try {
      const data = await this.httpClient.request(`${this.baseUrl}/files/company_tickers.json`);
      const companies = Object.values(data);
      
      const searchTerm = query.toLowerCase();
      const matches = companies
        .filter(company => 
          company.title.toLowerCase().includes(searchTerm) ||
          company.ticker?.toLowerCase() === searchTerm
        )
        .slice(0, limit)
        .map(company => ({
          cik: String(company.cik_str).padStart(10, '0'),
          name: company.title,
          ticker: company.ticker,
          exchange: company.exchange
        }));

      logger.info('Company search completed', { 
        query, 
        resultsFound: matches.length 
      });

      return {
        success: true,
        data: matches,
        total: matches.length,
        query: query
      };
    } catch (error) {
      logger.error('Company search failed', { query, error: error.message });
      throw error;
    }
  }

  async getCompanyInfo(cik) {
    logger.info('Getting company info', { cik });
    
    try {
      const paddedCik = cik.padStart(10, '0');
      const data = await this.httpClient.request(
        `${this.baseUrl}/submissions/CIK${paddedCik}.json`
      );
      
      const result = {
        success: true,
        data: {
          cik: data.cik,
          name: data.name,
          ticker: data.tickers?.[0] || null,
          exchange: data.exchanges?.[0] || null,
          sic: data.sic,
          sicDescription: data.sicDescription,
          category: data.category,
          fiscalYearEnd: data.fiscalYearEnd,
          stateOfIncorporation: data.stateOfIncorporation,
          stateOfIncorporationDescription: data.stateOfIncorporationDescription,
          addresses: data.addresses,
          website: data.website,
          investorWebsite: data.investorWebsite,
          formerNames: data.formerNames
        }
      };
      
      logger.info('Company info retrieved', { cik, name: data.name });
      return result;
    } catch (error) {
      logger.error('Failed to get company info', { cik, error: error.message });
      throw error;
    }
  }

  async searchFilings(cik, formType = null, limit = 20, before = null) {
    logger.info('Searching filings', { cik, formType, limit, before });
    
    try {
      const paddedCik = cik.padStart(10, '0');
      const data = await this.httpClient.request(
        `${this.baseUrl}/submissions/CIK${paddedCik}.json`
      );
      
      const filings = data.filings?.recent || {};
      const recentFilings = [];
      const filingCount = filings.form?.length || 0;
      
      for (let i = 0; i < filingCount; i++) {
        const filing = {
          form: filings.form[i],
          filingDate: filings.filingDate[i],
          reportDate: filings.reportDate[i],
          accessionNumber: filings.accessionNumber[i],
          primaryDocument: filings.primaryDocument[i],
          primaryDocDescription: filings.primaryDocDescription[i],
          size: filings.size[i],
          isXBRL: filings.isXBRL[i]
        };
        
        // Apply filters
        if (formType && filing.form !== formType) continue;
        if (before && filing.filingDate > before) continue;
        
        recentFilings.push(filing);
      }
      
      const result = {
        success: true,
        data: recentFilings.slice(0, limit),
        total: recentFilings.length,
        company: data.name,
        cik: cik
      };
      
      logger.info('Filing search completed', { 
        cik, 
        formType, 
        resultsFound: result.data.length 
      });
      
      return result;
    } catch (error) {
      logger.error('Filing search failed', { cik, formType, error: error.message });
      throw error;
    }
  }

  async getFilingContent(accessionNumber, cik) {
    logger.info('Getting filing content', { accessionNumber, cik });
    
    try {
      const paddedCik = cik.padStart(10, '0');
      const cleanAccession = accessionNumber.replace(/-/g, '');
      
      // Get filing metadata
      const metaData = await this.httpClient.request(
        `${this.baseUrl}/submissions/CIK${paddedCik}.json`
      );
      
      const filings = metaData.filings?.recent || {};
      
      // Find the specific filing
      let filingIndex = -1;
      for (let i = 0; i < filings.accessionNumber?.length; i++) {
        if (filings.accessionNumber[i].replace(/-/g, '') === cleanAccession) {
          filingIndex = i;
          break;
        }
      }
      
      if (filingIndex === -1) {
        throw new Error(`Filing not found: ${accessionNumber}`);
      }
      
      const filing = {
        form: filings.form[filingIndex],
        filingDate: filings.filingDate[filingIndex],
        reportDate: filings.reportDate[filingIndex],
        accessionNumber: filings.accessionNumber[filingIndex],
        primaryDocument: filings.primaryDocument[filingIndex],
        primaryDocDescription: filings.primaryDocDescription[filingIndex],
        size: filings.size[filingIndex]
      };
      
      // Construct document URL
      const docUrl = `${this.baseUrl}/Archives/edgar/data/${paddedCik}/${cleanAccession}/${filing.primaryDocument}`;
      
      const result = {
        success: true,
        data: {
          filing: filing,
          company: metaData.name,
          documentUrl: docUrl,
          archiveUrl: `${this.baseUrl}/Archives/edgar/data/${paddedCik}/${cleanAccession}/`
        }
      };
      
      logger.info('Filing content retrieved', { 
        accessionNumber, 
        cik, 
        form: filing.form 
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to get filing content', { 
        accessionNumber, 
        cik, 
        error: error.message 
      });
      throw error;
    }
  }

  async getCompanyFacts(cik) {
    logger.info('Getting company facts', { cik });
    
    try {
      const paddedCik = cik.padStart(10, '0');
      const data = await this.httpClient.request(
        `${this.baseUrl}/api/xbrl/companyfacts/CIK${paddedCik}.json`
      );
      
      const result = {
        success: true,
        data: {
          cik: data.cik,
          entityName: data.entityName,
          facts: data.facts,
          summary: {
            taxonomies: Object.keys(data.facts || {}),
            factCount: Object.values(data.facts || {}).reduce((sum, taxonomy) => {
              return sum + Object.keys(taxonomy).length;
            }, 0)
          }
        }
      };
      
      logger.info('Company facts retrieved', { 
        cik, 
        entityName: data.entityName,
        factCount: result.data.summary.factCount 
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to get company facts', { cik, error: error.message });
      throw error;
    }
  }
}