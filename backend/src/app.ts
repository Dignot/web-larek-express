import expressWinston from 'express-winston';
import winston from 'winston';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middlewares/errorHandler';
import NotFoundError from './errors/NotFoundError';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const currentDir = process.cwd();

app.use('/public', express.static(path.join(currentDir, 'public')));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.File({ filename: 'request.log' })],
    format: winston.format.json(),
  }),
);

const { PORT = 3000, DB_ADDRESS } = process.env;
if (!DB_ADDRESS) throw new Error('DB_ADDRESS not specified in .env');

mongoose
  .connect(DB_ADDRESS)
  .then(() => {})
  .catch((_error) => {});

app.get('/', (_req, res) => res.send('API работает'));

app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.use((_req, _res, next) => next(new NotFoundError('Not Found')));
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: 'error.log' })],
    format: winston.format.json(),
  }),
);

app.use(errorHandler);

app.listen(PORT, () => {});
