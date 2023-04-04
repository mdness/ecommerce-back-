import { ErrorRequestHandler } from 'express';
import { logger } from 'services/logger';
import Config from 'config';

interface IntError {
  error: string;
  name: string;
  message: string;
  description?: string;
  stack: string;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode, name, message, error, stack, description } = err;
  const errorInfo: IntError = {
    error,
    name,
    message,
    stack,
  };
  if (description) {
    errorInfo.description = description;
  }
  if (Config.NODE_ENV !== 'test')
    logger.error(`Error: ${error}, Message: ${message}, Stack: ${stack} `);
  res.status(statusCode || 500).json(errorInfo);
};
