import { Request, Response, NextFunction } from 'express';
import { userAPI } from 'api/user';
import { NotFound, UserExists, UserNotLoggedIn } from 'errors';
import { isEmpty } from 'utils/others';
import passport from 'middlewares/auth';
import { logger } from 'services/logger';

interface User {
  email: string;
  name: string;
  address: string;
  postalCode: string;
  number: string;
  apartment: string;
  age: number;
  telephone: string;
  photo: string;
  admin: boolean;
  photoId: string;
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const data = await userAPI.getUsers();
  if (!isEmpty(data)) res.json({ data });
  else throw new NotFound(404, 'No registered users existing.');
};

export const getLoggedInUserData = (req: Request, res: Response): void => {
  if (req.isAuthenticated()) {
    const {
      email,
      name,
      address,
      postalCode,
      number,
      apartment,
      age,
      telephone,
      photo,
      photoId,
      admin,
    } = req.user as User;
    const userData = {
      email,
      name,
      address,
      postalCode,
      number,
      apartment,
      age,
      telephone,
      photo,
      photoId,
      admin,
    };
    res.json({ data: userData });
  } else {
    throw new UserNotLoggedIn(404, 'User not logged-in');
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const data = await userAPI.getUsers(req.params.id);

  res.json({ data });
};

export const addUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate('signup', function (err, user, info) {
    if (err) {
      logger.warn('An error occurred when registering user');
      return next(err);
    }
    if (!user) {
      throw new UserExists(400, info.message);
    }
    res
      .location(`/api/users/${user.id}`)
      .status(201)
      .json({ message: 'Login successful' });
  })(req, res, next);
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ msg: 'UPDATE USER' });
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ msg: 'DELETE USER' });
};
