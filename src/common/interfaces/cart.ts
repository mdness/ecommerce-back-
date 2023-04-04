import { Document, Types } from 'mongoose';
import { IntObject } from './others';
import { IntItem } from './products';

export interface IntCart extends IntObject, Document {
  id: string;
  user: Types.ObjectId;
  products: CartIntItem[];
}

export interface CartIntItem {
  product: Types.ObjectId | IntItem;
  quantity: number;
}
