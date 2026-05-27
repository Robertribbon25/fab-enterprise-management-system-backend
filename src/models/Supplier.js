import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
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
  address: {
    type: String,
  },
  categorySourced: {
    type: String,
  },
}, {
  timestamps: true,
});

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
export default Supplier;
