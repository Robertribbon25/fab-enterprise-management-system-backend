import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'db_fallback.json');

const emptyDb = {
  users: [],
  products: [],
  customers: [],
  suppliers: [],
  sales: [],
  inventory: [],
  employees: [],
  categories: []
};

// Auto-seed template variables
const runAutoSeed = (data) => {
  console.log('[LocalDB] Database is empty. Injecting baseline corporate entities...');

  // 1. Generate encrypted password hashes
  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync('admin123', salt);
  const managerPassword = bcrypt.hashSync('manager123', salt);
  const staffPassword = bcrypt.hashSync('sales123', salt);

  data.users = [
    {
      id: 'usr-adm',
      _id: 'usr-adm',
      name: 'System Admin',
      email: 'admin@dab.com',
      password: adminPassword,
      role: 'admin',
      contactNumber: '+44 7700 900077',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-mng',
      _id: 'usr-mng',
      name: 'General Manager',
      email: 'manager@dab.com',
      password: managerPassword,
      role: 'manager',
      contactNumber: '+44 7700 900111',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-sls',
      _id: 'usr-sls',
      name: 'Lead Sales Associate',
      email: 'sales@dab.com',
      password: staffPassword,
      role: 'sales',
      contactNumber: '+44 7700 900222',
      createdAt: new Date().toISOString()
    }
  ];

  data.categories = [
    { id: 'cat-hdw', name: 'Hardware & Machinery', description: 'Power drills, circular saws, and industrial grade toolkits' },
    { id: 'cat-ele', name: 'Office Electronics', description: 'Monitors, mechanical keyboards, printers, and connectivity hubs' },
    { id: 'cat-pkg', name: 'Packing & Logistics', description: 'Heavy-duty packing tape, corrugated sheets, and bubble materials' },
    { id: 'cat-mer', name: 'Corporate Merchandise', description: 'Company uniforms, protective glasses, branded notebooks and pens' }
  ];

  data.suppliers = [
    {
      id: 'sup-gbl',
      name: 'Global Tek Logistics',
      contactPerson: 'Sarah Jenkins',
      email: 'sjenkins@globaltek.com',
      phone: '+44 161 496 0382',
      address: 'Industrial Way, Manchester',
      categorySourced: 'Office Electronics'
    },
    {
      id: 'sup-apx',
      name: 'Apex Tools Ltd',
      contactPerson: 'Robert Vance',
      email: 'rvance@apextools.co.uk',
      phone: '+44 113 496 0834',
      address: 'Apex Park, Leeds',
      categorySourced: 'Hardware & Machinery'
    },
    {
      id: 'sup-eco',
      name: 'Eco Box & Board',
      contactPerson: 'David Carter',
      email: 'dcarter@ecobox.co.uk',
      phone: '+44 20 7946 0912',
      address: 'Green Park, London',
      categorySourced: 'Packing & Logistics'
    }
  ];

  data.customers = [
    {
      id: 'cust-mdl',
      name: 'Midland Construction group',
      email: 'purchasing@midlandcg.co.uk',
      phone: '+44 121 496 0192',
      company: 'Midland CG',
      address: 'Birmingham Business Estate',
      outstandingBalance: 1250.00
    },
    {
      id: 'cust-bth',
      name: 'Bright Tech Hub',
      email: 'info@brighttech.co.uk',
      phone: '+44 117 496 0524',
      company: 'Bright Tech Hub Ltd',
      address: 'Innovation Quarter, Bristol',
      outstandingBalance: 0
    },
    {
      id: 'cust-jml',
      name: 'John Miller Corp (Contractor)',
      email: 'jmiller@jmcorp.uk',
      phone: '+44 131 496 0773',
      company: 'Miller Construction',
      address: 'Princes St, Edinburgh',
      outstandingBalance: 450.00
    }
  ];

  data.products = [
    {
      id: 'prod-ttn',
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
      id: 'prod-apx',
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
      id: 'prod-log',
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
      id: 'prod-eco',
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

  data.employees = [
    {
      id: 'emp-cls',
      name: 'Clara Oswald',
      email: 'coswald@dab.com',
      phone: '+44 7700 900501',
      designation: 'Inventory Lead Coordinator',
      department: 'Logistics',
      salary: 32500,
      status: 'Active',
      hireDate: new Date('2025-01-15T09:00:00Z').toISOString()
    },
    {
      id: 'emp-mat',
      name: 'Matthew Harrison',
      email: 'mharrison@dab.com',
      phone: '+44 7700 900612',
      designation: 'Senior Accountant',
      department: 'Finance',
      salary: 42000,
      status: 'Active',
      hireDate: new Date('2024-06-10T09:00:00Z').toISOString()
    },
    {
      id: 'emp-lia',
      name: 'Liam Vance',
      email: 'lvance@dab.com',
      phone: '+44 7700 900723',
      designation: 'Sales Officer',
      department: 'Sales',
      salary: 28000,
      status: 'Active',
      hireDate: new Date('2025-11-01T09:00:00Z').toISOString()
    }
  ];

  data.sales = [
    {
      id: 'sal-001',
      items: [
        { productId: 'prod-ttn', name: 'Titan Professional Power Drill 18V', quantity: 2, price: 189.99, costPrice: 95.00 },
        { productId: 'prod-log', name: 'Logitech MX Master 3S Mouse', quantity: 1, price: 119.99, costPrice: 65.00 }
      ],
      customerName: 'Midland Construction group',
      totalAmount: (189.99 * 2) + 119.99,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      salesRepresentative: 'Lead Sales Associate',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1050).toISOString()
    }
  ];

  data.inventory = [
    { id: 'inv-001', productId: 'prod-ttn', productName: 'Titan Professional Power Drill 18V', type: 'In', quantity: 50, reason: 'Initial Supplier Order (Apex Tools)', updatedBy: 'System Admin', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'inv-002', productId: 'prod-ttn', productName: 'Titan Professional Power Drill 18V', type: 'Out', quantity: 2, reason: 'Sale Invoice', updatedBy: 'Lead Sales Associate', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1050).toISOString() }
  ];

  console.log('[LocalDB] Self-seeding complete! Ready to evaluate.');
};

