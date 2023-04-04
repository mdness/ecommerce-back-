import { UserValidation } from 'errors';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { photoUpload } from '/utils/multerImg';

/**
 * Middleware for Multer image upload (now replaced for Express-fileupload)
 * @param req express request
 * @param res express response
 * @param next express next function
 */

export const imageUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  photoUpload(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      next(new UserValidation(400, 'Image size must be at least 1mb'));
    } else if (err instanceof UserValidation) {
      next(err);
    } else if (err) {
      next(
        new UserValidation(
          500,
          'An error occurred when saving image, please try again',
        ),
      );
    } else {
      next();
    }
  });
};
