import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Employee from '../models/Employee.js';
import Sale from '../models/Sale.js';
import Inventory from '../models/Inventory.js';
import { localDB } from '../utils/localDB.js';

dotenv.config();

const runSeed = async () => {
  console.log('Starting DB Seeding Process...');

  // 1. Initial connect attempt
  await connectDB();
  const isMongo = getDbStatus();

  // 2. Encrypt passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const managerPassword = await bcrypt.hash('manager123', salt);
  const staffPassword = await bcrypt.hash('sales123', salt);

  // 3. Define Seed Data
  const seedUsers = [
    {
      name: 'System Admin',
      email: 'admin@dab.com',
      password: adminPassword,
      role: 'admin',
      contactNumber: '+44 7700 900077'
    },
    {
      name: 'General Manager',
      email: 'manager@dab.com',
      password: managerPassword,
      role: 'manager',
      contactNumber: '+44 7700 900111'
    },
    {
      name: 'Lead Sales Associate',
      email: 'sales@dab.com',
      password: staffPassword,
      role: 'sales',
      contactNumber: '+44 7700 900222'
    }
  ];

  const seedCategories = [
    { name: 'Hardware & Machinery', description: 'Power drills, circular saws, and industrial grade toolkits' },
    { name: 'Office Electronics', description: 'Monitors, mechanical keyboards, printers, and connectivity hubs' },
    { name: 'Packing & Logistics', description: 'Heavy-duty packing tape, corrugated sheets, and bubble materials' },
    { name: 'Corporate Merchandise', description: 'Company uniforms, protective glasses, branded notebooks and pens' }
  ];

  const seedSuppliers = [
    {
      name: 'Global Tek Logistics',
      contactPerson: 'Sarah Jenkins',
      email: 'sjenkins@globaltek.com',
      phone: '+44 161 496 0382',
      address: 'Industrial Way, Manchester',
      categorySourced: 'Office Electronics'
    },
    {
      name: 'Apex Tools Ltd',
      contactPerson: 'Robert Vance',
      email: 'rvance@apextools.co.uk',
      phone: '+44 113 496 0834',
      address: 'Apex Park, Leeds',
      categorySourced: 'Hardware & Machinery'
    },
    {
      name: 'Eco Box & Board',
      contactPerson: 'David Carter',
      email: 'dcarter@ecobox.co.uk',
      phone: '+44 20 7946 0912',
      address: 'Green Park, London',
      categorySourced: 'Packing & Logistics'
    }
  ];

  const seedCustomers = [
    {
      name: 'Midland Construction group',
      email: 'purchasing@midlandcg.co.uk',
      phone: '+44 121 496 0192',
      company: 'Midland CG',
      address: 'Birmingham Business Estate',
      outstandingBalance: 1250.00
    },
    {
      name: 'Bright Tech Hub',
      email: 'info@brighttech.co.uk',
      phone: '+44 117 496 0524',
      company: 'Bright Tech Hub Ltd',
      address: 'Innovation Quarter, Bristol',
      outstandingBalance: 0
    },
    {
      name: 'John Miller Corp (Contractor)',
      email: 'jmiller@jmcorp.uk',
      phone: '+44 131 496 0773',
      company: 'Miller Construction',
      address: 'Princes St, Edinburgh',
      outstandingBalance: 450.00
    }
  ];

  const seedProducts = [
    {
      name: 'Titan Professional Power Drill 18V',
      sku: 'TITAN-18V-PDR',
      category: 'Hardware & Machinery',
      price: 189.99,
      costPrice: 95.00,
      stock: 35,
      supplier: 'Apex Tools Ltd',
      description: 'Brushless 18V cordless drill with 2 li-ion batteries, premium carry case and multi-bit accessories.',
      alertQuantity: 8
    },
    {
      name: 'Apex Angle Grinder 115mm',
      sku: 'APEX-115-AGR',
      category: 'Hardware & Machinery',
      price: 69.99,
      costPrice: 32.50,
      stock: 5,
      supplier: 'Apex Tools Ltd',
      description: 'Compact 750W angle grinder with ergonomic grip, disc guard and high thermal heat dispersion.',
      alertQuantity: 8
    },
    {
      name: 'Logitech MX Master 3S Mouse',
      sku: 'LOGI-MX3S-MSE',
      category: 'Office Electronics',
      price: 119.99,
      costPrice: 65.00,
      stock: 22,
      supplier: 'Global Tek Logistics',
      description: 'Ergonomic mouse with silent click tech, magspeed scroll wheel, and high precision 8K DPI tracking.',
      alertQuantity: 5
    },
    {
      name: 'Eco Heavy-Duty Packing Tape (6-Pack)',
      sku: 'ECO-HD-TAPE',
      category: 'Packing & Logistics',
      price: 15.90,
      costPrice: 6.20,
      stock: 120,
      supplier: 'Eco Box & Board',
      description: 'Biodegradable water-resistant packaging tape, strong hot-melt adhesive formula.',
      alertQuantity: 20
    }
  ];

  const seedEmployees = [
    {
      name: 'Clara Oswald',
      email: 'coswald@dab.com',
      phone: '+44 7700 900501',
      designation: 'Inventory Lead Coordinator',
      department: 'Logistics',
      salary: 32500,
      status: 'Active',
      hireDate: new Date('2025-01-15T09:00:00Z')
    },
    {
      name: 'Matthew Harrison',
      email: 'mharrison@dab.com',
      phone: '+44 7700 900612',
      designation: 'Senior Accountant',
      department: 'Finance',
      salary: 42000,
      status: 'Active',
      hireDate: new Date('2024-06-10T09:00:00Z')
    },
    {
      name: 'Liam Vance',
      email: 'lvance@dab.com',
      phone: '+44 7700 900723',
      designation: 'Sales Officer',
      department: 'Sales',
      salary: 28000,
      status: 'Active',
      hireDate: new Date('2025-11-01T09:00:00Z')
    }
  ];

  // 4. Seeding Execution
  if (isMongo) {
    try {
      console.log('Seeding MongoDB...');
      // Clear collections
      await User.deleteMany({});
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Customer.deleteMany({});
      await Supplier.deleteMany({});
      await Employee.deleteMany({});
      await Sale.deleteMany({});
      await Inventory.deleteMany({});

      // Insert User data
      await User.insertMany(seedUsers);
      await Category.insertMany(seedCategories);
      await Supplier.insertMany(seedSuppliers);
      await Customer.insertMany(seedCustomers);
      const insertedProducts = await Product.insertMany(seedProducts);
      await Employee.insertMany(seedEmployees);

      // Seed baseline logs & sales in MongoDB
      const prod1 = insertedProducts[0];
      const prod3 = insertedProducts[2];
      
      const baselineSales = [
        {
          items: [
            { productId: prod1._id.toString(), name: prod1.name, quantity: 2, price: prod1.price, costPrice: prod1.costPrice },
            { productId: prod3._id.toString(), name: prod3.name, quantity: 1, price: prod3.price, costPrice: prod3.costPrice }
          ],
          customerName: 'Midland Construction group',
          totalAmount: (prod1.price * 2) + prod3.price,
          paymentMethod: 'Bank Transfer',
          paymentStatus: 'Paid',
          salesRepresentative: 'Lead Sales Associate',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];
      await Sale.insertMany(baselineSales);

      const baselineLogs = [
        { productId: prod1._id.toString(), productName: prod1.name, type: 'In', quantity: 50, reason: 'Initial Supplier Order (Apex Tools)', updatedBy: 'System Admin' },
        { productId: prod1._id.toString(), productName: prod1.name, type: 'Out', quantity: 2, reason: 'Sale Invoice', updatedBy: 'Lead Sales Associate' }
      ];
      await Inventory.insertMany(baselineLogs);

      console.log('\x1b[32m[OK] MongoDB Seeded Successfully!\x1b[0m');
    } catch (err) {
      console.error('Error seeding MongoDB:', err);
    }
  }

  // 5. Seeding local JSON database as well (flawless fallback!)
  try {
    console.log('Seeding Local JSON Database Fallback...');
    await localDB.clearCollection('users');
    await localDB.clearCollection('categories');
    await localDB.clearCollection('suppliers');
    await localDB.clearCollection('customers');
    await localDB.clearCollection('products');
    await localDB.clearCollection('employees');
    await localDB.clearCollection('sales');
    await localDB.clearCollection('inventory');

    for (const u of seedUsers) await localDB.create('users', u);
    for (const c of seedCategories) await localDB.create('categories', c);
    for (const s of seedSuppliers) await localDB.create('suppliers', s);
    for (const d of seedCustomers) await localDB.create('customers', d);
    
    const localProducts = [];
    for (const p of seedProducts) {
      const prod = await localDB.create('products', p);
      localProducts.push(prod);
    }
    for (const e of seedEmployees) await localDB.create('employees', e);

    // Initial Logs & Sales for local DB
    const lProd1 = localProducts[0];
    const lProd3 = localProducts[2];

    const localSale = {
      items: [
        { productId: lProd1.id, name: lProd1.name, quantity: 2, price: lProd1.price, costPrice: lProd1.costPrice },
        { productId: lProd3.id, name: lProd3.name, quantity: 1, price: lProd3.price, costPrice: lProd3.costPrice }
      ],
      customerName: 'Midland Construction group',
      totalAmount: (lProd1.price * 2) + lProd3.price,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      salesRepresentative: 'Lead Sales Associate',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    };
    await localDB.create('sales', localSale);

    await localDB.create('inventory', {
      productId: lProd1.id,
      productName: lProd1.name,
      type: 'In',
      quantity: 50,
      reason: 'Initial Supplier Order (Apex Tools)',
      updatedBy: 'System Admin'
    });
    
    await localDB.create('inventory', {
      productId: lProd1.id,
      productName: lProd1.name,
      type: 'Out',
      quantity: 2,
      reason: 'Sale Invoice',
      updatedBy: 'Lead Sales Associate'
    });

    console.log('\x1b[32m[OK] Local JSON Database Seeded Successfully!\x1b[0m');
  } catch (err) {
    console.error('Error seeding local JSON fallback:', err);
  }

  console.log('Seeding operations complete. Ready to run!');
  process.exit(0);
};

runSeed();
