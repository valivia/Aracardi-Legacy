import avatars from "@assets/avatars/avatars";
import { Player } from "@structs/player";
import { Scene } from "@structs/scene";
import { useState } from "react";
import styles from "./populate.module.scss";
import PlayerComponent from "./populate/player.module";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PopulateScene({ players, addPlayer, removePlayer, setScene }: Props) {
    const [name, setName] = useState("");

    const startGame = () => {
        setScene(Scene.ONGOING);
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const player: Player = {
            name,
            color: "",
            avatar: Math.floor(Math.random() * avatars.length),
            created_at: 342425,
        }

        if (addPlayer(player)) setName("");
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

            <form className={styles.input} onSubmit={onSubmit}>
                {players.length < 15 &&
                    <input placeholder="Enter Player Name..." value={name} onChange={(e) => setName(e.target.value)} />
                }

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

            </form>
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