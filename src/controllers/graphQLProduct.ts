import { productsAPI } from 'api/products';
import { IntItem, BaseIntItem } from 'common/interfaces/products';
import { NotFound } from 'errors';
import { isValidProduct } from 'utils/validations';

export const getProducts = async (): Promise<IntItem | IntItem[]> => {
  const products = await productsAPI.get();
  if (products.length !== 0) return products;
  else throw new NotFound(404, 'No products');
};

export const getProduct = async (args: { id: string }): Promise<IntItem> => {
  const product = await productsAPI.get(args.id);
  if (product) return product as IntItem;
  else throw new NotFound(404, 'Product not found');
};

export const saveProduct = async (args: {
  product: BaseIntItem;
}): Promise<IntItem> => {
  const product = args.product;

  product.price = Number(product.price);
  product.stock = Number(product.stock);
  isValidProduct(product);

  const newProduct: IntItem = await productsAPI.save(product);
  return newProduct;
};

export const updateProduct = async (args: {
  id: string;
  product: IntItem;
}): Promise<IntItem> => {
  console.log(args);
  const dataToUpdate = args.product;

  dataToUpdate.price = Number(dataToUpdate.price);
  dataToUpdate.stock = Number(dataToUpdate.stock);

  isValidProduct(dataToUpdate);

  const product = await productsAPI.update(args.id, dataToUpdate);
  return product;
};

export const deleteProduct = async (args: { id: string }): Promise<string> => {
  await productsAPI.delete(args.id);
  return 'Product deleted';
};
