import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import { trpc } from "@utils/trpc";
import GameComponent from "@components/index/game.module";

const Home = ({ games }: Props) => {
  const test = trpc.game.all.useQuery({});
  if (test.data) console.log({ test });
  console.log({ games });

  return (
    <LayoutComponent>
      <main className={styles.main}>
        {games && games.map((game) =>
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
  const games = result.map(game => ({ ...game, created_at: Number(game.created_at), updated_at: Number(game.updated_at) }));
  return { props: { games } };

}