import { Addon } from "@structs/addon";
import styles from "./addon.module.scss";

function AddonComponent({ addon, toggleAddon, selected = false }: Props) {
  return (
    <tr
      className={styles.tr}
      onClick={() => toggleAddon(addon)}
      data-selected={selected}
    >
      <th>{addon.title}</th>
      <th>{addon.card_count}</th>
      <th>{addon.description}</th>
    </tr>
  );
}

export default AddonComponent;

interface Props {
  addon: Addon;
  toggleAddon: (addon: Addon) => void;
  selected?: boolean;
}
