import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/BadRequestError';

interface IOrderBody {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      total, items,
    } = req.body as IOrderBody;

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены в базе'));
    }

    const unavailable = products.filter((p) => p.price === null);
    if (unavailable.length > 0) {
      return next(new BadRequestError('Некоторые товары недоступны для покупки'));
    }

    const sum = products.reduce((acc, p) => acc + (p.price || 0), 0);
    if (sum !== total) {
      return next(
        new BadRequestError(`Сумма total (${total}) не совпадает с суммой товаров (${sum})`),
      );
    }

    const orderId = faker.string.uuid();

    return res.status(201).json({
      id: orderId,
      total,
    });
  } catch (err) {
    return next(err);
  }
};

export default createOrder;
