import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import validateCreateProduct from '../middlewares/validations';
import { getAllProducts, createProduct } from '../controllers/productController';

const router = express.Router();

router.get('/product', getAllProducts);

router.post('/product', validateCreateProduct, createProduct);

router.use(celebrateErrors());

export default router;
