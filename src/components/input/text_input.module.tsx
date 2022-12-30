import React from "react";
import styles from "./text_input.module.scss";


const TextInput: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  size = "normal",
}) => {

  return (
    <input
      type={"search"}
      className={styles.main}
      placeholder={placeholder}
      value={value}
      onChange={onChange}

      data-size={size}
    />
  );
};

export { TextInput };

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "normal" | "big";
  placeholder: string;
}
