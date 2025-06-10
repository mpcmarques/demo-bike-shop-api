import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';
import { VariationAttributeSchema } from './variationAttribute.schema';
import { Product } from '../interfaces/product.interface';

export const ComposedProductsSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
});

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
  image: {
    type: String,
    required: true,
    default: 'https://picsum.photos/300?random=1',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  variationAttributes: {
    type: [VariationAttributeSchema],
    required: false,
    default: null,
  },
  listPrice: { type: Number, required: true },
  salesPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  productType: {
    type: String,
    enum: ['master', 'variant', 'composed'],
    required: true,
    default: 'master',
  },
  composed: {
    type: [[ComposedProductsSchema]],
    required: false,
  },
  variants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    required: false,
  },
});

ProductSchema.post('save', async function (doc) {
  // If this product is not a master and has a masterProduct reference
  if (doc.productType !== 'master' && doc.masterProduct) {
    try {
      // Get the Product model
      const Product = mongoose.model('Product');

      // Find the master product and add this product to its variants if not already present
      await Product.findByIdAndUpdate(
        doc.masterProduct,
        {
          $addToSet: { variants: doc._id }, // $addToSet prevents duplicates
        },
        { new: true },
      );
    } catch (error) {
      console.error('Error updating master product variants:', error);
    }
  }
});

ProductSchema.post('findOneAndUpdate', async function () {
  // Get the Product model
  const Product = mongoose.model<Product>('Product');

  const product = await Product.findOne(this.getQuery());

  // If this product is not a master and has a masterProduct reference
  if (product?.productType !== 'master' && product?.masterProduct) {
    try {
      // Find the master product and add this product to its variants if not already present
      await Product.findByIdAndUpdate(
        product.masterProduct,
        {
          $addToSet: { variants: product }, // $addToSet prevents duplicates
        },
        { new: true },
      );
    } catch (error) {
      console.error('Error updating master product variants:', error);
    }
  }
});

ProductSchema.post('findOneAndDelete', async function (doc) {
  // If the deleted product is not a master and has a masterProduct reference
  if (doc && doc.productType !== 'master' && doc.masterProduct) {
    try {
      // Get the Product model
      const Product = mongoose.model('Product');

      // Remove this product from the master product's variants array
      await Product.findByIdAndUpdate(
        doc.masterProduct,
        {
          $pull: { variants: doc._id }, // $pull removes the specific ID
        },
        { new: true },
      );
    } catch (error) {
      console.error('Error removing variant from master product:', error);
    }
  }
});

// ProductSchema.post('deleteOne', async function () {
//   // Get the document that was deleted using the query conditions
//   const deletedDoc = await this.model.findOne(this.getQuery());

//   // If the deleted product is not a master and has a masterProduct reference
//   if (
//     deletedDoc &&
//     deletedDoc.productType !== 'master' &&
//     deletedDoc.masterProduct
//   ) {
//     try {
//       // Get the Product model
//       const Product = mongoose.model('Product');

//       // Remove this product from the master product's variants array
//       await Product.findByIdAndUpdate(
//         deletedDoc.masterProduct,
//         {
//           $pull: { variants: deletedDoc._id },
//         },
//         { new: true },
//       );
//     } catch (error) {
//       console.error('Error removing variant from master product:', error);
//     }
//   }
// });

ProductSchema.index({ label: 'text' });
