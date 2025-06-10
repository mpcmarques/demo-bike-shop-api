import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  showInMenu: { type: Boolean, default: false },
});

CategorySchema.index({ label: 'text' });
