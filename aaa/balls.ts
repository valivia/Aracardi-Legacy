import { Player } from "@structs/player";


export interface Card {
  id: string;

  turns?: number;
  minimum_players?: number;
  maximum_players?: number;

  players: Player[];

  is_nsfw?: boolean;

  stages: Stages[];
}

type Stages = TextCard | PollCard | InputCard;

interface BaseCard {
  title: string;
  time_limit?: number; // time limit for card in ms.
  point_count?: number; // How many points to award.
}

interface TextCard extends BaseCard {
  text: string;
  has_image: boolean; // TODO
}

interface PollCard extends BaseCard {
  selection_count: number; // how many things they are allowed to select.
  options: PollOption[];
}

interface InputCard extends BaseCard {
  // "%ALL%" or "%PLAYER1%" / "%PLAYER2%"  / %HOST% ?
  target: string[]
}

interface PollOption {
  id: string;
  text: string;
}

const card: Card = {
  id: "dfg45g56g",

  players: [
    {
      id: "1",
      avatar: 2,
      name: "Czicken",
      color: "#FFFFFF",
    },
  ],

  stages: [

    {
      title: "Random text card",
      time_limit: 3000,
      point_count: 25,
      text: "Drink if you love women",
      has_image: true,
    },

    {
      title: "What is your favourite bird",
      time_limit: 5000,
      point_count: 50,
      selection_count: 1,
      options: [
        { id: "1", text: "tibu" },
        { id: "2", text: "tibu" },
      ],
    },

    {
      title: "input card numeros unos",
      time_limit: 200,
      point_count: 1,
      target: ["%PLAYER1%", "%PLAYER2%"],
    },
  ],
};