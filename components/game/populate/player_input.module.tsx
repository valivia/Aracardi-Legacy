import { Player } from "@structs/player";
import styles from "./player_input.module.scss";
import { useState } from "react";
import avatars from "@assets/avatars/avatars";

function PlayerInputComponent({ players, addPlayer, children }: Props) {
    const [name, setName] = useState("");

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


    if (players.length >= 15) return <></>;

    return (
        <form className={styles.main} onSubmit={onSubmit}>
            <input
                placeholder="Enter Player Name..."
                value={name}
                minLength={3}
                onChange={(e) => setName(e.target.value)}
            />
            {children}
        </form>

    )
}

export default PlayerInputComponent;

interface Props {
    players: Player[];
    addPlayer: (player: Player) => boolean;
    children?: JSX.Element | JSX.Element[];
}