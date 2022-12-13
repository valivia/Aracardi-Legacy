import CheckBoxComponent from "src/components/input/checkbox.module";
import onChangeParser from "@components/functions/onchange";
import { Settings } from "@structs/game";

function SettingsComponent({ settings, setSettings }: Props) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = onChangeParser(target);

    setSettings({ ...settings, [target.name]: value });
  };


  return <>
    <CheckBoxComponent
      name={"allow_nsfw"}
      onChange={onChange}
      value={settings.allow_nsfw}
    />

    <CheckBoxComponent
      name={"display_images"}
      onChange={onChange}
      value={settings.display_images}
    />

    <CheckBoxComponent
      name={"loop_cards"}
      onChange={onChange}
      value={settings.loop_cards}
    />

    {/* <NumberInputComponent
            name={"turn_multiplier"}
            onChange={onChange}
            value={settings.turn_multiplier}

            step={0.05}
            min={0.5}
            max={2}
        />

        <NumberInputComponent
            name={"timer_multiplier"}
            onChange={onChange}
            value={settings.timer_multiplier}

            step={0.05}
            min={0.5}
            max={2}
        />

        <NumberInputComponent
            name={"backlog_percentage"}
            onChange={onChange}
            value={settings.backlog_percentage}

            step={0.05}
            min={0.2}
            max={0.90}
        /> */}
  </>;
}

export default SettingsComponent;

interface Props {
  settings: Settings;
  setSettings: (x: Settings) => void;
}