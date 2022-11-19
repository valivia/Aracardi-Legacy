import { processedCard } from "types/card";
import React, { ReactNode } from "react";
import styles from "./card.module.scss";
import { Settings } from "@structs/game";
import { motion } from "framer-motion";

function CardComponent({ card, settings, preview = false, onClick }: Props) {
  let cardStyle = {};


  card.has_image && settings.display_images && (cardStyle = { backgroundImage: `url(/cards/${card.id}` });
  let text = card.processed_text;

  if (card.turns) {
    text = card.processed_text.map((substring) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(/%TURNS%/g)) return substring;
      return (
        <>
          {" "}
          <var key={`${card.active_id}_turns`}>{card.turns}</var>{" "}
          {`turn${card.turns > 1 ? "s" : ""}`}
        </>
      );
    });
  }

  if (preview) return (
    <motion.article
      className={styles.active}
      onClick={onClick}
      key={card.id}

      // Animation
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <p>{text as string | ReactNode}</p>
    </motion.article>
  );


  return (
    <motion.article
      style={cardStyle}
      className={styles.main}
      onClick={onClick}

      // Animation
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, rotate: 60, scale: 0.1 },
        visible: { opacity: 1, rotate: 0, scale: 1 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {card.title && <h1>{card.title}</h1>}
      <p>{text as string | ReactNode}</p>
    </motion.article>
  );

}

interface Props {
  card: processedCard;
  settings: Settings;
  onClick: () => void;
  preview?: boolean;
}

export default CardComponent;
