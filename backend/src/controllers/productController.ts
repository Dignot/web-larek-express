import { MongoServerError } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';
import ConflictError from '../errors/ConflictError';

export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products: IProduct[] = await Product.find({});
    return res.status(200).json(products);
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = new Product({
      ...req.body,
      price: req.body.price ?? null,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      // Конфликт дубликата → 409
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    // Любая другая ошибка → передаем в errorHandler
    return next(err);
  }
};
