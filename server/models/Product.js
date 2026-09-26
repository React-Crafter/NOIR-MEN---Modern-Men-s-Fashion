import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    categorySlug: { type: String },
    price: { type: Number, required: true },
    previousPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    colors: [
      {
        name: { type: String, default: 'Standard' },
        hex: { type: String, default: '#111111' }
      }
    ],
    sizes: [{ type: String }],
    stock: { type: Number, default: 10 },
    description: { type: String, default: '' },
    fabric: { type: String, default: '' },
    fit: { type: String, default: '' },
    careInstructions: { type: String, default: '' },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
