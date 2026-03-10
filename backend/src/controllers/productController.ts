import { Request, Response } from 'express';
import Product, { IProduct } from '../models/product';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find({});
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка сервера при получении товаров' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title, description, image, category, price,
    } = req.body;

    if (!title || !image || !image.fileName || !image.originalName || !category) {
      return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
    }

    const newProduct = new Product({
      title,
      description,
      image,
      category,
      price: price ?? null,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    if ((err as any).code === 11000) {
      return res.status(400).json({ message: 'Товар с таким названием уже существует' });
    }
    return res.status(500).json({ message: 'Ошибка сервера при создании товара' });
  }
};
