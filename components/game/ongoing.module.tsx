import styles from "./ongoing.module.scss";
// Types
import { Card, processedCard } from "@structs/card";
import { Settings } from "@structs/game";
import { Player } from "@structs/player";
import { useState } from "react";
import CardComponent from "./game/current_card.module";
import ActiveCardsComponent from "./game/active_cards.module";
import PlayersComponent from "./game/players.module";
import processCard from "@components/process_card";

function GameScene({ players, addPlayer, removePlayer, shufflePlayers, settings, cards: CardsSource }: Props) {
    const [currentPlayer, setCurrentPlayer] = useState(players[0]);
    const [backlogCount, setBacklogCount] = useState(Math.floor(settings.backlog_percentage * CardsSource.length));

    // Cards
    const [activeCards, setActiveCards] = useState<processedCard[]>([]);
    const [usedCards, setUsedCards] = useState<Card[]>([]);
    const [currentCard, setCurrentCard] = useState<processedCard>();
    const [cards, setCards] = useState<Card[]>(CardsSource);


    const deleteActiveCard = (card: processedCard) => setActiveCards(old => old.filter((x) => x.id !== card.id));

    const nextCard = () => {
        const player = currentPlayer ?? players[0];
        const currentIndex = players.indexOf(player);
        const newCurrentPlayer =
            players[(currentIndex + 1) % players.length];

        document.getElementById(`player_${newCurrentPlayer.name}`)?.scrollIntoView({ behavior: "smooth", block: "center" })

        setActiveCards(old => {
            // Filter expired active cards.
            const newArray = old
                .map(card => {
                    if (card.turns === -1 || card.turns === 0) return { ...card }
                    return { ...card, turns: card.turns - 1 }
                })
                .filter(card => card.turns !== 0)

            if (!currentCard) return newArray;

            // Add to active cards
            const allPlayersPresent = currentCard.players.length === currentCard.players
                .reduce((x, player) =>
                    players.some(y => y.name === player.name) ? x + 1 : x,
                    0
                )

            if (currentCard.turns !== 0 && allPlayersPresent)
                newArray.push(currentCard);

            return newArray;
        })

        const newCards = [...cards];
        const newPreviousCards = [...usedCards];

        // Remove card from previouscards if there is too many.
        if (settings.loop_cards) {

            if (newPreviousCards.length === backlogCount) {
                const a = newPreviousCards.shift()
                // TODO
                newCards.push(a!);
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
            setCurrentCard(processCard(newCard, newCurrentPlayer, [...players]));
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
                    shufflePlayers={shufflePlayers}
                />
            </section>

            {/* Card */}
            <section className={styles.currentCardContainer}>
                {currentCard === undefined
                    ? usedCards.length === 0
                        ? <button onClick={() => nextCard()}>Start Game</button>
                        : "Thanks for playing!"
                    : <CardComponent card={currentCard} settings={settings} onClick={nextCard} />}
            </section>

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