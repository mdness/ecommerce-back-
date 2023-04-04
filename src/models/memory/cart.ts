import { IntItem } from 'common/interfaces/products';
import { NotFound } from 'errors';
import { ProductsModel } from './product';

export class CartModel {
  private cart;
  constructor() {
    this.cart = [] as IntItem[];
  }

  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      if (id)
        return this.cart.find((item: IntItem) => item.id === id) as IntItem;
      return this.cart;
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products.' };
    }
  }

  async save(id: string): Promise<IntItem> {
    try {
      const productsModel = new ProductsModel();
      const allProducts = await productsModel.get();
      const productToAdd = (allProducts as IntItem[]).find(
        (item: IntItem) => item.id === id,
      );

      if (productToAdd) {
        this.cart.push(productToAdd);
        return productToAdd;
      } else {
        throw new NotFound(404, 'Product to add does not exist.');
      }
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else {
        throw { error: e, message: 'Product could not be saved.' };
      }
    }
  }

  async delete(id: string): Promise<IntItem[]> {
    try {
      const productToDelete = this.cart.find((item: IntItem) => item.id === id);

      if (productToDelete) {
        const productToDeleteIndex = this.cart
          .map((item: IntItem) => item.id)
          .indexOf(id);
        this.cart.splice(productToDeleteIndex, 1);
        return this.cart;
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
}
