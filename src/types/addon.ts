import { Card } from "./card";

export interface Addon {
  id: string;

  title: string;
  description: string;
  authors: string[];

  is_official: boolean;
  card_count: number;
  cards: Card[];
}
