import { IntItem } from 'common/interfaces/products';
import admin from 'firebase-admin';
import { NotFound } from 'errors';

export class CartModelFirebase {
  public cartDb;
  public productsDb;
  constructor() {
    const db = admin.firestore();
    console.log('Firebase DB set up successfully');
    this.cartDb = db.collection('cart');
    this.productsDb = db.collection('products');
  }

  async get(id?: string): Promise<IntItem[] | IntItem> {
    try {
      let output: IntItem[] | IntItem = [];
      if (id) {
        const data = await this.cartDb.doc(id).get();
        const product = data.data();
        if (product) {
          output = {
            id: data.id,
            ...product,
          } as IntItem;
        } else {
          return output[0];
        }
      } else {
        const result = await this.cartDb.get();
        const products = result.docs;
        output = products.map(product => {
          const productData = product.data();
          return {
            id: product.id,
            ...productData,
          };
        }) as IntItem[];
      }
      return output;
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products.' };
    }
  }

  async save(id: string): Promise<IntItem> {
    try {
      const productToAddData = await this.productsDb.doc(id).get();
      const addedProduct = productToAddData.data();
      if (addedProduct) {
        await this.cartDb.doc(id).set({
          ...addedProduct,
        });
        return {
          id,
          ...addedProduct,
        } as IntItem;
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
      const productToDelete = await this.get(id);
      if (productToDelete) {
        await this.cartDb.doc(id).delete();
        const productsInCart = await this.get();
        return productsInCart as IntItem[];
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
