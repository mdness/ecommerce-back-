import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { NotFound } from 'errors';
import { productsMemoryMock } from 'mocks/products-memory';
import { IntModel } from 'models/factory/products';
import { productDTO } from 'dto/products';

let products = productsMemoryMock;

export class ProductsModel implements IntModel {
  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      if (id)
        return products.find((item: IntItem) => item.id === id) as IntItem;
      return products;
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products.' };
    }
  }

  async save(product: BaseIntItem): Promise<IntItem> {
    try {
      const newProduct = productDTO(product as IntItem);
      products.push(newProduct);
      return newProduct;
    } catch (e) {
      throw { error: e, message: 'Product could not be saved.' };
    }
  }

  async update(id: string, product: IntItem): Promise<IntItem> {
    try {
      let productToUpdate = products.find((item: IntItem) => item.id === id);

      if (productToUpdate) {
        productToUpdate = {
          ...productToUpdate,
          ...product,
        };

        const productToUpdateIndex = products
          .map((item: IntItem) => item.id)
          .indexOf(id);
        products.splice(productToUpdateIndex, 1, productToUpdate);

        return productToUpdate;
      } else {
        throw new NotFound(404, 'Product to update does not exist.');
      }
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else {
        throw { error: e, message: 'Product could not be updated' };
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const productToDelete = products.find((item: IntItem) => item.id === id);

      if (productToDelete) {
        const newProductList = products.filter(
          (item: IntItem) => item.id !== id,
        );
        products = newProductList;
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
