import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  address: {
    type: String,
  },
  outstandingBalance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export default Customer;
