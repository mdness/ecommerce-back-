import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import moment from 'moment';
import mongoose, { FilterQuery } from 'mongoose';
import { NotFound, ProductValidation } from 'errors';
import uniqueValidator from 'mongoose-unique-validator';
import { isQueryValid } from 'utils/validations';

const ProductSchema = new mongoose.Schema<BaseIntItem>({
  name: {
    type: String,
    require: true,
    maxLength: [100, 'Name must have at least 100 characters'],
  },
  description: {
    type: String,
    require: true,
    maxLength: [500, 'Description must have at least 500 characters'],
  },
  code: {
    type: String,
    require: true,
    maxLength: [14, 'Code must have at least 14 characters'],
    unique: true,
  },
  price: {
    type: Number,
    require: true,
    max: [5000, 'Price cannot be greater than 5000'],
  },
  category: {
    type: String,
    require: true,
    maxLength: [20, 'Category must have 20 characters max.'],
  },
  photo: { type: String, require: true },
  photoId: { type: String, require: true },
  timestamp: { type: String, default: moment().format('DD/MM/YYYY HH:mm:ss') },
  stock: { type: Number, default: 0 },
});

ProductSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

ProductSchema.plugin(uniqueValidator, {
  message: 'Code already exists, please enter another option.',
});

export const ProductsModel = mongoose.model<BaseIntItem>(
  'Product',
  ProductSchema,
);

export class ProductsModelMongoDB {
  private products;
  constructor() {
    this.products = ProductsModel;
  }

  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      let output: IntItem | IntItem[] = [];
      if (id) {
        const document = await this.products.find({ _id: id });
        if (document) output = document as unknown as IntItem;
      } else {
        const products = await this.products.find();
        output = products as unknown as IntItem[];
      }
      return output;
    } catch (e) {
      if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Product not found.');
      } else {
        throw { error: e, message: 'An error occurred when loading products.' };
      }
    }
  }

  async getByCategory(category: string): Promise<IntItem[]> {
    try {
      const products = await this.products.find({ category: category });
      return products as IntItem[];
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products' };
    }
  }

  async save(data: BaseIntItem): Promise<IntItem> {
    try {
      const newProduct = await new this.products(data);
      await newProduct.save();
      return newProduct as unknown as IntItem;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(e.errors).map(prop => prop.message);
        throw new ProductValidation(400, messages.join('. '));
      } else {
        throw {
          error: e,
          message: 'An error occurred when saving the product.',
        };
      }
    }
  }

  async update(id: string, data: IntItem): Promise<IntItem> {
    try {
      const updatedProduct = await this.products.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        rawResult: true,
      });
      return updatedProduct.value as unknown as IntItem;
    } catch (e) {
      if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Product to update does not exist.');
      } else if (e instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(e.errors).map(prop => prop.message);
        throw new ProductValidation(400, messages.join('. '));
      } else {
        throw { error: e, message: 'Product could not be updated.' };
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const productDeleted = await this.products.findByIdAndRemove(id);
      if (productDeleted === null)
        throw new NotFound(404, 'Product to update does not exist.');
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Product to delete does not exist.');
      } else {
        throw { error: e, message: 'Product could not be deleted.' };
      }
    }
  }

  async query(options: QueryIntItem): Promise<IntItem[]> {
    const query: FilterQuery<BaseIntItem> = {};

    isQueryValid(options);

    if (options.name) query.name = options.name;

    if (options.code) query.code = options.code;

    if (options.minPrice && options.maxPrice) {
      query.price = {
        $gte: options.minPrice,
        $lte: options.maxPrice,
      };
    } else if (options.minPrice) {
      query.price = { $gte: options.minPrice };
    } else if (options.maxPrice) {
      query.price = { $lte: options.maxPrice };
    }

    if (options.minStock && options.maxStock) {
      query.stock = {
        $gte: options.minStock,
        $lte: options.maxStock,
      };
    } else if (options.minStock) {
      query.stock = { $gte: options.minStock };
    } else if (options.maxStock) {
      query.stock = { $lte: options.maxStock };
    }

    const products = await this.products.find(query);

    return products as IntItem[];
  }
}
