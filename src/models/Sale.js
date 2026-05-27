import mongoose from 'mongoose';

const SaleItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  costPrice: {
    type: Number,
    default: 0,
  },
});

const SaleSchema = new mongoose.Schema({
  items: [SaleItemSchema],
  customerName: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Debt'],
    default: 'Cash',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Partially Paid', 'Unpaid'],
    default: 'Paid',
  },
  salesRepresentative: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
export default Sale;
