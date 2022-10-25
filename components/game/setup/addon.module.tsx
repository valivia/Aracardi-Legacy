import { cardPack } from "@structs/pack";
import styles from "./addon.module.scss";

function AddonComponent({ addon, toggleAddon, selected = false }: Props) {
    return (
        <tr
            className={styles.tr}
            onClick={() => toggleAddon(addon)}
            data-selected={selected}
        >
            <th>{addon.title}</th>
            <th>{addon.cards.length}</th>
            <th>{addon.description}</th>
        </tr>
    )
}

export default AddonComponent;

interface Props {
    addon: cardPack;
    toggleAddon: (addon: cardPack) => void;
    selected?: boolean;
}