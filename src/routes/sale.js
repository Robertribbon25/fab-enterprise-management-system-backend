import express from 'express';
import { getSales, getSale, createSale, deleteSale } from '../controllers/sale.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getSales)
  .post(protect, authorize('admin', 'manager', 'sales'), createSale);

router.route('/:id')
  .get(protect, getSale)
  .delete(protect, authorize('admin'), deleteSale);

export default router;
