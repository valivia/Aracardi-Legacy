import { Player } from "@structs/player";
import PlayerComponent from "@components/player/player.module";
import styles from "./players.module.scss";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PlayersComponent({ players, currentPlayer, removePlayer, shufflePlayers }: Props) {

    return (
        <section className={styles.main}>
            <article className={styles.playerButton}>+</article>
            {players.map(player =>
                <PlayerComponent
                    key={player.name}
                    player={player}
                    removePlayer={removePlayer}
                    canRemove={players.length > PLAYER_COUNT && player.name !== currentPlayer.name}
                    active={currentPlayer.name === player.name}
                />
            )}
            <article
                className={styles.playerButton}
                onClick={shufflePlayers}
            >
                ~
            </article>
        </section>
    );

}

interface Props {
    players: Player[];
    currentPlayer: Player;
    removePlayer: (player: Player) => void;
    shufflePlayers: () => void;
}

export default PlayersComponent;
