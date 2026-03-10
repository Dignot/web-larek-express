// eslint-disable-next-line import/no-extraneous-dependencies
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import validateCreateProduct from '../middlewares/validations';
import { getAllProducts, createProduct } from '../controllers/productController';

const router = express.Router();

// GET /product — возвращает все товары
router.get('/product', getAllProducts);

// POST /product — создаёт товар с валидацией
router.post('/product', validateCreateProduct, createProduct);

// Celebrate middleware для обработки ошибок валидации
router.use(celebrateErrors());

export default router;
