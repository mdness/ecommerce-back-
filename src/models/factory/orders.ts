import { ModelType } from 'common/enums';
import { IntOrder, BaseIntOrder } from 'common/interfaces/orders';
import { OrdersModelMongoDb } from 'models/mongodb/orders';

interface IntModel {
  save: (userId: string, data: BaseIntOrder) => Promise<IntOrder>;
  get: (userId: string, orderId?: string) => Promise<IntOrder | IntOrder[]>;
  update: (orderId: string) => Promise<IntOrder>;
}

export class OrdersModelFactory {
  static model(type: number): IntModel {
    switch (type) {
      case ModelType.localMongo:
      case ModelType.mongoAtlas:
        return new OrdersModelMongoDb();
      default:
        return new OrdersModelMongoDb();
    }
  }
}
