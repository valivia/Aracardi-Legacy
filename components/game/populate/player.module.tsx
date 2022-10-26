import { Player } from "@structs/player";
import styles from "./player.module.scss";
import avatars from "@assets/avatars/avatars";

function PlayerComponent({ player, active = false, canRemove = true, removePlayer }: Props) {
    const Avatar = avatars[player.avatar].element;

    return (
        <article
            className={styles.main}
            id={`player_${player.name}`}
            onClick={() => canRemove && removePlayer(player)}
            data-active={active}
            data-canremove={canRemove}
        >
            {/* Avatar */}
            <div className={styles.avatarContainer}>
                {<Avatar className={styles.avatar} />}
                <div className={styles.delete}>&#x2715;</div>
            </div>
            {/* Name */}
            <p className={styles.name}>{player.name}</p>
        </article>
    )
}

export default PlayerComponent;

interface Props {
    player: Player;
    removePlayer: (player: Player) => void;
    active?: boolean;
    canRemove?: boolean;
}