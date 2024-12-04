import styles from "@styles/dashboard.module.scss";
import { Layout } from "src/components/global/layout";
import { Header } from "@components/dashboard/header";
import { AccordionItem } from "@components/dashboard/accordion";
import { User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { Avatar } from "@components/global/avatar";
import { DashboardItem } from "@components/dashboard/dashboard_item";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import { Tag } from "@components/global/tag";
import { NextPage } from "next";
import * as Accordion from "@radix-ui/react-accordion";

const Dashboard: NextPage = () => {
  const user: User = {
    name: "Owlive",
    created_at: new Date(),
    updated_at: new Date(),
    id: "",
    avatar_id: "marceline",
  };

  // TODO: proper query for user's games.
  const games = trpc.game.all.useQuery({ limit: 5 });

  return (
    <Layout>
      <div className={styles.main}>
        <Header
          title={user.name}
          avatar={<Avatar id={user.avatar_id || "pb"} />}
        />

        <main className={styles.menu}>
          <Accordion.Root type="multiple">
            <AccordionItem title="My Games">
              <section className={styles.itemList}>

                {games.data?.items.map(game =>
                  <DashboardItem
                    key={game.id}
                    title={game.title}
                    href={`/dashboard/game/${game.id}`}
                    avatar={<Avatar id="froggi" />}
                  >
                    {game.is_available_online && <Tag tooltip="Is available online"><BsWifi /></Tag>}
                    {game.is_available_offline && <Tag tooltip="Is available offline"><BsWifiOff /></Tag>}
                    {game.is_official && <Tag tooltip="This is a verified addon">Official</Tag>}
                  </DashboardItem>
                )}

              </section>
            </AccordionItem>

            <AccordionItem title="My Addons">
              <span>aaa</span>
            </AccordionItem>
          </Accordion.Root>
        </main>

      </div>
    </Layout>
  );
};

export default Dashboard;
