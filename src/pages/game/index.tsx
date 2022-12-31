import styles from "./index.module.scss";
import { Layout } from "src/components/global/layout.module";
import { prisma } from "src/server/prisma";
import { GetStaticProps, NextPage } from "next";
import { Game } from "@components/setup/game.module";
import Prisma from "@prisma/client";
import { useState } from "react";
import { Button } from "@components/input/button.module";
import { TextInput } from "@components/input/text_input.module";
import { Link } from "@components/input/link.module";

const Games: NextPage<Props> = ({ games }) => {
  const [selectedGame, setGame] = useState<string>();
  const [query, setQuery] = useState("");

  return (
    <Layout title="Aracardi" subtitle="Please select a game">
      <main className={styles.main}>

        {/* Search Section */}
        <form role="search" className={styles.horizontalList}>
          {/* TODO 2 dropdown menus */}
          <Button
            size="lg"
            variant="secondary"
          >
            Sort</Button>
          <Button
            size="lg"
            variant="secondary"
          >
            Filter</Button>
          <TextInput
            size="lg"
            placeholder="E.g 'Drunk Pirate'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <hr />

        {/* List of games */}
        <section
          className={styles.addons}
          tabIndex={-1}
        >
          {games.map(game =>
            <Game
              key={game.id}
              game={game}
              onClick={() => setGame(game.id)}
              active={game.id === selectedGame}
            />
          )}
        </section>
        <div className={styles.fog}></div>

        {selectedGame !== undefined && <Link size="lg" href={`/game/${selectedGame}`}>Load Game</Link>}

      </main>
    </Layout>
  );
};

interface Props {
  games: Prisma.Game[]
}

export default Games;

export const getStaticProps: GetStaticProps = async () => {
  const result = await prisma.game.findMany();
  const games = result.map(game => ({ ...game, created_at: Number(game.created_at), updated_at: Number(game.updated_at) }));
  return { props: { games } };

};
