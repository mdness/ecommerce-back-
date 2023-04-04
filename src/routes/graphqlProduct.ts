import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import {
  getProduct,
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from 'controllers/graphQLProduct';
import { IntItem, BaseIntItem } from 'common/interfaces/products';

const rootResolver = {
  getProducts,
  getProduct: (id: string) => getProduct(id as unknown as { id: string }),
  saveProduct: (product: BaseIntItem) =>
    saveProduct(product as unknown as { product: BaseIntItem }),
  updateProduct: (data: { id: string; product: IntItem }) =>
    updateProduct(data),
  deleteProduct: (id: string) => deleteProduct(id as unknown as { id: string }),
};

const graphqlSchema = buildSchema(`
  type Query {
    getProducts: [Item]
    getProduct(id: String!): Item
  }
  type Mutation {
    saveProduct(product: ItemBase!): Item
    updateProduct(id: String!, product: ItemUpdate!): Item
    deleteProduct(id: String!): String!
  }
  input ItemBase {
    name: String!
    description: String!
    code: String!
    price: String!
    photo: String!
    stock: String!
  }
  input ItemUpdate {
    _id: String
    name: String
    description: String
    code: String
    price: String
    photo: String
    stock: String
    timestamp: String
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

export const productRouterGraphQL = graphqlHTTP({
  schema: graphqlSchema,
  rootValue: rootResolver,
  graphiql: true,
});
