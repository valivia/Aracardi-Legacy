import { Player } from "@structs/player";
import styles from "./player.module.scss";
import avatars from "@assets/avatars/avatars";
import AvatarComponent from "./avatar.module";

function PlayerComponent({ player, active = false, canRemove = true, removePlayer }: Props) {
    const avatar = avatars[player.avatar].element;

    return (
        <article
            className={styles.main}
            id={`player_${player.name}`}
            onClick={() => canRemove && removePlayer(player)}
            data-active={active}
            data-canremove={canRemove}
        >
            {/* Avatar */}
            <AvatarComponent avatar={avatar} />
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