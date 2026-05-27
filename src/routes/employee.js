import express from 'express';
import { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'manager'), getEmployees)
  .post(protect, authorize('admin'), createEmployee);

router.route('/:id')
  .get(protect, authorize('admin', 'manager'), getEmployee)
  .put(protect, authorize('admin', 'manager'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

export default router;
