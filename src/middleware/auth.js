import jwt from 'jsonwebtoken';
import { getDbStatus } from '../config/db.js';
import User from '../models/User.js';
import { localDB } from '../utils/localDB.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token list missing' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';
    const decoded = jwt.verify(token, JWT_SECRET);

    // Dynamic database check
    let user = null;
    if (getDbStatus()) {
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Safe failover
      }
    }

    if (!user) {
      // Check local JSON fallback DB
      const localUser = await localDB.findOne('users', { id: decoded.id });
      if (localUser) {
        const { password, ...userWithoutPassword } = localUser;
        user = userWithoutPassword;
      }
    }

    // Fall back to the token contents themselves if user was deleted or localDB was cleared
    if (!user) {
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'none'}' is not authorized to access this resource`
      });
    }
    next();
  };
};
