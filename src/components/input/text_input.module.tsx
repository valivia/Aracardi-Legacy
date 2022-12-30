import React from "react";
import styles from "./text_input.module.scss";


const TextInput: React.FC<Props> = ({
  placeholder,
  size = "normal",
}) => {

  return (
    <input
      type={"search"}
      className={styles.main}
      placeholder={placeholder}

      data-size={size}
    />
  );
};

export { TextInput };

interface Props {
  value: string;
  onChange: (e: any) => void;
  size?: "small" | "normal" | "big";
  placeholder: string;
}
