import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  sku: { type: mongoose.Schema.Types.UUID, default: () => randomUUID() },
  masterProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  variationAttributes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'VariationAttribute',
  },
  listPrice: { type: Number, required: true },
  salesPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  productType: {
    type: String,
    enum: ['single', 'composed', 'bundle'],
    required: true,
    default: 'single',
  },
});
