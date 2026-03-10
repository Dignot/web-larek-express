// eslint-disable-next-line import/no-extraneous-dependencies
import winston from 'winston';
// eslint-disable-next-line import/no-extraneous-dependencies
import expressWinston from 'express-winston';
// Логгер запросов
export const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

// Логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});
