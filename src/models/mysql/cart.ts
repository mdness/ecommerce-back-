import knex, { Knex } from 'knex';
import { IntItem } from 'common/interfaces/products';
import { IntKnex } from 'common/interfaces/others';
import { NotFound } from 'errors';
import dbConfig from './../../../knexFile';
import { logger } from 'services/logger';

export class CartModelMySQL {
  private connection: Knex;

  constructor(dbType: 'mysql' | 'sqlite') {
    const environment =
      dbType === 'mysql'
        ? process.env.NODE_ENV || 'development'
        : 'development2';
    const configDB: IntKnex = dbConfig;
    const options = configDB[environment];
    this.connection = knex(options);
    logger.info(`MySQL DB ${environment} set up successfully`);
    this.connection.schema.hasTable('cart').then(exists => {
      if (!exists) {
        this.connection.schema
          .createTable('cart', cartTable => {
            cartTable.increments();
            cartTable.string('name').notNullable();
            cartTable.string('description').notNullable();
            cartTable.string('code').notNullable();
            cartTable.decimal('price', 5, 2).notNullable();
            cartTable.string('photo').notNullable();
            cartTable
              .timestamp('timestamp')
              .defaultTo(this.connection.fn.now());
            cartTable.integer('stock').notNullable();
          })
          .then(() => {
            logger.info('Cart Table created successfully');
          })
          .catch(e => logger.error(e));
      }
    });
  }

  async get(id?: string): Promise<IntItem | IntItem[]> {
    try {
      if (id) {
        const product = await this.connection('cart').where('id', Number(id));
        return product[0];
      }
      return this.connection('cart');
    } catch (e) {
      throw { error: e, message: 'An error occurred when loading products.' };
    }
  }

  async save(id: string): Promise<IntItem> {
    try {
      const productToAdd = await this.connection('products').where(
        'id',
        Number(id),
      );
      if (productToAdd.length) {
        const addedProductID = await this.connection('cart').insert(
          productToAdd[0],
        );
        const newProductAdded = await this.get(
          addedProductID[0] as unknown as string,
        );
        return newProductAdded as unknown as IntItem;
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
      const deletedProduct = await this.connection('cart')
        .where('id', Number(id))
        .del();
      if (!deletedProduct) {
        throw new NotFound(404, 'Product to delete does not exist on cart.');
      } else {
        const productsInCart = await this.get();
        return productsInCart as IntItem[];
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
