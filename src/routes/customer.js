import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getCustomers)
  .post(protect, authorize('admin', 'manager', 'sales'), createCustomer);

router.route('/:id')
  .get(protect, getCustomer)
  .put(protect, authorize('admin', 'manager', 'sales'), updateCustomer)
  .delete(protect, authorize('admin'), deleteCustomer);

export default router;
