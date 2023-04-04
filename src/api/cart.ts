import { modelTypeToUse } from './modelType';
import { UserNotExists } from 'errors';
import { CartModelFactory } from 'models/factory/cart';
import { CartModelMongoDB } from 'models/mongodb/cart';
import { userAPI } from './user';

class CartAPI {
  private factory;

  constructor() {
    this.factory = CartModelFactory.model(modelTypeToUse);
  }

  async createCart(userId: string) {
    const user = await userAPI.getUsers(userId);

    if (!user)
      throw new UserNotExists(
        400,
        'An error occurred when creating cart. User does not exist',
      );

    if (this.factory instanceof CartModelMongoDB) {
      const newCart = await this.factory.createCart(userId);
      return newCart;
    } else {
      throw new Error('Cart could not be created.');
    }
  }

  get(userId: string, productId?: string) {
    if (productId) return this.factory.get(userId, productId);
    return this.factory.get(userId);
  }

  async save(userId: string, productId: string) {
    const newProduct = await this.factory.save(userId, productId);
    return newProduct;
  }

  async update(userId: string, productId: string, amount: number) {
    if (this.factory instanceof CartModelMongoDB) {
      const updatedCart = await this.factory.update(userId, productId, amount);
      return updatedCart;
    } else {
      throw new Error('Cart could not be created');
    }
  }

  delete(userId: string, productId?: string) {
    if (productId) return this.factory.delete(userId, productId);
    return this.factory.delete(userId);
  }
}

export const cartAPI = new CartAPI();
