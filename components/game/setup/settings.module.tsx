import onChangeParser from "@components/onchange";
import { Settings } from "@structs/game";

function SettingsComponent({ settings, setSettings }: Props) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const value = onChangeParser(target);

        setSettings({ ...settings, [target.name]: value })
    }


    return <>
        {Object.entries(settings).map(([key, value]) => {
            return (
                <fieldset key={key}>
                    <label htmlFor={key}>{key.replace("_", " ")}</label>
                    {typeof value == "boolean"
                        ? <input type="checkbox" id={key} name={key} onChange={onChange} defaultChecked={value} />
                        : <input type="number" id={key} name={key} onChange={onChange} value={value} />
                    }
                </fieldset>
            )
        })
        }
    </>
}

export default SettingsComponent;

interface Props {
    settings: Settings;
    setSettings: (x: Settings) => void;
}