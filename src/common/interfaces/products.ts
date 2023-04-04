import { IntObject } from './others';

export interface BaseIntItem extends IntObject {
  name: string;
  description: string;
  code: string;
  price: number;
  category: string;
  photo: string;
  photoId?: string;
  timestamp: string;
  stock: number;
}

export interface IntItem extends BaseIntItem, IntObject {
  id: string;
}

export interface QueryIntItem extends IntObject {
  name?: string;
  code?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}
