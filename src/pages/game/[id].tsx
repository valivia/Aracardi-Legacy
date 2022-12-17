import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import { trpc } from "@utils/trpc";
import { GetStaticPaths, GetStaticProps } from "next";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import ButtonComponent from "@components/input/button.module";
import AddonComponent from "@components/setup/addon.module";
import { UIEvent } from "react";
import TagComponent from "@components/global/tag.module";

const GameSetup = ({ game }: Props) => {
  const addons = trpc.addon.all.useInfiniteQuery(
    { limit: 7, game_id: game.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  async function scrolling(e: UIEvent) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if ((scrollTop + clientHeight === scrollHeight) && !addons.isFetching) {
      console.log("fetching...");
      await addons.fetchNextPage();
    }
  }

  return (
    <LayoutComponent title={game.title}>
      <main className={styles.main}>

        {/* Search Section */}
        <form role="search" className={styles.horizontalList}>
          <ButtonComponent variant="Secondary" >official</ButtonComponent>
          <ButtonComponent variant="Secondary" ><BsWifi /></ButtonComponent>
          <ButtonComponent variant="Secondary" ><BsWifiOff /></ButtonComponent>
          <input placeholder="E.g 'Base pack'" />
        </form>

        <hr />

        {/* List of addons */}
        <section className={styles.addons} onScroll={scrolling}>
          {addons.data?.pages.map(page =>
            page.items.map(x =>
              <AddonComponent key={x.id} addon={x} />
            )
          )
          }
        </section>

        {/* Card count and settings */}
        <section className={styles.horizontalList}>
          <TagComponent><BsWifi />125</TagComponent>
          <TagComponent><BsWifiOff />125</TagComponent>
          <ButtonComponent variant="Secondary">Settings</ButtonComponent>
        </section>

        {/* Start */}
        <section className={styles.horizontalList}>
          <ButtonComponent>Start Online</ButtonComponent>
          <ButtonComponent>Start Offline</ButtonComponent>
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
