import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import path from 'path';
import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { NotFound } from 'errors';

const productsPath = path.resolve(__dirname, '../products.json');

export class ProductsModelFs {
  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      const products = await fsPromises.readFile(productsPath, 'utf-8');
      const productsJSON = JSON.parse(products);
      if (id) return productsJSON.find((item: IntItem) => item.id === id);
      return productsJSON;
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading product.' };
    }
  }

  async save(product: BaseIntItem): Promise<IntItem> {
    try {
      const products = await fsPromises.readFile(productsPath, 'utf-8');
      const productsJSON = JSON.parse(products);
      product.id = uuidv4();
      product.timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
      productsJSON.push(product);
      await fsPromises.writeFile(
        productsPath,
        JSON.stringify(productsJSON, null, '\t'),
      );
      return product as IntItem;
    } catch (e) {
      throw { error: e, message: 'Product could not be saved.' };
    }
  }

  async update(id: string, product: IntItem): Promise<IntItem> {
    try {
      const products = await fsPromises.readFile(productsPath, 'utf-8');
      const productsJSON = JSON.parse(products);

      let productToUpdate = productsJSON.find(
        (item: IntItem) => item.id === id,
      );

      if (productToUpdate) {
        productToUpdate = {
          ...productToUpdate,
          ...product,
        };

        const productToUpdateIndex = productsJSON
          .map((item: IntItem) => item.id)
          .indexOf(id);
        productsJSON.splice(productToUpdateIndex, 1, productToUpdate);

        await fsPromises.writeFile(
          productsPath,
          JSON.stringify(productsJSON, null, '\t'),
        );
        return productToUpdate;
      } else {
        throw new NotFound(404, 'Product to update does not exist.');
      }
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else {
        throw {
          error: e,
          message: 'An error occurred when updating the product.',
        };
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const products = await fsPromises.readFile(productsPath, 'utf-8');
      const productsJSON = JSON.parse(products);

      const productToDelete = productsJSON.find(
        (item: IntItem) => item.id === id,
      );

      if (productToDelete) {
        const newProductList = productsJSON.filter(
          (item: IntItem) => item.id !== id,
        );

        await fsPromises.writeFile(
          productsPath,
          JSON.stringify(newProductList, null, '\t'),
        );
      } else {
        throw new NotFound(404, 'Product to delete does not exist.');
      }
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else {
        throw { error: e, message: 'Product could not be deleted.' };
      }
    }
  }

  async query(options: QueryIntItem): Promise<IntItem[]> {
    const products = await this.get();
    type Conditions = (aProduct: IntItem) => boolean;
    const query: Conditions[] = [];

    if (options.name)
      query.push((aProduct: IntItem) => aProduct.name == options.name);

    if (options.code)
      query.push((aProduct: IntItem) => aProduct.code == options.code);

    if (options.minPrice)
      query.push(
        (aProduct: IntItem) => aProduct.price >= (options.minPrice as number),
      );

    if (options.maxPrice)
      query.push(
        (aProduct: IntItem) => aProduct.price <= (options.maxPrice as number),
      );

    if (options.minStock)
      query.push(
        (aProduct: IntItem) => aProduct.stock >= (options.minStock as number),
      );

    if (options.maxStock)
      query.push(
        (aProduct: IntItem) => aProduct.stock <= (options.maxStock as number),
      );

    return (products as IntItem[]).filter(aProduct =>
      query.every(condition => condition(aProduct)),
    );
  }
}
