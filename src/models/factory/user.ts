import { ModelType } from 'common/enums';
import { IntUser, BaseIntUser } from 'common/interfaces/users';
import { UserModelMongoDb } from 'models/mongodb/user';

interface IntModel {
  get: (id?: string) => Promise<IntUser | IntUser[]>;
  save: (userData: BaseIntUser) => Promise<IntUser>;
  update: (id: string, userData: BaseIntUser) => Promise<IntUser | null>;
  delete: (id: string) => Promise<void>;
  query: (email: string) => Promise<IntUser>;
}

export class UserModelFactory {
  static model(type: number): IntModel {
    switch (type) {
      case ModelType.localMongo:
      case ModelType.mongoAtlas:
        return new UserModelMongoDb();
      default:
        return new UserModelMongoDb();
    }
  }
}
