import { Card } from "@structs/card";
import { Addon } from "@structs/addon";
import AddonComponent from "./addon.module";
import styles from "./addon_table.module.scss";


function AddonTableComponent({ addons, activeAddons, currentCards, toggleAddon }: Props) {
  return (
    <section className={styles.main}>
      <table className={styles.table}>

        <thead className={styles.header}>
          <tr>
            <th>Name</th>
            <th>Cards</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody className={styles.body}>
          {addons.map(addon =>
            <AddonComponent
              key={addon.id}
              addon={addon}
              toggleAddon={toggleAddon}
              selected={activeAddons.some(x => x.id == addon.id)}
            />
          )}
        </tbody>

        <tfoot className={styles.footer}>
          <tr>
            <th>{activeAddons.length} addons</th>
            <th>{currentCards.length}</th>
            <th>by {activeAddons.reduce((total, current) => { return total + (current.authors?.length ?? 0); }, 0)} authors</th>
          </tr>
        </tfoot>

      </table>
    </section>
  );
}

export default AddonTableComponent;

interface Props {
  addons: Addon[];
  activeAddons: Addon[];
  currentCards: Card[];
  toggleAddon: (addon: Addon) => void
}