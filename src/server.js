import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import customerRoutes from './routes/customer.js';
import supplierRoutes from './routes/supplier.js';
import saleRoutes from './routes/sale.js';
import inventoryRoutes from './routes/inventory.js';
import employeeRoutes from './routes/employee.js';
import categoryRoutes from './routes/category.js';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS for frontend and API
app.use(cors({
  origin: '*', // Allow all in dev / preview
  credentials: true,
}));

// Route mappings
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/categories', categoryRoutes);

// Base health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Error handler middleware (MUST be last)
app.use(errorHandler);

// Set Port
const PORT = 5000;

// Initialize Database & Server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}\x1b[0m`);
    console.log(`\x1b[34m[Server] Health Check available at http://localhost:${PORT}/api/health\x1b[0m`);
  });
};

startServer();
