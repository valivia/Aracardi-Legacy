import { processedCard } from "types/card";
import React, { ReactNode } from "react";
import styles from "./current_card.module.scss";
import { Settings } from "@structs/game";
import Image from "next/image";

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
                    {`turn${card.turns! > 1 ? "s" : ""}`}
                </>
            );
        });
    }

    if (preview) return (
        <article
            className={styles.active}
            onClick={onClick}
        >
            <p>{text as string | ReactNode}</p>
        </article>
    );


    return (
        <article
            style={cardStyle}
            className={styles.main}
            onClick={onClick}
        >
            {card.title && <h1>{card.title}</h1>}
            <p>{text as string | ReactNode}</p>
        </article>
    );

}

interface Props {
    card: processedCard;
    settings: Settings;
    onClick: () => void;
    preview?: boolean;
}

export default CardComponent;
