import deleteCartProduct from './deleteCartProduct';
import deleteCartProducts from './deleteCartProducts';
import getCartProduct from './getCartProduct';
import getCartProducts from './getCartProducts';
import saveCartProduct from './saveCartProduct';
import updateCartProduct from './updateCartProduct';

export default {
  '/api/cart': {
    ...getCartProducts,
    ...updateCartProduct,
    ...deleteCartProducts,
  },
  '/api/cart/{id}': {
    ...getCartProduct,
    ...saveCartProduct,
    ...deleteCartProduct,
  },
};
