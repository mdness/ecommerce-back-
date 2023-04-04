import { IntItem, BaseIntItem, QueryIntItem } from 'common/interfaces/products';
import { ModelType } from 'common/enums';
import { ProductsModel } from 'models/memory/product';
import { ProductsModelFs } from 'models/fs/product';
import { ProductsModelFirebase } from 'models/firebase/product';
import { ProductsModelMongoDB } from 'models/mongodb/product';
import { ProductsModelMySQL } from 'models/mysql/product';

export interface IntModel {
  get: (id?: string) => Promise<IntItem | IntItem[]>;
  getByCategory?: (category: string) => Promise<IntItem[]>;
  save: (product: BaseIntItem) => Promise<IntItem>;
  update: (id: string, product: IntItem) => Promise<IntItem>;
  delete: (id: string) => Promise<void>;
  query: (options: QueryIntItem) => Promise<IntItem | IntItem[]>;
}

export class ProductsModelFactory {
  private static instance: IntModel;
  private static value: number;
  static model(type: number): IntModel {
    switch (type) {
      case ModelType.fs:
        if (!this.instance) this.instance = new ProductsModelFs();
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
      case ModelType.mySql:
        if (!this.instance) this.instance = new ProductsModelMySQL('mysql');
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
      case ModelType.sqlite:
        if (!this.instance)
          this.instance = this.instance = new ProductsModelMySQL('sqlite');
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
      case ModelType.localMongo:
      case ModelType.mongoAtlas:
        if (!this.instance)
          this.instance = this.instance = new ProductsModelMongoDB();
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
      case ModelType.firebase:
        if (!this.instance)
          this.instance = this.instance = new ProductsModelFirebase();
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
      default:
        if (!this.instance) this.instance = this.instance = new ProductsModel();
        if (!this.value) this.value = Math.random();
        console.log(this.value);
        return this.instance;
    }
  }
}
ProductsModelFactory.model(ModelType.mongoAtlas);
ProductsModelFactory.model(ModelType.memory);
