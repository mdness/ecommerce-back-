import { productsMock } from 'mocks/products';
import { ProductsModel } from 'models/mongodb/product';
import { logger } from 'services/logger';

export const addProductsMockDb = async (): Promise<void> => {
  await ProductsModel.insertMany(productsMock);
  logger.info('Products added');
};
