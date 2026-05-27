import { getDbStatus } from '../config/db.js';
import Supplier from '../models/Supplier.js';
import { localDB } from '../utils/localDB.js';

export const getSuppliers = async (req, res, next) => {
  try {
    let suppliers;
    if (getDbStatus()) {
      suppliers = await Supplier.find();
    } else {
      suppliers = await localDB.find('suppliers');
    }
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    next(error);
  }
};

export const getSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    let supplier;
    if (getDbStatus()) {
      supplier = await Supplier.findById(id);
    } else {
      supplier = await localDB.findById('suppliers', id);
    }

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address, categorySourced } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    let supplier;
    if (getDbStatus()) {
      supplier = await Supplier.create({
        name, contactPerson, email, phone, address, categorySourced
      });
    } else {
      supplier = await localDB.create('suppliers', {
        name, contactPerson, email, phone, address, categorySourced
      });
    }

    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    let supplier;
    if (getDbStatus()) {
      supplier = await Supplier.findByIdAndUpdate(id, fields, { new: true, runValidators: true });
    } else {
      supplier = await localDB.findByIdAndUpdate('suppliers', id, fields);
    }

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    let supplier;
    if (getDbStatus()) {
      supplier = await Supplier.findByIdAndDelete(id);
    } else {
      supplier = await localDB.findByIdAndDelete('suppliers', id);
    }

    if (!supplier) {
      return res.status(401).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};
