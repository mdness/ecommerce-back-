import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAdmin } from 'middlewares/checkAdmin';
import {
  createOrder,
  getOrder,
  getOrders,
  completeOrder,
} from 'controllers/orders';

const ordersRouter = express.Router();

ordersRouter.get('/', asyncHandler(getOrders));
ordersRouter.get('/:id', asyncHandler(getOrder));
ordersRouter.post('/', asyncHandler(createOrder));
ordersRouter.put('/complete', isAdmin, asyncHandler(completeOrder));

export default ordersRouter;
