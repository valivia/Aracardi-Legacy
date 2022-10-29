import { Game, Settings } from "@structs/game";
import styles from "./setup.module.scss";
import React, { useEffect, useState } from "react";
import { Addon } from "@structs/addon";
import { Card } from "@structs/card";
import { Scene } from "@structs/scene";
import AddonTableComponent from "./setup/addon_table.module";
import SettingsComponent from "./setup/settings.module";

function SetupScene({ settings, addons, setSettings, setCards, setScene }: Props) {
  const [activeAddons, setActiveAddons] = useState<Addon[]>(addons.filter(x => true));
  const [currentCards, setCurrentCards] = useState<Card[]>([]);

  useEffect(() => {
    const cards = activeAddons
      .reduce<Card[]>((total, addon) => { return total.concat(addon.cards) }, [])
      .filter(x => !(!settings.allow_nsfw && x.is_nsfw))
    setCurrentCards(cards);
  }, [settings, activeAddons]);

  const toggleAddon = (addon: Addon) => {
    let newCards = [];
    if (activeAddons.some(x => addon.id === x.id))
      newCards = activeAddons.filter(x => addon.id !== x.id);
    else
      newCards = activeAddons.concat([addon]);


    setActiveAddons(newCards);
  }

  const nextScene = () => {
    if (currentCards.length < 50) return alert("Not enough cards (50 minimum)")
    setCards(currentCards);
    setScene(Scene.POPULATE);
  }

  return (
    <main className={styles.main}>

      <section className={styles.settings}>
        <h2>Settings</h2>
        <SettingsComponent
          settings={settings}
          setSettings={setSettings}
        />
      </section>

      <section className={styles.addons}>
        <h2>Addons</h2>
        <AddonTableComponent
          addons={addons}
          activeAddons={activeAddons}
          currentCards={currentCards}
          toggleAddon={toggleAddon}
        />
      </section>

      <section className={styles.button}>
        <button onClick={() => nextScene()}>Load Game</button>
      </section>
    </main>
  )
}

export default SetupScene;

interface Props {
  settings: Settings;
  addons: Addon[];
  setSettings: (x: Settings) => void;
  setCards: (cards: Card[]) => void;
  setScene: (scene: Scene) => void;
}