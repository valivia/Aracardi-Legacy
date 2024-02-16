import type { GetStaticPropsContext } from "next";
import SetupScene from "@components/game/setup.module";
import GameScene from "@components/game/ongoing.module";
import PopulateScene from "@components/game/populate.module";
import { useState } from "react";
import LayoutComponent from "@components/global/layout.module";
import prisma from "@lib/prisma";

// Types
import { Game, Settings } from "@structs/game";
import { Player } from "@structs/player";
import { Card } from "@structs/card";
import { Scene } from "@structs/scene";
import shuffle from "@lib/shuffle";
import { Addon } from "@structs/addon";

const DEFAULT_SETTINGS: Settings = {
  allow_nsfw: false,
  display_images: true,
  loop_cards: true,
  turn_multiplier: 1.0,
  timer_multiplier: 1.0,
  backlog_percentage: 0.85,
};

const GamePage = ({ game, addons }: Props) => {

  const [scene, setScene] = useState<Scene>(Scene.SETUP);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [players, setPlayers] = useState<Player[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const addPlayer = (player: Player) => {
    if (player.name.length === 0) return false;
    if (players.some(x => x.name == player.name)) return false;
    setPlayers(old => [player, ...old]);
    return true;
  };

  const shufflePlayers = () => setPlayers(old => shuffle(old));

  const loadPlayers = () => {
    const jsonString = localStorage.getItem("players");
    const json = jsonString && JSON.parse(jsonString);
    if (json === null) return;
    setPlayers(json);
  };

  const startGame = () => {
    fetch("/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ players, game, addons }),
    });
    setScene(Scene.ONGOING);
  };

  const removePlayer = (player: Player) => setPlayers(old => old.filter(x => x.name !== player.name));

  if (scene === Scene.SETUP) return (
    <LayoutComponent game={game}>
      <SetupScene
        addons={addons}
        settings={settings}
        setSettings={setSettings}
        setCards={setCards}
        setScene={setScene}
      />
    </LayoutComponent>
  );

  if (scene === Scene.POPULATE) return (
    <LayoutComponent game={game}>
      <PopulateScene
        players={players}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
        loadPlayers={loadPlayers}
        startGame={startGame}
      />
    </LayoutComponent>
  );

  if (scene === Scene.ONGOING) return (
    <LayoutComponent game={game}>
      <GameScene
        players={players}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
        shufflePlayers={shufflePlayers}
        settings={settings}
        cards={cards}
      />
    </LayoutComponent>
  );

  return <div>Error</div>;
};

export default GamePage;


interface Props {
  game: Game;
  addons: Addon[];
}


export async function getStaticPaths() {
  const games = await prisma.game.findMany();
  const paths = games.map(game => ({ params: { id: game.id } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const gameResult = await prisma.game.findUnique({ where: { id: context.params?.id as string } });
  if (gameResult === null) return { notFound: true };
  const game = { ...gameResult, created_at: Number(gameResult.created_at) };

  const addonResult = await prisma.addon.findMany({
    where: { game_id: gameResult.id },
    include: { _count: { select: { cards: true } }, authors: true, cards: true },
  });

  const addons: Addon[] = addonResult.map(addon => {
    return {
      ...addon,
      created_at: Number(addon.created_at),
      _count: null,
      card_count: addon._count.cards,
      authors: addon.authors.map(x => x.name),
      cards: addon.cards.map(card => ({ ...card, created_at: Number(addon.created_at) })),
    };
  }
  ).filter(addon => addon.card_count > 0);

  return {
    props: { game, addons },
  };
}