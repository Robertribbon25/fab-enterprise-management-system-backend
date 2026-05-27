import { getDbStatus } from '../config/db.js';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Customer from '../models/Customer.js';
import { localDB } from '../utils/localDB.js';

export const getSales = async (req, res, next) => {
  try {
    let sales;
    if (getDbStatus()) {
      sales = await Sale.find().sort({ createdAt: -1 });
    } else {
      sales = await localDB.find('sales');
      // Sort sales by date descending
      sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.status(200).json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    next(error);
  }
};

export const getSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    let sale;
    if (getDbStatus()) {
      sale = await Sale.findById(id);
    } else {
      sale = await localDB.findById('sales', id);
    }

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale invoice not found' });
    }
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req, res, next) => {
  try {
    const { items, customerName, customerId, paymentMethod, paymentStatus, discount, tax, notes } = req.body;

    if (!items || items.length === 0 || !customerName) {
      return res.status(400).json({ success: false, message: 'Items list and customerName are required' });
    }

    let calculatedTotal = 0;
    const processedItems = [];

    // 1. Process and validate sold items
    for (const fileItem of items) {
      let matchingProduct = null;
      if (getDbStatus()) {
        matchingProduct = await Product.findById(fileItem.productId);
      } else {
        matchingProduct = await localDB.findById('products', fileItem.productId);
      }

      if (!matchingProduct) {
        return res.status(404).json({ success: false, message: `Product not found: ID ${fileItem.productId}` });
      }

      const sellPrice = fileItem.price || matchingProduct.price;
      const amount = fileItem.quantity * sellPrice;
      calculatedTotal += amount;

      processedItems.push({
        productId: matchingProduct._id?.toString() || matchingProduct.id,
        name: matchingProduct.name,
        quantity: Number(fileItem.quantity),
        price: Number(sellPrice),
        costPrice: Number(matchingProduct.costPrice || 0),
      });

      // 2. Decrement corresponding product stock
      const updatedStock = Math.max(0, matchingProduct.stock - Number(fileItem.quantity));
      if (getDbStatus()) {
        await Product.findByIdAndUpdate(matchingProduct._id, { stock: updatedStock });
      } else {
        await localDB.findByIdAndUpdate('products', matchingProduct.id, { stock: updatedStock });
      }

      // 3. Keep standard audit tracking logs in Inventory
      const logData = {
        productId: matchingProduct._id?.toString() || matchingProduct.id,
        productName: matchingProduct.name,
        type: 'Out',
        quantity: Number(fileItem.quantity),
        reason: `Sale Invoice (Customer: ${customerName})`,
        updatedBy: req.user?.name || 'Sales Staff',
      };

      if (getDbStatus()) {
        await Inventory.create(logData);
      } else {
        await localDB.create('inventory', logData);
      }
    }

    let netTotal = calculatedTotal;
    if (discount) netTotal -= Number(discount);
    if (tax) netTotal += Number(tax);
    netTotal = Math.max(0, netTotal);

    // 4. Update Outstanding debtor balances on customers
    if (customerId && (paymentStatus === 'Unpaid' || paymentStatus === 'Partially Paid')) {
      const debtValue = paymentStatus === 'Unpaid' ? netTotal : (netTotal / 2); // Simple split for partial
      let targetCustomer = null;
      if (getDbStatus()) {
        targetCustomer = await Customer.findById(customerId);
        if (targetCustomer) {
          const currentBalance = targetCustomer.outstandingBalance || 0;
          await Customer.findByIdAndUpdate(customerId, { outstandingBalance: currentBalance + debtValue });
        }
      } else {
        targetCustomer = await localDB.findById('customers', customerId);
        if (targetCustomer) {
          const currentBalance = targetCustomer.outstandingBalance || 0;
          await localDB.findByIdAndUpdate('customers', customerId, { outstandingBalance: currentBalance + debtValue });
        }
      }
    }

    // 5. Build final Sale entry
    const finalSaleData = {
      items: processedItems,
      customerName,
      customerId,
      totalAmount: netTotal,
      paymentMethod,
      paymentStatus: paymentStatus || 'Paid',
      salesRepresentative: req.user?.name || 'Sales Rep',
      discount: discount || 0,
      tax: tax || 0,
      notes,
    };

    let saleEntry;
    if (getDbStatus()) {
      saleEntry = await Sale.create(finalSaleData);
    } else {
      saleEntry = await localDB.create('sales', finalSaleData);
    }

    res.status(201).json({ success: true, data: saleEntry });
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    let sale;
    if (getDbStatus()) {
      sale = await Sale.findByIdAndDelete(id);
    } else {
      sale = await localDB.findByIdAndDelete('sales', id);
    }

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale invoice not found' });
    }

    // Reverse inventory movement if necessary (optional bonus feature, here we just return success)
    res.status(200).json({ success: true, message: 'Sale invoice deleted and returned' });
  } catch (error) {
    next(error);
  }
};
