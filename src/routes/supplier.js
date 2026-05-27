import express from 'express';
import { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplier.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, authorize('admin', 'manager', 'storekeeper'), createSupplier);

router.route('/:id')
  .get(protect, getSupplier)
  .put(protect, authorize('admin', 'manager', 'storekeeper'), updateSupplier)
  .delete(protect, authorize('admin'), deleteSupplier);

export default router;
