import getOrders from './getOrders';
import getOrder from './getOrder';
import createOrder from './createOrder';
import completeOrder from './completedOrder';

export default {
  '/api/orders': {
    ...getOrders,
    ...createOrder,
  },
  '/api/orders/{id}': {
    ...getOrder,
  },
  '/api/orders/complete': {
    ...completeOrder,
  },
};
