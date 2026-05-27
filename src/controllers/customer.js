import { getDbStatus } from '../config/db.js';
import Customer from '../models/Customer.js';
import { localDB } from '../utils/localDB.js';

export const getCustomers = async (req, res, next) => {
  try {
    let customers;
    if (getDbStatus()) {
      customers = await Customer.find();
    } else {
      customers = await localDB.find('customers');
    }
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    let customer;
    if (getDbStatus()) {
      customer = await Customer.findById(id);
    } else {
      customer = await localDB.findById('customers', id);
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, address, outstandingBalance } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    let customer;
    if (getDbStatus()) {
      customer = await Customer.create({
        name, email, phone, company, address, outstandingBalance: outstandingBalance || 0
      });
    } else {
      customer = await localDB.create('customers', {
        name, email, phone, company, address, outstandingBalance: outstandingBalance || 0
      });
    }

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    let customer;
    if (getDbStatus()) {
      customer = await Customer.findByIdAndUpdate(id, fields, { new: true, runValidators: true });
    } else {
      customer = await localDB.findByIdAndUpdate('customers', id, fields);
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    let customer;
    if (getDbStatus()) {
      customer = await Customer.findByIdAndDelete(id);
    } else {
      customer = await localDB.findByIdAndDelete('customers', id);
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
