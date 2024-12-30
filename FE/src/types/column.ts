import { Card } from '@/types/card';

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}
