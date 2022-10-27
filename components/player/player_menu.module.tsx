import { Player } from "@structs/player";
import styles from "./player_menu.module.scss";
import avatars from "@assets/avatars/avatars";
import AvatarComponent from "./avatar.module";
import { useState } from "react";


function PlayerMenuComponent({ player: playerInput, players = [], addPlayer }: Props) {

    const getRandomAvatar = (): number => {
        const filteredList = avatars.filter((_, index) => !players.some(y => y.avatar === index));
        const index = Math.floor(Math.random() * filteredList.length);
        return avatars.indexOf(filteredList[index]);
    }

    const getDefaultPlayer = (): Player => {
        return {
            id: "",
            name: "",
            color: "",
            avatar: getRandomAvatar(),
        }

    }

    const [player, setPlayer] = useState(playerInput ?? getDefaultPlayer)
    const avatar = avatars[player.avatar];


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (addPlayer(player))
            setPlayer(getDefaultPlayer());
    }

    return (
        <article className={styles.main}>

            {/* Edit Player */}
            <form className={styles.form} onSubmit={onSubmit}>

                {/* Input */}
                <fieldset className={styles.inputFields}>
                    <input
                        placeholder="Enter Player Name..."
                        value={player.name}
                        minLength={3}
                        maxLength={10}
                        onChange={(e) => setPlayer(old => ({ ...old, name: e.target.value.replace(" ", "") }))}
                    />
                    <button className={styles.addPlayerButton}>Add Player</button>
                </fieldset>


                {/* Selected Avatar */}
                <figure className={styles.selectedAvatar} onClick={() => setPlayer(old => ({ ...old, avatar: getRandomAvatar() }))}>
                    <AvatarComponent avatar={avatar.element} />
                </figure>

                {/* Avatar Info */}
                <section className={styles.avatarInfo}>
                    <b>Name</b>
                    {avatar.name}
                    <b>Authors</b>
                    {avatar.authors.join(", ")}
                </section>
            </form>

            {/* Available Avatars */}
            <section className={styles.avatars}>
                {avatars.map((avatar, index) =>
                    <div
                        className={styles.avatar}
                        onClick={() => setPlayer(old => ({ ...old, avatar: index }))}
                        data-is_selected={index === player.avatar}
                        data-is_used={players.some(x => x.avatar === index)}
                    >
                        <AvatarComponent avatar={avatar.element} />
                    </div>
                )}
            </section>

        </article >
    )
}

export default PlayerMenuComponent;

interface Props {
    player?: Player;
    players?: Player[];
    addPlayer: (player: Player) => boolean;
}