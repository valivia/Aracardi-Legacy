import { Card, processedCard } from "@structs/card";
import { Player } from "@structs/player";
import shuffle from "./shuffle";

export const processCard = (cardInput: Card, playerInput: Player, playersInput: Player[]): processedCard => {
  const card = { ...cardInput };
  let players = [...playersInput];
  const player = { ...playerInput };
  const text = card.text;

  const output: processedCard = {
    ...card,
    turns: card.turns ?? 0,
    players: [],
    active_id: `${card.id}_${Date.now()}_${player.name}`,
    processed_text: [],
  };

  let processed_text: (string | JSX.Element)[] = text.replace(/ /g, "~ ").split("~");

  // Next player.
  const previousPlayerRegex = /%PREVIOUS_PLAYER%/g;
  if (text.match(previousPlayerRegex)) {
    // Get player
    const currentPlayerIndex = players.indexOf(player ?? players[0]);
    const match_player = players.splice(currentPlayerIndex - 1, 1)[0];

    // Add player to card list
    output.players.push(match_player);

    // Loop over card text and replace with player name.
    processed_text = processed_text.map((substring, index) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(previousPlayerRegex)) return substring;
      return <var key={`${output.active_id}_previous_${index}`}> {match_player.name}</var>;
    });
  }

  // Previous player.
  const nextPlayerRegex = /%NEXT_PLAYER%/g;
  if (text.match(nextPlayerRegex)) {
    // Get player
    const currentPlayerIndex = players.indexOf(player ?? players[0]);
    const match_player = players.splice(currentPlayerIndex + 1, 1)[0];

    // Add player to card list
    output.players.push(match_player);

    // Loop over card text and replace with player name.
    processed_text = processed_text.map((substring, index) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(nextPlayerRegex)) return substring;
      return <var key={`${output.active_id}_next_${index}`}> {match_player.name}</var>;
    });
  }

  // Current player.
  const currentPlayerRegex = /%SELF%/g;
  // Get player.
  const currentPlayerIndex = players.indexOf(player ?? players[0]);
  players.splice(currentPlayerIndex, 1)[0];

  // Add player to card list
  output.players.push(player);

  // Check for matches.
  if (text.match(currentPlayerRegex)) {
    // Loop over card text and replace with player name.
    processed_text = processed_text.map((substring, index) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(currentPlayerRegex)) return substring;
      return (
        <var key={`${output.active_id}_self_${index}`}><u> {player.name}</u></var>
      );
    });
  }

  // Random players
  let randomPlayers: [placeholder: string, player: Player][] = [];
  const randomPlayerRegex = /%PLAYER[0-9]%/g;
  const randomPlayerRegexResult = text.match(randomPlayerRegex);

  if (randomPlayerRegexResult) {
    const uniquePlaceholders = Array.from(new Set([...randomPlayerRegexResult]));

    players = shuffle(players).splice(0, uniquePlaceholders.length);

    // Add players to card list
    output.players.concat(players);

    randomPlayers = players.map((entry, index) => [uniquePlaceholders[index], entry]);

    // Loop over card text and replace with player name.
    processed_text = processed_text.map((substring, index) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(randomPlayerRegex)) return substring;

      const match_player = randomPlayers.find(
        (p) => p[0] === substring.trim()
      );

      return <var key={`${output.active_id}_random_${index}`}> {match_player?.[1].name}</var>;
    });
  }

  return { ...output, processed_text };
};