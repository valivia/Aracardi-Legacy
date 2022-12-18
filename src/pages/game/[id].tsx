import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import { trpc } from "@utils/trpc";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import { Button } from "@components/input/button.module";
import { Addon } from "@components/setup/addon.module";
import { UIEvent, useState } from "react";
import { Tag } from "@components/global/tag.module";
import { TextInput } from "@components/input/text_input.module";

const GameSetup: NextPage<Props> = ({ game }) => {

  const [query, setQuery] = useState("");
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
    <LayoutComponent
      title={game.title}
      subTitle={"Please select your addons"}
    >

      <main className={styles.main}>
        {/* Search Section */}
        <form role="search" className={styles.horizontalList}>
          {/* TODO 2 dropdown menus */}
          <TextInput
            placeholder="E.g 'Base pack'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <hr />

        {/* List of addons */}
        <section
          className={styles.addons}
          onScroll={scrolling}
          tabIndex={-1}
        >
          {addons.data?.pages.map(page =>
            page.items.map(x =>
              <Addon key={x.id} addon={x} />
            )
          )}
        </section>

        {/* Card count and settings */}
        <section className={styles.horizontalList}>
          <Tag><BsWifi />125</Tag>
          <Tag><BsWifiOff />125</Tag>
          <Button variant="secondary">Settings</Button>
        </section>

        {/* Start */}
        <section className={styles.horizontalList}>
          <Button>Start Online</Button>
          <Button>Start Offline</Button>
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
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const game = await prisma.game.findUnique({ where: { id: params?.id as string } });
  if (!game) return { notFound: true };

  return { props: { game } };
};
