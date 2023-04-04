import { Document, PopulatedDoc } from 'mongoose';
import { CartIntItem } from './cart';
import { IntUser } from './users';

export interface BaseIntOrder {
  products: CartIntItem[];
  status: 'placed' | 'completed';
  total: number;
  shippingAddress: string;
  postalCode: string;
}

export interface IntOrder extends BaseIntOrder, Document {
  id: string;
  user: PopulatedDoc<IntUser>;
}
