import { Card, processedCard } from "@structs/card";
import { Player } from "@structs/player";
import shuffle from "./shuffle";

const processCard = (cardInput: Card, playerInput: Player, playersInput: Player[]): processedCard => {
  const card = { ...cardInput };
  let players = [...playersInput];
  const currentPlayer = { ...playerInput };
  const currentPlayerIndex = players.findIndex((player) => player.id == currentPlayer.id);

  const text = card.text;

  const output: processedCard = {
    ...card,
    turns: card.turns ?? 0,
    players: [],
    active_id: `${card.id}_${Date.now()}_${currentPlayer.name}`,
    processed_text: [],
  };

  let processed_text: (string | JSX.Element)[] = text.replace(/ /g, "~ ").split("~");

  // Next player.
  const previousPlayerRegex = /%PREVIOUS_PLAYER%/g;
  if (text.match(previousPlayerRegex)) {
    // Get player
    let targetPlayerIndex = currentPlayerIndex - 1;
    if (targetPlayerIndex < players.length) targetPlayerIndex = players.length - 1;
    const match_player = players[targetPlayerIndex];

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
    let targetPlayerIndex = currentPlayerIndex + 1;
    if (targetPlayerIndex >= players.length) targetPlayerIndex = 0;
    const match_player = players[targetPlayerIndex];
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
  if (text.match(currentPlayerRegex)) {
    // Get player.
    const match_player = players[currentPlayerIndex];
    output.players.push(match_player);

    // Loop over card text and replace with player name.
    processed_text = processed_text.map((substring, index) => {
      if (typeof substring !== "string") return substring;
      if (!substring.match(currentPlayerRegex)) return substring;
      return (
        <var key={`${output.active_id}_self_${index}`}><u> {match_player.name}</u></var>
      );
    });
  }


  // Removed used players from list.
  players = players.filter((player) => output.players.findIndex((p) => p.id == player.id) === -1);

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

export default processCard;