// src/logger.js
import winston from 'winston';
import { config } from './config.js';

const { combine, timestamp, printf, json, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: config.logging.level,
  format: config.logging.format === 'json' 
    ? combine(timestamp(), json())
    : combine(timestamp(), colorize(), customFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});