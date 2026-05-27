import { getDbStatus } from '../config/db.js';
import Employee from '../models/Employee.js';
import { localDB } from '../utils/localDB.js';

export const getEmployees = async (req, res, next) => {
  try {
    let employees;
    if (getDbStatus()) {
      employees = await Employee.find();
    } else {
      employees = await localDB.find('employees');
    }
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let employee;
    if (getDbStatus()) {
      employee = await Employee.findById(id);
    } else {
      employee = await localDB.findById('employees', id);
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, designation, department, salary, status, hireDate } = req.body;

    if (!name || !email || !phone || !designation || !department || salary === undefined) {
      return res.status(400).json({ success: false, message: 'All specified keys are required' });
    }

    let employee;
    if (getDbStatus()) {
      const exists = await Employee.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Employee already registered with this email' });
      }
      employee = await Employee.create({
        name, email, phone, designation, department, salary, status: status || 'Active', hireDate
      });
    } else {
      const exists = await localDB.findOne('employees', { email });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Employee already registered with this email' });
      }
      employee = await localDB.create('employees', {
        name, email, phone, designation, department, salary, status: status || 'Active', hireDate
      });
    }

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    let employee;
    if (getDbStatus()) {
      employee = await Employee.findByIdAndUpdate(id, fields, { new: true, runValidators: true });
    } else {
      employee = await localDB.findByIdAndUpdate('employees', id, fields);
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let employee;
    if (getDbStatus()) {
      employee = await Employee.findByIdAndDelete(id);
    } else {
      employee = await localDB.findByIdAndDelete('employees', id);
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
