import { Request, Response, NextFunction } from 'express';
import { UnauthorizedRoute } from 'errors';

interface User {
  admin: boolean;
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { admin } = req.user as User;
  if (req.user && admin) {
    next();
  } else {
    throw new UnauthorizedRoute(
      401,
      'You do not have permission to perform this action.',
      `Route ${req.originalUrl} method ${req.method} unauthorized.`,
    );
  }
};
