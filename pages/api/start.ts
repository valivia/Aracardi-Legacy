// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Addon } from "@structs/addon";
import { Game } from "@structs/game";
import { Player } from "@structs/player";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Get players and game from body;
  const { players, game, addons } = req.body as {
    players: Player[];
    game: Game;
    addons: Addon[];
  };

  // not the most robust code but whatever lol, working on a new aracardi.

  console.log(`User started ${game.title}\n -players: ${players.map(p => p.name).join(", ")}\n -addons: ${addons.map(a => a.title).join(", ")}`);

  res.status(200).send("Ok");
}
