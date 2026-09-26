import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    district: { type: String, required: true },
    area: { type: String, default: '' },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    products: [
      {
        id: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, default: 'M' },
        color: {
          name: { type: String, default: 'Standard' },
          hex: { type: String, default: '#111111' }
        },
        image: { type: String }
      }
    ],
    totalQuantity: { type: Number, required: true, default: 1 },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 80 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.orderId || ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
