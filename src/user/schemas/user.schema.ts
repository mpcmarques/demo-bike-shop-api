import { hash, genSalt } from 'bcrypt';
import * as mongoose from 'mongoose';

const saltRounds = process.env.SALT_ROUNDS || 1;

const CartSchema = new mongoose.Schema({
  total: { type: Number, required: true, default: 0 },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      combination: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        required: false,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

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
  salt: { type: String },
  roles: { type: [String], default: ['user'] },
  cart: { type: CartSchema, default: { total: 0, items: [] } },
});

UserSchema.pre('save', async function (next) {
  if (!this.salt) {
    const salt = await genSalt(saltRounds as number);

    const hashedPassword = await hash(this.password, salt);

    this.password = hashedPassword;
    this.salt = salt;
  }

  next();
});

UserSchema.method(
  'isValidPassword',
  async function (password: string): Promise<boolean> {
    if (!this.salt) return false;

    const hashedPassword = await hash(password, this.salt);
    return hashedPassword === this.password;
  },
);

export { UserSchema };
