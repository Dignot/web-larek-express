import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/httpErrors';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
