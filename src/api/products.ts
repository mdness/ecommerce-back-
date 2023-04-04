import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { ProductsModelFactory } from 'models/factory/products';
import { modelTypeToUse } from './modelType';

class ProductsAPI {
  private factory;

  constructor() {
    this.factory = ProductsModelFactory.model(modelTypeToUse);
  }

  get(id?: string) {
    if (id) return this.factory.get(id);
    return this.factory.get();
  }

  getByCategory(category: string) {
    if (this.factory.getByCategory) return this.factory.getByCategory(category);
    else return undefined;
  }

  async save(product: BaseIntItem) {
    const newProduct = await this.factory.save(product);
    return newProduct;
  }

  async update(id: string, product: IntItem) {
    const updatedProduct = await this.factory.update(id, product);
    return updatedProduct;
  }

  async delete(id: string) {
    await this.factory.delete(id);
  }

  async query(options: QueryIntItem) {
    return this.factory.query(options);
  }
}

export const productsAPI = new ProductsAPI();
