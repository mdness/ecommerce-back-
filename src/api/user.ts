import { BaseIntUser, IntUser } from 'common/interfaces/users';
import { UserModelFactory } from 'models/factory/user';
import { cartAPI } from './cart';
import { modelTypeToUse } from './modelType';

class UserAPI {
  private factory;

  constructor() {
    this.factory = UserModelFactory.model(modelTypeToUse);
  }

  async getUsers(id?: string): Promise<IntUser[] | IntUser> {
    if (id) return this.factory.get(id);
    return this.factory.get();
  }

  async addUser(userData: BaseIntUser): Promise<IntUser> {
    const newUser = await this.factory.save(userData);
    await cartAPI.createCart(newUser.id);
    return newUser;
  }

  async updateUser(id: string, userData: BaseIntUser) {
    const updatedUser = await this.factory.update(id, userData);
    return updatedUser;
  }

  async deleteUser(id: string) {
    await this.factory.delete(id);
  }

  async query(email: string): Promise<IntUser> {
    return this.factory.query(email);
  }
}

export const userAPI = new UserAPI();
