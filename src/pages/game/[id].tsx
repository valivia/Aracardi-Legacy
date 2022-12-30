import styles from "./index.module.scss";
import LayoutComponent from "src/components/global/layout.module";
import { Game } from "@structs/game";
import { prisma } from "src/server/prisma";
import { trpc } from "@utils/trpc";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import { Button } from "@components/input/button.module";
import { Addon } from "@components/setup/addon.module";
import React, { UIEvent, useEffect, useState } from "react";
import { Tag } from "@components/global/tag.module";
import { TextInput } from "@components/input/text_input.module";
import Prisma from "@prisma/client";

const GameSetup: NextPage<Props> = ({ game }) => {
  // TODO proper settings;
  const allowNsfw = true;
  const [query, setQuery] = useState("");
  const [activeAddons, setActiveAddons] = useState<Map<string, Prisma.Addon>>(new Map());
  const [cardSize, setCardSize] = useState({ offline: 0, online: 0 });

  // Fetch addons.
  const addons = trpc.addon.all.useInfiniteQuery(
    {
      limit: 20,
      game_id: game.id,
      search: query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // Update card count when an addon is (de)selected.
  useEffect(() => {
    const amount = { offline: 0, online: 0 };
    for (const entry of activeAddons.values()) {
      amount.offline += entry.offlineSize - (allowNsfw ? 0 : entry.offlineNsfwSize);
      amount.online += entry.onlineSize - (allowNsfw ? 0 : entry.onlineNsfwSize);
    }
    setCardSize(amount);
  }, [activeAddons, allowNsfw]);

  // Load more addons when end is reached.
  async function scrolling(e: UIEvent) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if ((scrollTop + clientHeight === scrollHeight) && !addons.isFetching) {
      console.log("fetching...");
      await addons.fetchNextPage();
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <LayoutComponent
      title={game.title}
      subTitle={"Please select your addons"}
    >

      <main className={styles.main}>
        {/* Search Section */}
        <form role="search" className={styles.horizontalList} onSubmit={onSubmit}>
          {/* TODO 2 dropdown menus */}
          <Button
            size="big"
            variant="secondary"
          >
            Sort</Button>
          <Button
            size="big"
            variant="secondary"
          >
            Filter</Button>
          <TextInput
            size="big"
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
            page.items.map(addon =>
              <Addon
                key={addon.id}
                addon={addon}
                active={activeAddons.has(addon.id)}
                onClick={() => setActiveAddons(old => {
                  const newAddons = new Map(old);
                  newAddons.has(addon.id) ? newAddons.delete(addon.id) : newAddons.set(addon.id, addon);
                  return newAddons;
                })
                }
              />
            )
          )}
        </section>
        <div className={styles.fog}></div>

        {/* Card count and settings */}
        <section className={styles.horizontalList}>
          <Tag><BsWifi />{cardSize.online}</Tag>
          <Tag><BsWifiOff />{cardSize.offline}</Tag>
          <Button variant="secondary" size="small">Settings</Button>
        </section>

        {/* Start */}
        {activeAddons.size > 0 &&
          <section className={styles.horizontalList}>
            <Button variant="primary">Start Online</Button>
            <Button variant="secondary">Start Offline</Button>
          </section>
        }

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
