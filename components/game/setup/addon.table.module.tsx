import { Card } from "@structs/card"
import { cardPack } from "@structs/pack"
import AddonComponent from "./addon.module"

function AddonTableComponent({ addons, activeAddons, currentCards, toggleAddon }: Props) {
    return (
        <table>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Cards</th>
                    <th>Description</th>
                </tr>
            </thead>

            <tbody>
                {addons.map(addon =>
                    <AddonComponent
                        key={addon.id}
                        addon={addon}
                        toggleAddon={toggleAddon}
                        selected={activeAddons.some(x => x.id == addon.id)}
                    />
                )}
            </tbody>

            <tfoot>
                <tr>
                    <th>{activeAddons.length} addons</th>
                    <th>{currentCards.length}</th>
                    <th>by {activeAddons.reduce((total, current) => { return total + (current.authors?.length ?? 0) }, 0)} authors</th>
                </tr>
            </tfoot>

        </table>
    )
}

export default AddonTableComponent

interface Props {
    addons: cardPack[];
    activeAddons: cardPack[];
    currentCards: Card[];
    toggleAddon: (addon: cardPack) => void
}