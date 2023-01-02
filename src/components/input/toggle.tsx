import { ElementSize } from "@structs/size";
import React, { useRef } from "react";
import styles from "./toggle.module.scss";

function Toggle({
  label,
  name,
  disabled,
  size = "md",
  value,
  onChange,
}: Props) {
  const text = label ?? name;
  const input = useRef<HTMLInputElement>(null);

  return (
    <fieldset
      className={styles.main}
      data-disabled={disabled}
    >
      <label className={styles.label} htmlFor={name}>
        {text}
      </label>

      <label
        className={styles.switch}
        data-size={size}
        htmlFor={name}
      >
        <input
          ref={input}
          id={name}
          type="checkBox"
          name={name}
          disabled={disabled}
          onChange={onChange}
          defaultChecked={value}
          className={styles.input}
        />
        <span className={styles.indicator}></span>
      </label>

    </fieldset>
  );
}

export { Toggle };

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  value: boolean;
  size?: ElementSize;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
