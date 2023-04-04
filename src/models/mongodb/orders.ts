import mongoose from 'mongoose';
import { IntOrder, BaseIntOrder } from 'common/interfaces/orders';
import { NotFound, OrderError } from 'errors';
import { UserModel } from './user';

const Schema = mongoose.Schema;

const OrderSchema = new Schema<IntOrder>(
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
    total: { type: Number, required: true },
    status: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'timestamp',
    },
  },
);

OrderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const OrdersModel = mongoose.model<IntOrder>('Order', OrderSchema);

export class OrdersModelMongoDb {
  private ordersModel;
  private userModel;

  constructor() {
    this.ordersModel = OrdersModel;
    this.userModel = UserModel;
  }

  async save(userId: string, order: BaseIntOrder): Promise<IntOrder> {
    try {
      const newOrder = new this.ordersModel({
        user: userId,
        ...order,
      });
      await newOrder.save();
      const populatedOrder = await newOrder.populate({
        path: 'products.product',
        select: 'name description price',
      });
      return populatedOrder.populate({ path: 'user', select: 'email' });
    } catch (e) {
      if (e instanceof mongoose.Error.CastError) {
        throw new OrderError(
          500,
          'An error occurred when creating order, please try again.',
        );
      } else {
        throw {
          error: e,
          message: 'An error occurred when creating order, please try again.',
        };
      }
    }
  }

  async get(userId?: string, orderId?: string): Promise<IntOrder | IntOrder[]> {
    try {
      let output: IntOrder | IntOrder[] = [];

      if (userId && orderId) {
        const user = await this.userModel.findById(userId);
        const order = await this.ordersModel
          .findById(orderId)
          .populate({
            path: 'products.product',
            select: 'name description price',
          })
          .populate({
            path: 'user',
            select: 'email',
          });
        if (
          order &&
          (userId.toString() ===
            (order.user as unknown as IntOrder).id.toString() ||
            user?.admin)
        )
          output = order;
        else
          throw new NotFound(
            400,
            "Order not found, please check order's number",
          );
      } else {
        const orders = await this.ordersModel
          .find(userId ? { user: userId } : {})
          .populate({
            path: 'products.product',
            select: 'name description price',
          })
          .populate({
            path: 'user',
            select: 'email',
          });
        output = orders;
      }
      return output;
    } catch (e) {
      if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(
          404,
          'Order could not be found, please check the data and try again',
        );
      } else if (e instanceof NotFound) {
        throw e;
      } else {
        throw {
          error: e,
          message:
            'An error occurred when searching for order/s, please try again',
        };
      }
    }
  }

  async update(orderId: string): Promise<IntOrder> {
    try {
      const orderToUpdate = await this.ordersModel
        .findById(orderId)
        .populate({
          path: 'products.product',
          select: 'name description price',
        })
        .populate({
          path: 'user',
          select: 'email',
        });

      if (!orderToUpdate || orderToUpdate.status !== 'placed') {
        throw new NotFound(
          400,
          "Order does not exist or has been completed, please check order's number",
        );
      }

      orderToUpdate.status = 'completed';
      await orderToUpdate.save();
      return orderToUpdate;
    } catch (e) {
      if (e instanceof mongoose.Error.CastError) {
        throw new NotFound(400, 'Order does not exist');
      } else if (e instanceof NotFound) {
        throw e;
      } else {
        throw {
          error: e,
          message:
            'An error occurred when completing the order, please try again.',
        };
      }
    }
  }
}
