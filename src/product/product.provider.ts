import { Connection } from 'mongoose';
import { ProductSchema } from './schemas/product.schema';

export const productProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'VARIATION_ATTRIBUTE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('VariationAttribute', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
