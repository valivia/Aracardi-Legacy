import type { NextPage } from 'next'
import styles from "./game.module.scss";
import SetupScene from '@components/game/setup.module';
import GameScene from '@components/game/ongoing.module';
import PopulateScene from '@components/game/populate.module';
import games from "../../data/games.json";
import { useState } from 'react';
import LayoutComponent from '@components/global/layout.module';

// Types
import { Settings } from '@structs/game';
import { Player } from '@structs/player';
import { Card } from '@structs/card';
import { Scene } from '@structs/scene';
import shuffle from '@components/shuffle';

const DEFAULT_SETTINGS: Settings = {
    allow_nsfw: false,
    display_images: true,
    loop_cards: true,
    turn_multiplier: 1.0,
    timer_multiplier: 1.0,
    backlog_percentage: 0.85,
}

const Game: NextPage = () => {
    const game = games[0];

    const [scene, setScene] = useState<Scene>(Scene.SETUP);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [players, setPlayers] = useState<Player[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    const addPlayer = (player: Player) => {
        if (player.name.length < 2) return false;
        if (players.some(x => x.name == player.name)) return false;
        setPlayers(players => [...players, player]);
        return true;
    }

    const shufflePlayers = () => setPlayers(shuffle([...players]));

    const removePlayer = (player: Player) => setPlayers(players => players.filter(x => x.name !== player.name));

    if (scene === Scene.SETUP) return (
        <LayoutComponent game={game}>
            <SetupScene
                game={game}
                settings={settings}
                setSettings={setSettings}
                setCards={setCards}
                setScene={setScene}
            />
        </LayoutComponent>
    )

    if (scene === Scene.POPULATE) return (
        <LayoutComponent game={game}>
            <PopulateScene
                players={players}
                addPlayer={addPlayer}
                removePlayer={removePlayer}
                setScene={setScene}
            />
        </LayoutComponent>
    )

    if (scene === Scene.ONGOING) return (
        <LayoutComponent game={game}>
            <GameScene
                players={players}
                addPlayer={addPlayer}
                removePlayer={removePlayer}
                shufflePlayers={shufflePlayers}
                settings={settings}
                cards={cards}
            />
        </LayoutComponent>
    )

    return <div>Error</div>
}

export default Game