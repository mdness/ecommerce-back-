import { IntCart, CartIntItem } from '/common/interfaces/cart';
import { ProductsModel } from 'models/mongodb/product';
import { NotFound } from 'errors';
import mongoose from 'mongoose';
import { logger } from 'services/logger';
import { MongoCartIntModel } from 'models/factory/cart';

const CartSchema = new mongoose.Schema<IntCart>(
  {
    user: {
      type: 'ObjectId',
      ref: 'User',
    },
    products: [
      {
        _id: false,
        product: {
          type: 'ObjectId',
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

CartSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const CartModel = mongoose.model<IntCart>('Cart', CartSchema);

export class CartModelMongoDB implements MongoCartIntModel {
  private cartModel;
  private productsModel;
  constructor() {
    this.cartModel = CartModel;
    this.productsModel = ProductsModel;
  }

  async createCart(userId: string): Promise<IntCart> {
    const newCart = new this.cartModel({
      user: userId,
      products: [],
    });
    await newCart.save();
    return newCart;
  }

  async get(
    userId: string,
    productId?: string,
  ): Promise<CartIntItem[] | CartIntItem> {
    try {
      let output: CartIntItem | CartIntItem[] = [];

      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('products.product');

      if (cart && productId) {
        // if there's a productId in the request, search for that product in the cart
        const product = cart.products.find(
          item => item.product.id.toString() === productId,
        );
        // if the product is in the cart return that product, if not throw an error
        if (product) output = product;
        else throw new NotFound(404, 'Product does not exist on cart.');
      } else if (cart) {
        // if there's no productId in the request return all the products in the cart
        output = cart.products;
      }
      return output;
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Cart does not exist.');
      } else {
        throw { error: e, message: 'An error occurred when loading products.' };
      }
    }
  }

  async save(userId: string, productId: string): Promise<CartIntItem[]> {
    try {
      const product = await this.productsModel.findById(productId);

      if (product) {
        const cart = await this.cartModel
          .findOne({ user: userId })
          .populate('products.product');
        // Checks if product already in cart.
        if (cart) {
          const productInCartIndex = cart.products.findIndex(
            item => item.product.id.toString() === productId,
          );

          if (productInCartIndex === -1) {
            // if it's not in the cart, add 1
            cart.products = cart.products.concat({
              product: product._id,
              quantity: 1,
            });

            await cart.save();
            const updatedCart = await cart.populate('products.product');
            return updatedCart.products;
          } else {
            // if it's in the cart then add 1 more
            cart.products[productInCartIndex].quantity += 1;
            logger.info('Product already in cart. Adding another unit.');
            await cart.save();
            return cart.products;
          }
        }
        throw new NotFound(404, 'Cart does not exist.');
      }
      throw new NotFound(404, 'Product to add does not exist.');
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Product or Cart to add does not exist');
      } else {
        throw { error: e, message: 'An error occurred when saving products.' };
      }
    }
  }

  async update(
    userId: string,
    productId: string,
    amount: number,
  ): Promise<CartIntItem[]> {
    try {
      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('products.product');

      if (cart) {
        // check if product is in the cart
        const productInCartIndex = cart.products.findIndex(
          item => item.product.id.toString() === productId,
        );

        if (productInCartIndex !== -1) {
          // if it is, add the specified amount
          cart.products[productInCartIndex].quantity = amount;
          await cart.save();
          return cart.products;
        }
        throw new NotFound(
          404,
          'Product you wish to edit does not exist on Cart',
        );
      }
      throw new NotFound(404, 'Cart does not exist');
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(404, 'Cart does not exist');
      } else {
        throw { error: e, message: 'An error occurred when updating product' };
      }
    }
  }

  async delete(userId: string, productId?: string): Promise<CartIntItem[]> {
    try {
      const cart = await this.cartModel
        .findOne({ user: userId })
        .populate('products.product');
      if (cart && productId) {
        const productInCartIndex = cart.products.findIndex(
          item => item.product.id.toString() === productId,
        );
        if (productInCartIndex !== -1) {
          // if it is, remove it from cart
          const newProductsInCart = cart.products.filter(
            item => item.product.id.toString() !== productId,
          );
          cart.products = newProductsInCart;
          await cart.save();
          return cart.products;
        }
        throw new NotFound(404, 'Product to delete does not exist on cart');
      }
      if (cart) {
        // if the cart exists but no productId is received, then delete all products
        cart.products = [];
        await cart.save();
        return cart.products;
      }
      throw new NotFound(404, 'Cart does not exist.');
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
}
