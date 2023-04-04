import { cartAPI } from 'api/cart';
import { productsAPI } from 'api/products';
import { ordersAPI } from 'api/orders';
import { CartIntItem } from 'common/interfaces/cart';
import { IntItem } from 'common/interfaces/products';
import { IntOrder } from 'common/interfaces/orders';
import { Types } from 'mongoose';

// Determines if item (passed as an argument) is empty or not.
// @parameter -> string/number/array/object
// Returns if item (passed as parameter) is empty

export const isEmpty = (item: string | number | unknown): boolean => {
  switch (typeof item) {
    case 'string':
      if (item !== '' && item !== 'null' && item !== 'undefined') {
        return false;
      }
      return true;
    case 'number':
      return false;
    case 'object':
      if (JSON.stringify(item) === '{}' || JSON.stringify(item) === '[]') {
        return true;
      }
      return false;
  }
  return true;
};

/**
 * TS type guard to check if product property from cart products is populated
 * @param obj object of type IntItem or Types.ObjectId
 * @returns boolean
 */
export const isProductPopulated = (
  obj: IntItem | Types.ObjectId,
): obj is IntItem => {
  return (obj as IntItem).name !== undefined;
};

/**
 * Returns a proper response message depending on the user input
 * @param message string, the message sent by the user
 * @param userId string, id of the user who sent the message
 * @returns string
 */
export const getSystemResponse = async (
  message: string,
  userId: string,
): Promise<string> => {
  switch (message.toLowerCase()) {
    case 'stock': {
      const products = (await productsAPI.get()) as IntItem[];
      const stock = products.reduce(
        (stock: Record<string, unknown>, item: IntItem) => {
          return {
            ...stock,
            [item.name]: item.stock,
          };
        },
        {},
      );

      let message = '';

      Object.entries(stock).forEach(item => {
        message += `- ${item[0]}: ${item[1]}.$nl`;
      });

      return message;
    }

    case 'order': {
      const orders = (await ordersAPI.get(userId)) as IntOrder[];
      let message = '';
      if (isEmpty(orders)) {
        message = 'You do not have pending orders';
      } else {
        const lastOrder = orders[orders.length - 1];
        message = `Your order wit ID: ${lastOrder.id} is ${
          lastOrder.status === 'placed' ? 'being placed' : 'completed'
        } and ${
          lastOrder.status === 'placed' ? 'will be delivered' : 'was shipped'
        } to ${lastOrder.shippingAddress}. Products included in order: $nl`;
        lastOrder.products.map(item => {
          if (isProductPopulated(item.product))
            message += `- Quantity: ${item.quantity}, Product: ${item.product.name}, Price: $${item.product.price} c/u.$nl`;
        });
        message += `Total: $${lastOrder.total}.$nl`;
      }
      return message;
    }

    case 'cart': {
      const cart = (await cartAPI.get(userId)) as CartIntItem[];
      let message = '';

      if (cart.length === 0) {
        message = 'Your cart is empty.';
      } else {
        const total = cart.reduce((total, item) => {
          if (isProductPopulated(item.product))
            return (total += item.product.price * item.quantity);
          else return total;
        }, 0);

        cart.forEach(item => {
          if (isProductPopulated(item.product))
            message += `- Quantity: ${item.quantity}, Product: ${item.product.name}, Price: $${item.product.price} c/u.$nl`;
        });

        message += `Total: $${total.toFixed(2)}.`;
      }

      return message;
    }
    default:
      return `
        Welcome! In order to help you, pleas select one of the following options:$nl
          - Stock: Gives you our actual item's stock.$nl
          - Order: Gives you information about your las order.$nl
          - Cart: Gives you information and cart's status.$nl
      `;
  }
};
