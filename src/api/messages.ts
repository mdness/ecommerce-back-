import { IntMessage } from 'common/interfaces/messages';
import { messagesModelMongoDb } from 'models/mongodb/messages';

class MessagesAPI {
  get(userId: string): Promise<IntMessage[]> {
    return messagesModelMongoDb.get(userId);
  }

  async save(userId: string, text: string, type: 'user' | 'system') {
    const newMessage = await messagesModelMongoDb.save(userId, text, type);
    return newMessage;
  }
}

export const messagesAPI = new MessagesAPI();
