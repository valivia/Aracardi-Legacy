import { Player } from "./player";

export interface Card {
  id: string;

  title?: string | null;
  text: string;

  turns?: number | null;
  minimum_players?: number | null;
  maximum_players?: number | null;
  time_limit?: number | null;
  has_image: boolean;
  is_nsfw?: boolean | null;
}

export interface processedCard extends Card {
  active_id: string;
  turns: number;
  processed_text: (string | JSX.IntrinsicElements["var"])[];
  players: Player[];
}