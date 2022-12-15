import { Game } from "@structs/game";
import Link from "next/link";
import styles from "./game.module.scss";

function GameComponent({ game }: Props) {
  return (
    <article className={styles.main}>
      <Link href={`/game/${game.id}`}>
        <h1>{game.title}</h1>
        <p>{game.description}</p>
      </Link>
    </article>
  );
}

export default GameComponent;

interface Props {
  game: Game;
}
