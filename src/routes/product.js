import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'manager', 'storekeeper'), createProduct);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('admin', 'manager', 'storekeeper'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;
