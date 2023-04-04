import express from 'express';
import { isAdmin } from 'middlewares/checkAdmin';
import {
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
  saveProduct,
  updateProduct,
} from 'controllers/product';
import asyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get('/', asyncHandler(getProducts));
productRouter.get('/:id', asyncHandler(getProduct));
productRouter.get('/category/:category', asyncHandler(getProductsByCategory));
productRouter.post('/', isAdmin, asyncHandler(saveProduct));
productRouter.put('/:id', isAdmin, asyncHandler(updateProduct));
productRouter.delete('/:id', isAdmin, asyncHandler(deleteProduct));

export default productRouter;
