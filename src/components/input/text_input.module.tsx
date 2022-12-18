import React from "react";
import styles from "./text_input.module.scss";


const TextInput: React.FC<Props> = ({ placeholder }) => {

  return (
    <input
      type={"search"}
      className={styles.main}
      placeholder={placeholder}
    />
  );
};

export { TextInput };

interface Props {
  value: string;
  onChange: (e: any) => void;

  placeholder: string;
}
