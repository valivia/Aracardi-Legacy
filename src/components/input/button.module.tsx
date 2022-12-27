import React, { PropsWithChildren } from "react";
import styles from "./button.module.scss";


const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  size = "normal",
  variant = "primary",
  type = "button",
  onClick = () => undefined,
}) => {

  return (
    <button
      className={styles.main}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export { Button };

interface Props {
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  size?: "small" | "normal" | "big";
  onClick?: () => void | Promise<void>;
}
