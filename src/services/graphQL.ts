import { buildSchema } from 'graphql';
import {
  getProducts,
  getProduct,
  saveProduct,
} from 'controllers/graphQLProduct';

export const graphqlSchema = buildSchema(`
  type Query {
    getProducts: [Item]
    getProduct(id: String!): Item
  }
  type Mutation {
    saveProduct(product: ItemBase!): Item
  }
  input ItemBase {
    name: String!
    description: String!
    code: String!
    price: String!
    photo: String!
    stock: String!
  }
  type Item {
    _id: String
    name: String
    description: String
    code: String
    price: String
    photo: String
    stock: String
    timestamp: String
  }
`);

export const graphqlRoot = {
  getProducts,
  getProduct,
  saveProduct,
};
