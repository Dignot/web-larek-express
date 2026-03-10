import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import Product from '../models/product';

interface IOrderBody {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив _id товаров
}

// eslint-disable-next-line @typescript-eslint/require-await
const createOrder = async (req: Request, res: Response) => {
  try {
    const { payment, email, phone, address, total, items } = req.body as IOrderBody;

    // Проверка обязательных полей
    if (!payment || !['card', 'online'].includes(payment)) {
      return res.status(400).json({ message: 'Поле payment должно быть card или online' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Неверный email' });
    }
    if (!phone) return res.status(400).json({ message: 'Поле phone обязательно' });
    if (!address) return res.status(400).json({ message: 'Поле address обязательно' });
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Поле items должно быть непустым массивом' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ message: 'Поле total обязательно и должно быть числом' });
    }

    // Получаем товары из базы
    const products = await Product.find({ _id: { $in: items } });

    // Проверка всех товаров
    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Некоторые товары не найдены в базе' });
    }

    // Проверка, что товары продаются (price != null)
    const unavailable = products.filter((p) => p.price === null);
    if (unavailable.length > 0) {
      return res.status(400).json({ message: 'Некоторые товары недоступны для покупки' });
    }

    // Проверка суммы
    const sum = products.reduce((acc, p) => acc + (p.price || 0), 0);
    if (sum !== total) {
      return res
        .status(400)
        .json({ message: `Сумма total (${total}) не совпадает с суммой товаров (${sum})` });
    }

    // Генерируем ID заказа
    const orderId = faker.string.uuid();

    // Возвращаем успешный ответ
    return res.status(201).json({
      id: orderId,
      total,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка сервера при создании заказа' });
  }
};

export default createOrder;
