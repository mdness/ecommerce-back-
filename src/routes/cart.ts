import express from 'express';
import {
  getCart,
  getCartProduct,
  saveCartProduct,
  editCartProduct,
  deleteCartProduct,
  deleteCartAllProducts,
} from 'controllers/cart';
import asyncHandler from 'express-async-handler';

const cartRouter = express.Router();

cartRouter.get('/', asyncHandler(getCart));
cartRouter.get('/:id', asyncHandler(getCartProduct));
cartRouter.post('/:id', asyncHandler(saveCartProduct));
cartRouter.put('/', asyncHandler(editCartProduct));
cartRouter.delete('/', asyncHandler(deleteCartAllProducts));
cartRouter.delete('/:id', asyncHandler(deleteCartProduct));

export default cartRouter;
