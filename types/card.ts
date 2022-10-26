import { Player } from "./player";

export interface Card {
  id: string;

  title?: string;
  text: string;

  turns?: number;
  minimum_players?: number;
  maximum_players?: number;
  time_limit?: number;
  has_image: boolean;
  is_nsfw?: boolean;

  parent_card?: string;
}

export interface processedCard extends Card {
  active_id: string;
  turns: number;
  processed_text: (string | JSX.IntrinsicElements["var"])[];
  players: Player[];
}