import { PopulatedDoc } from 'mongoose';
import { IntUser } from './users';

export interface IntMessage {
  id?: string;
  user: PopulatedDoc<IntUser>;
  text: string;
  type: 'user' | 'system';
  date?: string;
}
