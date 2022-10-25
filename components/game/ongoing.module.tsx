import styles from "./ongoing.module.scss";
// Types
import { Card, processedCard } from "@structs/card";
import { Settings } from "@structs/game";
import { Player } from "@structs/player";
import PlayerComponent from "./populate/player.module";
import { useState } from "react";
import CardComponent from "./game/current_card.module";

const PLAYER_COUNT = process.env.NEXT_PUBLIC_MINIMUM_PLAYER_COUNT as unknown as number;

function GameScene({ players, addPlayer, removePlayer, settings, cards: CardsSource }: Props) {
    const [currentPlayer, setCurrentPlayer] = useState(players[0]);

    // Cards
    const [activeCards, setActiveCards] = useState<processedCard[]>([]);
    const [usedCards, setUsedCards] = useState<Card[]>([]);
    const [currentCard, setCurrentCard] = useState<processedCard>();
    const [cards, setCards] = useState<Card[]>(CardsSource);

    const backlogCount = settings.backlog_percentage * cards.length;


    const deleteActiveCard = (card: processedCard) => setActiveCards(old => old.filter((x) => x.id !== card.id));

    const processCard = (card: Card, player: Player): processedCard => {
        let text = card.text as string;
        let output = { ...card, players: [player] } as unknown as processedCard;

        if (output.turns === undefined) output.turns = 0;

        // Previous/next/current player
        const currentIndex = players.indexOf(player ?? players[0]);
        const nextIndex = (currentIndex + 1) % players.length;
        const prevIndex = (currentIndex + players.length - 1) % players.length;

        // Random players
        let randomPlayers: { name: string; placeholder: string }[] = [];
        const match = text.match(/%PLAYER[0-9]%/g);

        if (match) {
            const playerOptions = players.filter((p) => p !== player);
            const uniquePlaceholders = Array.from(new Set([...match]));
            const names = [...playerOptions]
                .sort(() => Math.random() - 0.5)
                .splice(0, uniquePlaceholders.length);
            randomPlayers = names.map((x, y) => ({
                name: x.name,
                placeholder: uniquePlaceholders[y],
            }));
        }

        // Replace placeholders
        const processed_text = text
            .replace(/ /g, "~ ")
            .split("~")
            .map((substring) => {
                if (substring.match(/%PREVIOUS_PLAYER%/))
                    return (
                        <>
                            {" "}
                            <var>{players[prevIndex].name}</var>
                        </>
                    );
                if (substring.match(/%NEXT_PLAYER%/))
                    return (
                        <>
                            {" "}
                            <var>{players[nextIndex].name}</var>
                        </>
                    );
                if (substring.match(/%SELF%/))
                    return (
                        <>
                            {" "}
                            <var>
                                <u>{player.name}</u>
                            </var>
                        </>
                    );

                if (substring.match(/%PLAYER[0-9]%/)) {
                    const randomPlayer = randomPlayers.find(
                        (p) => p.placeholder === substring.trim()
                    );

                    if (randomPlayer)
                        return (
                            <>
                                {" "}
                                <var>{randomPlayer.name}</var>
                            </>
                        );
                }

                return substring;
            });

        return { ...output, processed_text };
    }

    const nextCard = () => {
        const player = currentPlayer ?? players[0];
        const currentIndex = players.indexOf(player);
        const newCurrentPlayer =
            players[(currentIndex + 1) % players.length];

        document.getElementById(`player_${newCurrentPlayer.name}`)?.scrollTo({ behavior: "smooth" })

        setActiveCards(old => {
            // Filter expired active cards.
            const newArray = old
                .map(card => {
                    if (card.turns === -1 || card.turns === 0) return { ...card }
                    return { ...card, turns: card.turns - 1 }
                })
                .filter(card => card.turns !== 0)

            // Add to active cards
            if (currentCard && currentCard.turns !== 0)
                newArray.push(currentCard);

            return newArray;
        })

        const newCards = [...cards];
        const newPreviousCards = [...usedCards];

        // Remove card from previouscards if there is too many.
        if (settings.loop_cards) {
            if (newPreviousCards.length === backlogCount)
                newCards.push(newPreviousCards.shift()!);
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
            setCurrentCard(processCard(newCard, newCurrentPlayer));
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
            {/* Players */}
            <section className={styles.playersFrame}>
                <section className={styles.players}>
                    {players.map(player =>
                        <PlayerComponent
                            player={player}
                            removePlayer={onPlayerRemove}
                            canRemove={players.length > PLAYER_COUNT && player.name !== currentPlayer.name}
                            active={currentPlayer.name === player.name}
                        />
                    )}
                </section>
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
                {activeCards.map(card => <CardComponent card={card} preview={true} settings={settings} onClick={() => deleteActiveCard(card)} />)}
            </section>
        </>
    );
}

export default GameScene;

interface Props {
    players: Player[];
    addPlayer: (player: Player) => void;
    removePlayer: (player: Player) => void;
    settings: Settings;
    cards: Card[]
}