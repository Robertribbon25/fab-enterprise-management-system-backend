import { getDbStatus } from '../config/db.js';
import Product from '../models/Product.js';
import { localDB } from '../utils/localDB.js';

export const getProducts = async (req, res, next) => {
  try {
    let products;
    if (getDbStatus()) {
      products = await Product.find();
    } else {
      products = await localDB.find('products');
    }
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;
    if (getDbStatus()) {
      product = await Product.findById(id);
    } else {
      product = await localDB.findById('products', id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, costPrice, stock, supplier, description, alertQuantity } = req.body;

    if (!name || !sku || !category || price === undefined || costPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Name, SKU, category, price, and costPrice are required' });
    }

    let product;
    if (getDbStatus()) {
      const exists = await Product.findOne({ sku });
      if (exists) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
      product = await Product.create({
        name, sku, category, price, costPrice, stock: stock || 0, supplier, description, alertQuantity: alertQuantity || 10
      });
    } else {
      const exists = await localDB.findOne('products', { sku });
      if (exists) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
      product = await localDB.create('products', {
        name, sku, category, price, costPrice, stock: stock || 0, supplier, description, alertQuantity: alertQuantity || 10
      });
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    let product;
    if (getDbStatus()) {
      product = await Product.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    } else {
      product = await localDB.findByIdAndUpdate('products', id, updateFields);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;
    if (getDbStatus()) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await localDB.findByIdAndDelete('products', id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
