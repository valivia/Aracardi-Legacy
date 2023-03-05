import styles from "./switch.module.scss";
import * as Radix from "@radix-ui/react-switch";
import React from "react";

const Switch: React.FC<Props> = ({
  label,
  name,
  disabled,
  value,
  onChange,
}: Props) => {
  const text = label ?? name;

  return (
    <div className={styles.main}>
      <label className={styles.label} htmlFor={name}>
        {text}
      </label>

      <Radix.Root
        id={name}
        name={name}
        checked={value}
        disabled={disabled}
        className={styles.root}
        onCheckedChange={onChange}
      >
        <Radix.Thumb className={styles.thumb} />
      </Radix.Root>


    </div>
  );
};

export { Switch };

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  value: boolean;
  onChange: (checked: boolean) => void
}
