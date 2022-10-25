import { Game } from "@structs/game";
import Link from "next/link";
import styles from "./game.module.scss";

function GameComponent({ game }: Props) {
    return (
        <Link href={`/game/${game.id}`}>
            <article className={styles.main}>
                <h1>{game.title}</h1>
            </article>
        </Link>
    )
}

export default GameComponent;

interface Props {
    game: Game;
}