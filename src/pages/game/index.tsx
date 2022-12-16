import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import Link from "next/link";

const Games = ({ games }: Props) => {
  return (
    <LayoutComponent>
      <main className={styles.main}>

        {/* Search Section */}
        <section role="search">
          <button></button>
          <button></button>
          <button></button>
          <input placeholder="E.g 'Drunk pirate'" />
        </section>

        <hr />

        {/* List of games */}
        <section>
          <ul>
            {games.map(x => <li key={x.id}><Link href={`/game/${x.id}`}>{x.title}</Link></li>)}
          </ul>
        </section>

      </main>
    </LayoutComponent>
  );
};

interface Props {
  games: Game[]
}

export default Games;

export async function getStaticProps() {
  const result = await prisma.game.findMany();
  const games = result.map(game => ({ ...game, created_at: Number(game.created_at), updated_at: Number(game.updated_at) }));
  return { props: { games } };

}
