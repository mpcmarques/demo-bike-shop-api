import { Connection } from 'mongoose';
import { CategorySchema } from './schemas/category.schema';

export const categoryProvider = [
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
