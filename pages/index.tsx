import GameComponent from "@components/index/game.module";
import styles from "./index.module.scss";
import LayoutComponent from "@components/global/layout.module";
import { Game } from "@structs/game";
import prisma from "lib/prisma";

const Home = ({ games }: Props) => {

  return (
    <LayoutComponent>
      <main className={styles.main}>
        {games.map((game) =>
          <GameComponent
            key={game.id}
            game={game}
          />
        )}
      </main>
    </LayoutComponent>
  );
};

interface Props {
  games: Game[]
}

export default Home;

export async function getStaticProps() {
  const result = await prisma.game.findMany();
  const games = result.map(game => ({ ...game, created_at: Number(game.created_at) }));


  return {

    props: { games },

  };

}