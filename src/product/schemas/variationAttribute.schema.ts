import * as mongoose from 'mongoose';

export const VariationAttributeSchema = new mongoose.Schema({
  type: { type: String, enum: ['color', 'size', 'finish'], required: true },
  value: { type: String, required: true },
});
