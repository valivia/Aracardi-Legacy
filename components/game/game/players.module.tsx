import { Player } from "@structs/player";
import PlayerComponent from "@components/player/player.module";
import styles from "./players.module.scss";
import ModalComponent from "@components/global/modal.module";
import PlayerMenuComponent from "@components/player/player_menu.module";
import { useState } from "react";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function PlayersComponent({ players, currentPlayer, removePlayer, addPlayer, shufflePlayers }: Props) {
    const [addPlayerIsOpen, setAddPlayerIsOpen] = useState(false);

    const onPlayerAdd = (player: Player) => {
        const result = addPlayer(player);
        if (result) setAddPlayerIsOpen(false);
        return result;
    }

    return (
        <section className={styles.main}>

            {addPlayerIsOpen &&
                <ModalComponent onClose={() => setAddPlayerIsOpen(false)}>
                    <PlayerMenuComponent
                        addPlayer={onPlayerAdd}
                        players={players}
                    />
                </ModalComponent>
            }

            <article className={styles.playerButton} onClick={() => setAddPlayerIsOpen(true)}>+</article>
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
    addPlayer: (player: Player) => boolean;
    shufflePlayers: () => void;
}

export default PlayersComponent;
