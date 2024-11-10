export interface Card {
  id: string;
  content: string;
}

export interface Column {
  title: string;
  cards: Card[];
}

export interface BoardState {
  [key: string]: Column;
}
