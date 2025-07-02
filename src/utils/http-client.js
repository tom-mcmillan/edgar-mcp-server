// src/utils/http-client.js
import fetch from 'node-fetch';
import { logger } from '../logger.js';
import { config } from '../config.js';

export class HttpClient {
  constructor() {
    this.lastRequestTime = 0;
  }

  async rateLimitWait() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = config.edgar.rateLimitMs;
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      logger.debug(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async request(url, options = {}) {
    await this.rateLimitWait();
    
    const requestOptions = {
      ...options,
      headers: {
        'User-Agent': config.edgar.userAgent,
        'Accept': 'application/json',
        ...options.headers
      }
    };

    let lastError;
    
    for (let attempt = 1; attempt <= config.edgar.maxRetries; attempt++) {
      try {
        logger.debug(`Request attempt ${attempt}`, { url, attempt });
        
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          error.url = url;
          throw error;
        }
        
        const data = await response.json();
        logger.debug(`Request successful`, { url, status: response.status });
        return data;
        
      } catch (error) {
        lastError = error;
        logger.warn(`Request failed (attempt ${attempt})`, { 
          url, 
          error: error.message,
          attempt 
        });
        
        if (attempt < config.edgar.maxRetries) {
          const delay = config.edgar.retryDelayMs * attempt;
          logger.debug(`Retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    logger.error(`Request failed after ${config.edgar.maxRetries} attempts`, {
      url,
      error: lastError.message
    });
    throw lastError;
  }
}
