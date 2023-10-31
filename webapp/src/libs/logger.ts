import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }),// Log errors to a file
    new winston.transports.File({ filename: 'info.log', level: 'info' }), // Log info messages to a file
  ]
});

export default logger;
