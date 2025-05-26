import { hash, compare } from 'bcrypt';
import * as mongoose from 'mongoose';

const salt = process.env.SALT || 1;

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  floor: { type: String, required: true },
  door: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: '0' },
});

UserSchema.pre('save', async function (next) {
  const hashedPassword = await hash(this.password, salt);

  this.password = hashedPassword;

  next();
});

UserSchema.method(
  'isValidPassword',
  async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
  },
);

export { UserSchema };
