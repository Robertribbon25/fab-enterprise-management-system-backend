import express from 'express';
import { getInventoryLogs, createInventoryLog } from '../controllers/inventory.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getInventoryLogs)
  .post(protect, authorize('admin', 'manager', 'storekeeper'), createInventoryLog);

export default router;
