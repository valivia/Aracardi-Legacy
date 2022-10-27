import { Player } from "@structs/player";
import { Scene } from "@structs/scene";
import styles from "./populate.module.scss";
import PlayerComponent from "@components/player/player.module";
import PlayerMenuComponent from "@components/player/player_menu.module";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PopulateScene({ players, addPlayer, removePlayer, setScene }: Props) {
  const startGame = () => {
    setScene(Scene.ONGOING);
  }

  return (
    <main className={styles.main}>

      {/* Current Players */}
      <section className={styles.players}>
        {players.length === 0
          ? "No players added yet"
          : players.map(player =>
            <PlayerComponent
              key={player.name}
              player={player}
              removePlayer={removePlayer}
            />)
        }
      </section>

      {/* Add player */}
      {players.length >= PLAYER_COUNT ?
        <button
          type="button"
          onClick={() => startGame()}
          className={styles.startGameButton}
        >
          Start Game
        </button>
        : <div></div>
      }

      {/* Start Game */}
      {players.length < 15 &&
        <PlayerMenuComponent addPlayer={addPlayer} players={players} />
      }
    </main>
  )
}

export default PopulateScene;

interface Props {
  players: Player[];
  addPlayer: (player: Player) => boolean;
  removePlayer: (player: Player) => void;
  setScene: (scene: Scene) => void;
}