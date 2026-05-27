import { getDbStatus } from '../config/db.js';
import Category from '../models/Category.js';
import { localDB } from '../utils/localDB.js';

export const getCategories = async (req, res, next) => {
  try {
    let categories;
    if (getDbStatus()) {
      categories = await Category.find();
    } else {
      categories = await localDB.find('categories');
    }
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    let category;
    const { id } = req.params;
    if (getDbStatus()) {
      category = await Category.findById(id);
    } else {
      category = await localDB.findById('categories', id);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let category;
    if (getDbStatus()) {
      const exists = await Category.findOne({ name });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }
      category = await Category.create({ name, description });
    } else {
      const exists = await localDB.findOne('categories', { name });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }
      category = await localDB.create('categories', { name, description });
    }

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    let category;
    if (getDbStatus()) {
      category = await Category.findByIdAndUpdate(id, { name, description }, { new: true, runValidators: true });
    } else {
      category = await localDB.findByIdAndUpdate('categories', id, { name, description });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category;
    if (getDbStatus()) {
      category = await Category.findByIdAndDelete(id);
    } else {
      category = await localDB.findByIdAndDelete('categories', id);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
