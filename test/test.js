import { EdgarService } from '../src/services/edgar-service.js';
import { logger } from '../src/logger.js';

async function runTests() {
  const service = new EdgarService();
  
  logger.info('Starting EDGAR MCP Server tests');
  
  try {
    // Test 1: Search companies
    logger.info('Test 1: Searching for Apple');
    const appleSearch = await service.searchCompanies('Apple Inc', 3);
    console.log('Apple search results:', JSON.stringify(appleSearch, null, 2));
    
    if (appleSearch.success && appleSearch.data.length > 0) {
      const appleCik = appleSearch.data[0].cik;
      
      // Test 2: Get company info
      logger.info(`Test 2: Getting company info for CIK ${appleCik}`);
      const companyInfo = await service.getCompanyInfo(appleCik);
      console.log('Company info:', JSON.stringify(companyInfo, null, 2));
      
      // Test 3: Search filings
      logger.info(`Test 3: Searching 10-K filings for CIK ${appleCik}`);
      const filings = await service.searchFilings(appleCik, '10-K', 2);
      console.log('Filings:', JSON.stringify(filings, null, 2));
      
      // Test 4: Get company facts
      logger.info(`Test 4: Getting company facts for CIK ${appleCik}`);
      const facts = await service.getCompanyFacts(appleCik);
      console.log('Company facts summary:', JSON.stringify(facts.data.summary, null, 2));
    }
    
    logger.info('All tests completed successfully');
  } catch (error) {
    logger.error('Test failed', { error: error.message });
    process.exit(1);
  }
}

runTests();