import styles from "./main.module.scss";
import { Layout } from "src/components/global/layout.module";
import { Header } from "@components/dashboard/header";
import Marceline from "@public/avatars/marceline.svg";
import { Accordion } from "@components/dashboard/accordion";
import { User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { Game } from "@components/setup/game.module";


const Dashboard = () => {
  const user: User = {
    name: "Owlive",
    created_at: new Date(),
    updated_at: new Date(),
    id: "",
    authored_game_ids: [],
    authored_addon_ids: [],
    favorite_addon_ids: [],
  };

  const games = trpc.game.all.useQuery({ limit: 5 });
  const addons = trpc.addon.all.useQuery({ limit: 5, game_id: "63964fd8ff9e2d8649857828" });


  return (
    <Layout>
      <div className={styles.main}>
        <Header
          title={user.name}
          avatar={Marceline}
        />

        <main className={styles.menu}>
          <Accordion title="My Games">
            <section className={styles.gameList}>
              {games.data?.items.map(game => <Game key={game.id} game={game} />)}
            </section>
          </Accordion>

          <Accordion title="My Addons">
            <span>aaa</span>
          </Accordion>
        </main>

      </div>
    </Layout>
  );
};

export default Dashboard;
