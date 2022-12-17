import React, { PropsWithChildren } from "react";
import styles from "./button.module.scss";


const Button: React.FC<PropsWithChildren<Props>> = ({ children, variant = "primary", onClick = () => undefined }) => {

  return (
    <button
      className={styles.main}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Button };

interface Props {
  variant?: "primary" | "secondary";
  onClick?: () => void | Promise<void>;
}
