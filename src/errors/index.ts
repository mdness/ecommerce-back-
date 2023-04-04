import { EnumErrorCodes } from 'common/enums';

export class BaseError extends Error {
  public name;
  public statusCode;
  public message;
  constructor(statusCode: number, message: string) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this);
  }
}

export class NotImplemented extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.NotImplemented}`;
  }
}
export class ProductValidation extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.ProductValidation}`;
  }
}

export class MissingFieldsProduct extends ProductValidation {
  public description;
  constructor(statusCode: number, message: string, description: string) {
    super(statusCode, message);
    this.description = description;
  }
}

export class NotFound extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.ProductNotFound}`;
  }
}

export class UnauthorizedRoute extends BaseError {
  public error: string;
  public description: string;
  constructor(statusCode: number, message: string, description?: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.UnauthRoute}`;
    this.description =
      description || "You don't have permission to perform this action";
  }
}

export class UserValidation extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.UserSignUpValidation}`;
  }
}

export class MissingFieldsUser extends UserValidation {
  public description;
  constructor(statusCode: number, message: string, description: string) {
    super(statusCode, message);
    this.description = description;
  }
}

export class UserNotExists extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.UserDoesNotExist}`;
  }
}

export class UserExists extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.UserAlreadyExists}`;
  }
}

export class UserNotLoggedIn extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.UserNotLoggedIn}`;
  }
}

export class CartIsEmpty extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.CartEmpty}`;
  }
}

export class OrderError extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.OrderError}`;
  }
}

export class FileValidation extends BaseError {
  public error: string;
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.error = `-${EnumErrorCodes.FileValidation}`;
  }
}
