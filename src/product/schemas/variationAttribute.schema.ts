import * as mongoose from 'mongoose';

export const VariationAttributeSchema = new mongoose.Schema({
  color: { type: String },
  size: { type: String },
});
