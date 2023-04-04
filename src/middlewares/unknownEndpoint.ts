import { Request, Response } from 'express';
import { EnumErrorCodes } from 'common/enums';

export const unknownEndpoint = (req: Request, res: Response): void => {
  res.status(404).send({
    error: `-${EnumErrorCodes.UnknownEndpoint}`,
    description: `Route ${req.originalUrl} with method ${req.method} could not be executed`,
  });
};
