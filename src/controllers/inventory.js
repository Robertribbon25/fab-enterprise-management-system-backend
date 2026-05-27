import { getDbStatus } from '../config/db.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import { localDB } from '../utils/localDB.js';

export const getInventoryLogs = async (req, res, next) => {
  try {
    let logs;
    if (getDbStatus()) {
      logs = await Inventory.find().sort({ createdAt: -1 });
    } else {
      logs = await localDB.find('inventory');
      logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

export const createInventoryLog = async (req, res, next) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    if (!productId || !type || quantity === undefined || !reason) {
      return res.status(400).json({ success: false, message: 'ProductId, type, quantity, and reason are required' });
    }

    let product;
    if (getDbStatus()) {
      product = await Product.findById(productId);
    } else {
      product = await localDB.findById('products', productId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const changeQty = Number(quantity);
    let finalStock = product.stock;

    if (type === 'In') {
      finalStock += changeQty;
    } else if (type === 'Out') {
      finalStock = Math.max(0, finalStock - changeQty);
    } else if (type === 'Adjustment') {
      finalStock = changeQty; // Direct set to quantity
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    // Update Product Stock
    if (getDbStatus()) {
      await Product.findByIdAndUpdate(productId, { stock: finalStock });
    } else {
      await localDB.findByIdAndUpdate('products', productId, { stock: finalStock });
    }

    // Save Log
    const newLogData = {
      productId: product._id?.toString() || product.id,
      productName: product.name,
      type,
      quantity: changeQty,
      reason,
      updatedBy: req.user?.name || 'Inventory Staff'
    };

    let log;
    if (getDbStatus()) {
      log = await Inventory.create(newLogData);
    } else {
      log = await localDB.create('inventory', newLogData);
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};
