import { isEmail, isValidCode } from './regEx';
import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { BaseIntUser } from 'common/interfaces/users';
import { getEmptyFields } from 'utils/objects';
import {
  MissingFieldsProduct,
  MissingFieldsUser,
  ProductValidation,
  UserValidation,
} from 'errors';

// @parameter -> product item
// Check if product contains any invalid getEmptyFields. If having,
// returns proper error

export const isValidProduct = (
  product: IntItem | BaseIntItem,
): boolean | Error => {
  const emptyFields = getEmptyFields(product);

  if (emptyFields.length !== 0) {
    throw new MissingFieldsProduct(
      400,
      'All fields are required, except from "Stock"',
      `Missing fields: ${emptyFields.join(', ')}`,
    );
  }

  if (product.price === 0 || isNaN(product.price)) {
    throw new ProductValidation(
      400,
      'Please check data, price must be a non-zero number.',
    );
  }

  if (!isValidCode(product.code)) {
    throw new ProductValidation(400, 'Please check data, code must be valid.');
  }

  if (isNaN(product.stock)) {
    throw new ProductValidation(
      400,
      'Please check data, stock must be a number.',
    );
  }

  return true;
};

//  @param user user data to sign up
//  @returns checks if the user data has empty fields or if 'age' is not a number, if so throws a proper error
//

export const isValidUser = (user: BaseIntUser): boolean | Error => {
  const emptyFields = getEmptyFields(user);

  if (emptyFields.length !== 0) {
    throw new MissingFieldsUser(
      400,
      'All fields are required',
      `The following fields are missing: ${emptyFields.join(', ')}`,
    );
  }

  if (!isEmail(user.email)) {
    throw new UserValidation(400, 'Email is invalid, please check data');
  }

  if (user.password !== user.repeatPassword) {
    throw new UserValidation(400, `Passwords don't match. Please check data`);
  }

  if (isNaN(user.age) || user.age === 0) {
    throw new UserValidation(
      400,
      'Please check data, age must be a non-zero number.',
    );
  }

  return true;
};

export const isQueryValid = (query: QueryIntItem): boolean | Error => {
  const queryMap = ['minPrice', 'maxPrice', 'minStock', 'maxStock'];

  for (const queryField of queryMap) {
    if (query[queryField] !== undefined && isNaN(Number(query[queryField]))) {
      throw new ProductValidation(
        400,
        'Price/minStock/maxStock must be numbers',
      );
    }
  }

  return true;
};

// export const signUpValidation = (data: BaseIntUser): Joi.ValidationResult => {
//   const schema = Joi.object({
//     email: Joi.string()
//       .pattern(new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/))
//       .required()
//       .messages({
//         'string.pattern.base': `Email is invalid`,
//         'string.empty': `All fields are required, please enter a valid email.`,
//       }),
//     password: Joi.string()
//       .pattern(
//         new RegExp(
//           /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
//         ),
//       )
//       .required()
//       .messages({
//         'string.pattern.base': `Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number and 1 special character.`,
//         'string.empty': `All fields are required, please enter a valid password`,
//       }),
//     repeatPassword: Joi.string()
//       .required()
//       .valid(Joi.ref('password'))
//       .messages({
//         'string.empty': `All fields are required, please confirm your password`,
//         'any.only': `Passwords don't match`,
//       }),
//     name: Joi.string().required().messages({
//       'string.empty': `All fields are required, please enter a valid name`,
//     }),
//     address: Joi.string().required().messages({
//       'string.empty': `All fields are required, please enter a valid address`,
//     }),
//     age: Joi.number().integer().positive().required().messages({
//       'number.base': `Age must be a number`,
//       'number.integer': `Age must be an integer`,
//       'number.positive': `Age is required, and must be a non-zero number`,
//     }),
//     telephone: Joi.string().required().messages({
//       'string.empty': `All fields are required, please enter a valid phone number`,
//     }),
//     photo: Joi.string().required().messages({
//       'string.empty': `All fields are required, please enter a valid photo`,
//     }),
//   });

//   return schema.validate(data);
// };
