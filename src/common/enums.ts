export enum EnumErrorCodes {
  UnauthRoute = 1,
  UnknownEndpoint,
  ProductValidation,
  ProductNotFound,
  NotImplemented,
  UserSignUpValidation,
  UserAlreadyExists,
  UserDoesNotExist,
  UserNotLoggedIn,
  CartEmpty,
  OrderError,
  FileValidation,
}

export enum ModelType {
  memory,
  fs,
  mySql,
  sqlite,
  localMongo,
  mongoAtlas,
  firebase,
}
