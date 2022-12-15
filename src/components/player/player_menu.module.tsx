import { Player } from "@structs/player";
import styles from "./player_menu.module.scss";
import avatars from "@public/avatars/avatars";
import AvatarComponent from "./avatar.module";
import { useState } from "react";
import { motion } from "framer-motion";


function PlayerMenuComponent({ player: playerInput, players = [], addPlayer }: Props) {

  const getRandomAvatar = (): number => {
    const filteredList = avatars.filter((_, index) => !players.some(y => y.avatar === index));
    const index = Math.floor(Math.random() * filteredList.length);
    return avatars.indexOf(filteredList[index]);
  };

  const getDefaultPlayer = (): Player => {
    return {
      id: `${Date.now()}`,
      name: "",
      color: "",
      avatar: getRandomAvatar(),
    };

  };

  const [player, setPlayer] = useState(playerInput ?? getDefaultPlayer);
  const avatar = avatars[player.avatar];


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addPlayer(player))
      setPlayer(getDefaultPlayer());
  };

  return (
    <article className={styles.main}>

      {/* Edit Player */}
      <form className={styles.form} onSubmit={onSubmit}>

        {/* Input */}
        <fieldset className={styles.inputFields}>
          <input
            placeholder="Enter Player Name..."
            value={player.name}
            minLength={1}
            maxLength={10}
            onChange={(e) => setPlayer(old => ({ ...old, name: e.target.value.replace(" ", "") }))}
          />
          <button className={styles.addPlayerButton}>Add Player</button>
        </fieldset>


        {/* Selected Avatar */}
        <motion.figure
          className={styles.selectedAvatar}
          onClick={() => setPlayer(old => ({ ...old, avatar: getRandomAvatar() }))}
          key={avatar.name}

          initial={{ opacity: 0, rotate: 100 }}
          animate={{ opacity: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          <AvatarComponent avatar={avatar.element} />
        </motion.figure>

        {/* Avatar Info */}
        <section className={styles.avatarInfo}>
          <b>Name</b>
          {avatar.name}
          <b>Author{avatar.authors.length > 1 && "s"}</b>
          {avatar.authors.join(", ")}
        </section>
      </form>

      {/* Available Avatars */}
      <motion.section
        className={styles.avatars}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="show"
      >
        {avatars.map((current, index) => {
          const isUsed = players.some(x => x.avatar === index);
          const isSelected = index === player.avatar;

          return (
            <motion.div
              key={index}
              className={styles.avatar}
              onClick={() => setPlayer(old => ({ ...old, avatar: index }))}

              data-is_selected={isSelected}
              data-is_used={isUsed}

              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },

              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}

            >
              <AvatarComponent avatar={current.element} />
            </motion.div>
          );
        }
        )}
      </motion.section>

    </article >
  );
}

export default PlayerMenuComponent;

interface Props {
  player?: Player;
  players?: Player[];
  addPlayer: (player: Player) => boolean;
}
