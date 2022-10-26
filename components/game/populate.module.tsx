import avatars from "@assets/avatars/avatars";
import { Player } from "@structs/player";
import { Scene } from "@structs/scene";
import { useState } from "react";
import styles from "./populate.module.scss";
import PlayerComponent from "./populate/player.module";
import PlayerInputComponent from "./populate/player_input.module";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PopulateScene({ players, addPlayer, removePlayer, setScene }: Props) {
  const [name, setName] = useState("");

  const startGame = () => {
    setScene(Scene.ONGOING);
  }

  return (
    <main className={styles.main}>

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

      <PlayerInputComponent players={players} addPlayer={addPlayer}>
        <section className={styles.buttons}>
          {/* Add Player */}
          {players.length < 15 &&
            <button className={styles.addPlayerButton}>Add Player</button>
          }
          {/* Start game */}
          {players.length >= PLAYER_COUNT &&
            <button
              type="button"
              onClick={() => startGame()}
              className={styles.startGameButton}
            >
              Start Game
            </button>
          }
        </section>
      </PlayerInputComponent>
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