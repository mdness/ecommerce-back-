import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IntUser, BaseIntUser } from 'common/interfaces/users';
import { NotFound } from 'errors';

const Schema = mongoose.Schema;

const UserSchema = new Schema<IntUser>({
  admin: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  number: { type: String },
  apartment: { type: String },
  age: { type: Number, required: true },
  telephone: { type: String, required: true },
  photo: { type: String, required: true },
  photoId: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const comparePass = await bcrypt.compare(password, this.password);
  return comparePass;
};

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = mongoose.model<IntUser>('User', UserSchema);

export class UserModelMongoDb {
  private userModel;

  constructor() {
    this.userModel = UserModel;
  }

  async get(id?: string): Promise<IntUser[] | IntUser> {
    let output: IntUser[] | IntUser = [];
    try {
      if (id) {
        const document = await this.userModel.findById(id);
        if (document !== null) output = document;
        else throw new NotFound(404, 'User not found');
      } else {
        output = await this.userModel.find();
      }
      return output;
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'User not found');
      } else {
        throw {
          error: e,
          message: 'An error occurred when loading users.',
        };
      }
    }
  }

  async save(userData: BaseIntUser): Promise<IntUser> {
    const newUser = new this.userModel(userData);
    await newUser.save();
    return newUser;
  }

  async update(id: string, data: BaseIntUser): Promise<IntUser> {
    return this.userModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async query(email: string): Promise<IntUser> {
    const result = await this.userModel.find({ email });
    return result[0];
  }
}
