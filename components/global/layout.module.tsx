import { Game } from "@structs/game";
import Head from "next/head";
import styles from "./layout.module.scss";
import LogoComponent from "./logo.module";

function LayoutComponent({ title: inputTitle, game, children }: Props) {
    const title = inputTitle ?? game?.title ?? "Card Game";
    const description = game?.description ?? "Play a card game!";
    return (
        <div className={styles.frame}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <header className={styles.title}>
                <h1>{title}</h1>
            </header>
            {children}
            <LogoComponent />
        </div>
    )
}

export default LayoutComponent;

interface Props {
    title?: string;
    game?: Game;
    children: JSX.Element | JSX.Element[];
}