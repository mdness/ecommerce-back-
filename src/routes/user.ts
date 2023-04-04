import asyncHandler from 'express-async-handler';
import { Router } from 'express';
import { isAdmin } from 'middlewares/checkAdmin';
import { isLoggedIn } from 'middlewares/auth';
import {
  getUser,
  getUsers,
  getLoggedInUserData,
  addUser,
} from 'controllers/users';

const userRouter = Router();

userRouter.get('/', isLoggedIn, isAdmin, asyncHandler(getUsers));
userRouter.get('/:id', isLoggedIn, isAdmin, asyncHandler(getUser));
userRouter.get('/loggedUser/data', asyncHandler(getLoggedInUserData));
userRouter.post('/signup', asyncHandler(addUser));

export default userRouter;
