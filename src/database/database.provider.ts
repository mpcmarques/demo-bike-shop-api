import * as mongoose from 'mongoose';

const DB_URL = process.env.DB_URL || 'mongodb://localhost/nest';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(DB_URL),
  },
];
