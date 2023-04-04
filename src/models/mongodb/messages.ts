import { IntMessage } from 'common/interfaces/messages';
import mongoose from 'mongoose';

const messagesCollection = 'messages';

const MessageSchema = new mongoose.Schema<IntMessage>(
  {
    user: {
      type: 'ObjectId',
      ref: 'User',
    },
    text: { type: String, require: true },
    type: { type: String, require: true },
  },
  {
    timestamps: {
      createdAt: 'date',
    },
  },
);

MessageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const messagesModel = mongoose.model<IntMessage>(
  messagesCollection,
  MessageSchema,
);

class MessagesModelMongoDb {
  private messages;
  constructor() {
    this.messages = messagesModel;
  }
  async get(userId: string): Promise<IntMessage[]> {
    const userMessages = this.messages.find({ user: userId }).populate('user');
    return userMessages;
  }

  async save(
    userId: string,
    text: string,
    type: 'user' | 'system',
  ): Promise<IntMessage> {
    const saveModel = new this.messages({
      user: userId,
      text,
      type,
    });
    return (await saveModel.save()).populate('user');
  }
}

export const messagesModelMongoDb = new MessagesModelMongoDb();
