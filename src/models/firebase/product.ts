import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import admin, { firestore } from 'firebase-admin';
import { NotFound } from 'errors';
import { productsMock } from 'mocks/products';
import moment from 'moment';
import Config from 'config';
import { logger } from 'services/logger';

export class ProductsModelFirebase {
  public productsDb;
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: Config.FIREBASE_PROJECTID,
        privateKey: Config.FIREBASE_PRIVATEKEY,
        clientEmail: Config.FIREBASE_CLIENT_EMAIL,
      }),
    });
    const db = admin.firestore();
    logger.info('Firebase DB set up successfully');
    this.productsDb = db.collection('products');
    this.get()
      .then(products => {
        if (products.length === 0) {
          const batch = db.batch();
          (productsMock as IntItem[]).map(product => {
            product.timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
            const docRef = this.productsDb.doc();
            batch.set(docRef, product);
          });
          batch
            .commit()
            .then(() => logger.info('Products added successfully.'));
        }
      })
      .catch(e => logger.error(e));
  }

  async get(id?: string): Promise<IntItem[] | IntItem> {
    try {
      let output: IntItem[] | IntItem = [];
      if (id) {
        const data = await this.productsDb.doc(id).get();
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
        const result = await this.productsDb.get();
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

  async save(data: BaseIntItem): Promise<IntItem> {
    try {
      data.timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
      const productDocumentRef = await this.productsDb.add({
        ...data,
      });
      const createdProductId = productDocumentRef.id;
      const createdProduct = await this.get(createdProductId);
      return createdProduct as IntItem;
    } catch (e) {
      throw { error: e, message: 'Product could not be saved.' };
    }
  }

  async update(id: string, product: IntItem): Promise<IntItem> {
    try {
      const productToUpdate = await this.get(id);
      if (productToUpdate) {
        await this.productsDb.doc(id).update(product);
        const updatedProduct = await this.get(id);
        return updatedProduct as IntItem;
      } else {
        throw new NotFound(404, 'Product to update does not exist.');
      }
    } catch (e) {
      if (e instanceof NotFound) {
        throw e;
      } else {
        throw { error: e, message: 'Product could not be updated.' };
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const productToDelete = await this.get(id);
      if (productToDelete) {
        await this.productsDb.doc(id).delete();
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
    let query: firestore.Query<firestore.DocumentData> = this.productsDb;
    let products: IntItem[] = [];

    try {
      if (options.name) {
        query = query.where('name', '==', options.name);
      }
      if (options.code) {
        query = query.where('code', '==', options.code);
      }
      if (
        (options.minPrice || options.maxPrice) &&
        (options.minStock || options.maxStock)
      ) {
        if (options.minPrice) {
          query = query.where('price', '==', options.minPrice);
        }
        if (options.maxPrice) {
          query = query.where('price', '==', options.maxPrice);
        }
        const productsSnapshot = await query.get();
        productsSnapshot.forEach(doc => {
          const id = doc.id;
          const data = doc.data();
          const product = {
            id,
            ...data,
          };
          products.push(product as IntItem);
        });

        if (options.minStock) {
          products = products.filter(
            product => product.stock >= (options.minStock as number),
          );
        }
        if (options.maxStock) {
          products = products.filter(
            product => product.stock <= (options.maxStock as number),
          );
        }
      } else {
        if (options.minPrice) {
          query = query.where('price', '>=', options.minPrice);
        }
        if (options.maxPrice) {
          query = query.where('price', '<=', options.maxPrice);
        }
        if (options.minStock) {
          query = query.where('stock', '>=', options.minStock);
        }
        if (options.maxStock) {
          query = query.where('stock', '<=', options.maxStock);
        }

        const productsSnapshot = await query.get();
        productsSnapshot.forEach(doc => {
          const id = doc.id;
          const data = doc.data;
          const product = {
            id,
            ...data,
          };
          products.push(product as IntItem);
        });
      }

      return products;
    } catch (e) {
      throw { error: e, message: 'An error occurred during the search.' };
    }
  }
}
