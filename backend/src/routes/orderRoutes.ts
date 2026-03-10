// eslint-disable-next-line import/no-extraneous-dependencies
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import createOrder from '../controllers/orderController';
import { validateCreateOrder } from '../middlewares/validators/orderValidator';

const router = express.Router();

// POST /order — оформление заказа с валидацией
router.post('/order', validateCreateOrder, createOrder);

// Celebrate middleware для обработки ошибок валидации
router.use(celebrateErrors());

export default router;
