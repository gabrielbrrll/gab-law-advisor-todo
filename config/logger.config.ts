// config/logger.ts

import winston from 'winston';

// Define the custom settings for each transport (e.g., file, console)
const options = {
  console: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    timestamp: true
  }
};

// Instantiate a new Winston logger with the settings defined above
const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false // do not exit on handled exceptions
});

export default logger;
