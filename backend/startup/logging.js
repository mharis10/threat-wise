const winston = require('winston');
require('winston-daily-rotate-file');
require('express-async-errors');
require('dotenv').config();

const logFormat = winston.format.printf(
  ({ level, message, timestamp, traceId }) =>
    `[${timestamp}] [${level}] [${traceId || "N/A"}] ${JSON.stringify(message)}`
);

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'verbose';

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/general-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '10d',
});

const dailyRotateExceptionFileTransport =
  new winston.transports.DailyRotateFile({
    filename: 'logs/exceptions-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '10d',
  });

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [dailyRotateFileTransport],
  exceptionHandlers: [dailyRotateExceptionFileTransport],
  rejectionHandlers: [dailyRotateExceptionFileTransport],
});

process.on('unhandledRejection', (ex) => {
  throw ex;
});

module.exports = logger;
