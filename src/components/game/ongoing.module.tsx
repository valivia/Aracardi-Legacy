import styles from "./ongoing.module.scss";
// Types
import { Card, processedCard } from "@structs/card";
import { Settings } from "@structs/game";
import { Player } from "@structs/player";
import { useEffect, useState, useMemo } from "react";
import CardComponent from "./game/card.module";
import ActiveCardsComponent from "./game/active_cards.module";
import PlayersComponent from "./game/players.module";
import { processCard } from "@components/functions/process_card";
import { motion } from "framer-motion";

function GameScene({ players, addPlayer, removePlayer, shufflePlayers, settings, cards: CardsSource }: Props) {
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const backlogCount = useMemo(() =>
    Math.floor(settings.backlog_percentage * CardsSource.length), [settings.backlog_percentage, CardsSource.length]);

  // Cards
  const [activeCards, setActiveCards] = useState<processedCard[]>([]);
  const [usedCards, setUsedCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<processedCard>();
  const [cards, setCards] = useState<Card[]>(CardsSource);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  const deleteActiveCard = (card: processedCard) => setActiveCards(old => old.filter((x) => x.id !== card.id));

  const nextCard = () => {
    const player = currentPlayer ?? [...players][0];
    const currentIndex = players.indexOf(player);
    const newCurrentPlayer = [...players][(currentIndex + 1) % players.length];

    document.getElementById(`player_${newCurrentPlayer.name}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

    setActiveCards(old => {
      // Filter expired active cards.
      const newArray = old
        .map(card => {
          if (card.turns === -1 || card.turns === 0) return { ...card };
          return { ...card, turns: card.turns - 1 };
        })
        .filter(card => card.turns !== 0);

      if (!currentCard) return newArray;

      const allPlayersPresent = currentCard.players.length === currentCard.players
        .reduce((x, current) => players.some(y => y.name === current.name) ? x + 1 : x, 0);

      if (currentCard.turns !== 0 && allPlayersPresent)
        newArray.push(currentCard);

      return newArray;
    });

    const newCards = [...cards];
    const newPreviousCards = [...usedCards];

    // Remove card from previouscards if there is too many.
    if (settings.loop_cards) {
      if (newPreviousCards.length === backlogCount) {
        const newCard = newPreviousCards.shift();
        if (newCard === undefined)
          console.error("No card!??");
        else
          newCards.push(newCard);

      }
    }


    // Add current card to previous cards.
    const previousCard = { ...currentCard } as processedCard;
    newPreviousCards.push(previousCard);


    // Set new current card.
    if (newCards.length === 0) setCurrentCard(undefined);
    else {
      const newCardIndex = Math.floor(Math.random() * newCards.length);
      const newCard = newCards[newCardIndex];
      newCards.splice(newCardIndex, 1);
      setCurrentCard(processCard(newCard, newCurrentPlayer, players));
    }


    setUsedCards(newPreviousCards);
    setCurrentPlayer(newCurrentPlayer);
    setCards(newCards);
  };

  const onPlayerRemove = (player: Player) => {
    setActiveCards(old => old.filter(card => !card.players.some(x => x.name === player.name)));
    removePlayer(player);
  };

  return (
    <>
      <section className={styles.players}>
        <PlayersComponent
          players={players}
          currentPlayer={currentPlayer}
          removePlayer={onPlayerRemove}
          addPlayer={addPlayer}
          shufflePlayers={shufflePlayers}
        />
      </section>

      {/* Card */}
      <motion.main
        className={styles.currentCardContainer}
        initial={{ opacity: 0, y: 300 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {currentCard === undefined
          ? usedCards.length === 0
            ? <button onClick={() => nextCard()}>Start Game</button>
            : "Thanks for playing!"
          : <CardComponent key={currentCard.id} card={currentCard} settings={settings} onClick={nextCard} />}
      </motion.main>

      {/* Active */}
      <section className={styles.activeCards}>
        <ActiveCardsComponent
          cards={activeCards}
          deleteCard={deleteActiveCard}
          settings={settings}
        />
      </section>
    </>
  );
}

export default GameScene;

interface Props {
  players: Player[];
  addPlayer: (player: Player) => boolean;
  removePlayer: (player: Player) => void;
  shufflePlayers: () => void;
  settings: Settings;
  cards: Card[]
}
