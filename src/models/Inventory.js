import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['In', 'Out', 'Adjustment'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
export default Inventory;
