import { processedCard } from "@structs/card";
import { Settings } from "@structs/game";
import styles from "./active_cards.module.scss";
import CardComponent from "./card.module";

function ActiveCardsComponent({ cards, settings, deleteCard }: Props) {

  return (
    <section className={styles.main}>
      {cards.map(card =>
        <CardComponent
          key={card.active_id}
          card={card}
          preview={true}
          settings={settings}
          onClick={() => deleteCard(card)}
        />
      )}
    </section>
  );

}

interface Props {
  cards: processedCard[];
  settings: Settings;
  deleteCard: (card: processedCard) => void;
}

export default ActiveCardsComponent;
