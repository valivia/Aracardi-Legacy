import { Game } from "@structs/game";
import { motion } from "framer-motion";
import Head from "next/head";
import styles from "./layout.module.scss";
import LogoComponent from "./logo.module";

function Layout({ title, subtitle, game, children }: Props) {
  const description = game?.description ?? "Play card games!";
  return (
    <div className={styles.frame}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      {(title || subtitle) &&
        <motion.header
          key={title || subtitle}
          className={styles.title}
          initial={{ x: 300 }}
          animate={{ x: 0 }}
        >
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </motion.header>
      }
      {children}
      <LogoComponent />
    </div>
  );
}

export { Layout };

interface Props {
  title?: string;
  subtitle?: string;
  game?: Game;
  children: JSX.Element | JSX.Element[];
}
