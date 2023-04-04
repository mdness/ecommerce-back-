import knex, { Knex } from 'knex';
import { IntKnex } from 'common/interfaces/others';
import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { NotFound } from 'errors';
import dbConfig from './../../../knexFile';
import { productsMock } from 'mocks/products';
import { logger } from 'services/logger';

export class ProductsModelMySQL {
  private connection: Knex;
  constructor(dbType: 'mysql' | 'sqlite') {
    const environment =
      dbType === 'mysql'
        ? process.env.NODE_ENV || 'development'
        : 'development2';
    const configDb: IntKnex = dbConfig;
    const options = configDb[environment];
    this.connection = knex(options);
    logger.info(`MySQL DB ${environment} set up.`);
    this.connection.schema.hasTable('products').then(exists => {
      if (!exists) {
        this.connection.schema
          .createTable('products', productsTable => {
            productsTable.increments();
            productsTable.string('name').notNullable();
            productsTable.string('description').notNullable();
            productsTable.string('code').notNullable();
            productsTable.decimal('price', 5, 2).notNullable();
            productsTable.string('photo').notNullable();
            productsTable
              .timestamp('timestamp')
              .defaultTo(this.connection.fn.now());
            productsTable.integer('stock').notNullable();
          })
          .then(() => {
            logger.info("Product's Table has been created.");
            this.connection('products')
              .insert(productsMock)
              .then(() => logger.info('Products added.'))
              .catch(e => logger.error(e));
          })
          .catch(e => logger.error(e));
      }
    });
  }

  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      if (id) {
        const product = await this.connection('products').where(
          'id',
          Number(id),
        );
        return product[0];
      }
      return this.connection('products');
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products' };
    }
  }

  async save(product: BaseIntItem): Promise<IntItem> {
    try {
      const newProductID = await this.connection('products').insert(product);
      const newProduct = this.get(newProductID[0] as unknown as string);
      return newProduct as unknown as IntItem;
    } catch (e) {
      throw { error: e, message: 'Product could not be saved.' };
    }
  }

  async update(id: string, product: IntItem): Promise<IntItem> {
    try {
      await this.connection('products').where('id', Number(id)).update(product);
      const updatedProduct = await this.get(id);
      if (updatedProduct) {
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
      const deletedProduct = await this.connection('products')
        .where('id', Number(id))
        .del();
      if (!deletedProduct) {
        throw new NotFound(404, 'Product to update does not exist.');
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
    try {
      const products = await this.connection('products')
        .modify(queryBuilder => {
          if (options.name) {
            queryBuilder.where('name', options.name);
          }
        })
        .modify(queryBuilder => {
          if (options.code) {
            queryBuilder.where('code', options.code);
          }
        })
        .modify(queryBuilder => {
          if (options.minPrice) {
            queryBuilder.where('price', '>=', options.minPrice);
          }
        })
        .modify(queryBuilder => {
          if (options.maxPrice) {
            queryBuilder.where('price', '<=', options.maxPrice);
          }
        })
        .modify(queryBuilder => {
          if (options.minStock) {
            queryBuilder.where('stock', '>=', options.minStock);
          }
        })
        .modify(queryBuilder => {
          if (options.maxStock) {
            queryBuilder.where('stock', '<=', options.maxStock);
          }
        });

      return products;
    } catch (e) {
      throw { error: e, message: 'An error occurred during the search.' };
    }
  }
}
