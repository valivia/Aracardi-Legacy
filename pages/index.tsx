import GameComponent from '@components/index/game.module'
import type { NextPage } from 'next'
import styles from "./index.module.scss";
import games from "../data/games.json";
import LayoutComponent from '@components/global/layout.module';

const Home: NextPage = () => {

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
  )
}

export default Home
