import styles from "../main.module.scss";
import { Layout } from "src/components/global/layout.module";
import { Header } from "@components/dashboard/header";
import { Accordion } from "@components/dashboard/accordion";
import Prisma from "@prisma/client";
import { trpc } from "@utils/trpc";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Addon } from "@components/setup/addon.module";
import { prisma } from "src/server/prisma";
import { Button } from "@components/input/button.module";
import { Toggle } from "@components/input/toggle";
import { useState } from "react";
import { User } from "@components/dashboard/user";

import Marceline from "@public/avatars/marceline.svg";
import Ghost from "@public/avatars/ghost.svg";
import Frog from "@public/avatars/froggi.svg";

const GameDashboard: NextPage<Props> = ({ game }) => {
  const addons = trpc.addon.all.useQuery({ limit: 5, game_id: game.id });
  const [allowNsfw, setAllowNsfw] = useState(true);
  console.log(allowNsfw);


  return (
    <Layout>
      <div className={styles.main}>
        <Header
          title={game.title}
          description={game.description}
          avatar={Marceline}
        />

        <main className={styles.menu}>
          <Accordion title="Statistics">
            a
          </Accordion>

          <Accordion title="Default Addons">
            <section className={styles.itemList}>
              {addons.data?.items.map(addon => <Addon key={addon.id} addon={addon} />)}
              <Button variant="secondary">Add default addon</Button>
            </section>
          </Accordion>

          <Accordion title="Default Settings">
            <section className={styles.settings}>
              <Toggle
                name="allow_nsfw"
                label="Allow nsfw"
                value={allowNsfw}
                onChange={() => setAllowNsfw(old => !old)}
              />
              <Toggle
                name="loop_cards"
                label="Loop cards"
                value={allowNsfw}
                onChange={() => setAllowNsfw(old => !old)}
              />

              <Toggle
                name="available_online"
                label="Available online"
                value={allowNsfw}
                onChange={() => setAllowNsfw(old => !old)}
              />

              <Toggle
                name="available_offline"
                label="Available offline"
                value={allowNsfw}
                onChange={() => setAllowNsfw(old => !old)}
              />
            </section>
          </Accordion>

          <Accordion title="Permissions">
            <section className={styles.permissions}>
              <User avatar={Marceline} user={{ name: "Owlive" }} role="admin" />
              <User avatar={Ghost} user={{ name: "Usyer" }} can_edit={true} role="collaborator" />
              <User avatar={Frog} user={{ name: "Birbreme" }} can_edit={true} role="collaborator" />
              <Button variant="secondary">Add collaborator</Button>
            </section>
          </Accordion>
        </main>

      </div>
    </Layout>
  );
};

interface Props {
  game: Prisma.Game;
}

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

export default GameDashboard;
