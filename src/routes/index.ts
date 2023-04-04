import express from 'express';
import productRouter from './product';
import cartRouter from './cart';
import loginRouter from './login';
import userRouter from './user';
import ordersRouter from './orders';
import chatRouter from './messages';
import infoRouter from './info';
import { isLoggedIn } from 'middlewares/auth';
import { productRouterGraphQL } from './graphqlProduct';

const Router = express.Router();

Router.use('/auth', loginRouter);
Router.use('/users', userRouter);
Router.use('/products', productRouter);
Router.use('/products-graphql', productRouterGraphQL);
Router.use('/cart', isLoggedIn, cartRouter);
Router.use('/orders', isLoggedIn, ordersRouter);
Router.use('/chat', isLoggedIn, chatRouter);
Router.use('/info', infoRouter);

export default Router;
