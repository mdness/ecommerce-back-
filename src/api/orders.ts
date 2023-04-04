import { BaseIntOrder } from 'common/interfaces/orders';
import { OrdersModelFactory } from 'models/factory/orders';
import { modelTypeToUse } from './modelType';

class OrdersAPI {
  private factory;

  constructor() {
    this.factory = OrdersModelFactory.model(modelTypeToUse);
  }

  async get(userId: string, orderId?: string) {
    if (orderId) return this.factory.get(userId, orderId);
    return this.factory.get(userId);
  }

  async save(userId: string, order: BaseIntOrder) {
    const newOrder = await this.factory.save(userId, order);
    return newOrder;
  }

  async update(orderId: string) {
    return this.factory.update(orderId);
  }
}

export const ordersAPI = new OrdersAPI();
