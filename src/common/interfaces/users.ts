import Joi from 'joi';
import { IntObject } from './others';

export interface BaseIntUser extends IntObject {
  email: string;
  password: string;
  repeatPassword: string;
  admin?: boolean;
  name: string;
  address: string;
  postalCode: string;
  apartment?: string;
  age: number;
  telephone: string;
  photo: string;
  photoId: string;
}

export interface IntUser extends BaseIntUser {
  id: string;
  isValidPassword: (password: string) => Promise<boolean>;
}

export const userJoiSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/))
    .required()
    .messages({
      'string.pattern.base': `Email is invalid`,
      'string.empty': `All fields are required, please enter a valid email.`,
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      ),
    )
    .required()
    .messages({
      'string.pattern.base': `Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number and 1 special character (#?!@$ %^&*-).`,
      'string.empty': `All fields are required, please enter a valid password`,
    }),
  repeatPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': `Please confirm your password`,
    'any.only': `Passwords don't match`,
  }),
  admin: Joi.boolean().default(false),
  name: Joi.string().required().messages({
    'string.empty': `Please enter a valid name`,
  }),
  address: Joi.string().required().messages({
    'string.empty': `Please enter a valid address`,
  }),
  postalCode: Joi.string().required().messages({
    'string.empty': `Please insert your postal/ZIP code`,
  }),
  number: Joi.string().allow(''),
  apartment: Joi.string().allow(''),
  age: Joi.number().integer().positive().required().messages({
    'number.base': `Age must be a number`,
    'number.integer': `Age must be an integer`,
    'number.positive': `Age is required, and must be a non-zero number`,
  }),
  telephone: Joi.string().required().messages({
    'string.empty': `Please enter a valid phone number`,
  }),
});