// Initialize the database file if it does not exist
const initDB = () => {
  if (!fs.existsSync(dbPath)) {
    const data = JSON.parse(JSON.stringify(emptyDb));
    runAutoSeed(data);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } else {
    try {
      const content = fs.readFileSync(dbPath, 'utf-8');
      const data = JSON.parse(content);
      let modified = false;
      for (const key of Object.keys(emptyDb)) {
        if (!data[key]) {
          data[key] = [];
          modified = true;
        }
      }

      // If database contains empty users list, trigger seeding automatically
      if (data.users.length === 0) {
        runAutoSeed(data);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      const data = JSON.parse(JSON.stringify(emptyDb));
      runAutoSeed(data);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    }
  }
};

const readDB = () => {
  initDB();
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return emptyDb;
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

export const localDB = {
  find: async (collection, query = {}) => {
    const data = readDB();
    let list = data[collection] || [];
    
    // Apply basic filtering
    return list.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: async (collection, query = {}) => {
    const list = await localDB.find(collection, query);
    return list[0] || null;
  },

  findById: async (collection, id) => {
    return await localDB.findOne(collection, { id });
  },

  create: async (collection, itemData) => {
    const data = readDB();
    const list = data[collection] || [];
    
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9), // Mongo-like id
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...itemData
    };

    list.push(newItem);
    data[collection] = list;
    writeDB(data);
    return newItem;
  },

  findByIdAndUpdate: async (collection, id, updateData) => {
    const data = readDB();
    const list = data[collection] || [];
    const index = list.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...list[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedItem;
    data[collection] = list;
    writeDB(data);
    return updatedItem;
  },

  findByIdAndDelete: async (collection, id) => {
    const data = readDB();
    const list = data[collection] || [];
    const index = list.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;

    const removedItem = list[index];
    list.splice(index, 1);
    data[collection] = list;
    writeDB(data);
    return removedItem;
  },

  clearCollection: async (collection) => {
    const data = readDB();
    data[collection] = [];
    writeDB(data);
  }
};
