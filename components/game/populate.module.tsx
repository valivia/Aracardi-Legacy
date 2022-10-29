import { Player } from "@structs/player";
import { Scene } from "@structs/scene";
import styles from "./populate.module.scss";
import PlayerComponent from "@components/player/player.module";
import PlayerMenuComponent from "@components/player/player_menu.module";
import { useEffect, useState } from "react";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PopulateScene({ players, addPlayer, removePlayer, setScene, loadPlayers }: Props) {
  const [canLoadPlayers, setCanLoad] = useState(false);

  // Check if can load old players.
  useEffect(() => {
    if (players.length === 0
      && canLoadPlayers === false
      && localStorage.getItem("players") !== null
    ) setCanLoad(true);

  }, [players])

  // Start the game and save the current players.
  const startGame = () => {
    setScene(Scene.ONGOING);
  }

  const loadPlayerElement = <u onClick={() => loadPlayers()} className={styles.loadPrev}>Load from previous session</u>

  return (
    <main className={styles.main}>

      {/* Current Players */}
      <section className={styles.players}>
        {players.length === 0
          ? <div><p>No players added yet.</p> {canLoadPlayers && loadPlayerElement}</div>
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
  loadPlayers: () => void;
  setScene: (scene: Scene) => void;
}