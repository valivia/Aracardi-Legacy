import { Player } from "@structs/player";
import styles from "./player.module.scss";
import { avatars } from "@public/avatars/avatars";
import { motion } from "framer-motion";

function PlayerComponent({ player, active = false, canRemove = true, removePlayer }: Props) {
  const Avatar = avatars[player.avatar].element;

  return (
    <motion.div
      className={styles.main}
      id={`player_${player.name}`}
      data-active={active}
      data-canremove={canRemove}

      // Animation
      variants={{
        hidden: { opacity: 0, scale: 0.1 },
        show: { opacity: 1, scale: 1 },
      }}

      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Avatar */}
      <section className={styles.avatarContainer}>
        <Avatar className={styles.avatar} />
        <button className={styles.removeButton} onClick={() => canRemove && removePlayer(player)}>X</button>
      </section>
      {/* Name */}
      <p className={styles.name}>{player.name}</p>
    </motion.div>
  );
}

export default PlayerComponent;

interface Props {
  player: Player;
  removePlayer: (player: Player) => void;
  active?: boolean;
  canRemove?: boolean;
}