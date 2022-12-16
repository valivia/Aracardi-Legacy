import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import { trpc } from "@utils/trpc";
import { GetStaticPaths, GetStaticProps } from "next";

const GameSetup = ({ game }: Props) => {
  const addons = trpc.addon.all.useQuery({ limit: 50, game_id: game.id });

  return (
    <LayoutComponent title={game.title}>
      <main className={styles.main}>

        {/* Search Section */}
        <section role="search">
          <button></button>
          <button></button>
          <button></button>
          <input placeholder="E.g 'Base pack'" />
        </section>

        <hr />

        {/* List of addons */}
        <section>
          <ul>
            {addons.data?.items.map(x => <li key={x.id}>{x.title}</li>)}
          </ul>
        </section>

        {/* Card count and settings */}
        <section>
          657
          423
          56
          <button>Settings</button>
        </section>

        {/* Start */}
        <section>
          <button>Start Online</button>
          <button>Start Offline</button>
        </section>

      </main>
    </LayoutComponent>
  );
};

interface Props {
  game: Game
}

export default GameSetup;

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await prisma.game.findMany();
  const paths = result.map((project) => ({ params: { id: project.id } }));
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const result = await prisma.game.findUnique({ where: { id: params?.id as string } });
  if (!result) return { notFound: true };
  const game = {
    ...result,
    created_at: Number(result.created_at),
    updated_at: Number(result.updated_at),
  };

  return { props: { game } };
};
