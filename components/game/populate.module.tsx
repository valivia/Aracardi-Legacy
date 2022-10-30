import { Player } from "@structs/player";
import { Scene } from "@structs/scene";
import styles from "./populate.module.scss";
import PlayerComponent from "@components/player/player.module";
import PlayerMenuComponent from "@components/player/player_menu.module";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MIN_PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;
const MAX_PLAYER_COUNT = process.env.NEXT_PUBLIC_MAXIMUM_PLAYER_COUNT as unknown as number;

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
    <motion.main
      className={styles.main}
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
    >

      {/* Current Players */}
      {players.length !== 0
        ? <motion.section
          className={styles.players}

          variants={{ show: { transition: { staggerChildren: .05 } } }}
          initial="hidden"
          animate="show"
        >
          {players.map(player =>
            <PlayerComponent
              key={player.name}
              player={player}
              removePlayer={removePlayer}
            />)}

        </motion.section>

        : <div><p>No players added yet.</p> {canLoadPlayers && loadPlayerElement}</div>
      }

      {/* Add player */}
      {players.length >= MIN_PLAYER_COUNT ?
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
      {players.length < MAX_PLAYER_COUNT  &&
        <PlayerMenuComponent addPlayer={addPlayer} players={players} />
      }
    </motion.main>
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