import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDbStatus } from '../config/db.js';
import User from '../models/User.js';
import { localDB } from '../utils/localDB.js';

// Generate Token helper
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwt';
  const idValue = user._id || user.id;
  return jwt.sign(
    {
      id: idValue.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '30d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, contactNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = null;

    if (getDbStatus()) {
      // MongoDB Flow
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'sales',
        contactNumber,
      });
    } else {
      // Fallback localDB Flow
      const userExists = await localDB.findOne('users', { email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      user = await localDB.create('users', {
        name,
        email,
        password: hashedPassword,
        role: role || 'sales',
        contactNumber,
      });
    }

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = null;

    if (getDbStatus()) {
      user = await User.findOne({ email });
    } else {
      user = await localDB.findOne('users', { email });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
