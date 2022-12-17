import React from "react";
import styles from "./button.module.scss";


function ButtonComponent({ children, variant = "Primary", onClick = () => undefined }: Props) {

  return (<button className={styles.main} data-variant={variant} onClick={onClick}>{children}</button>);
}

export default ButtonComponent;

interface Props {
  children: string[] | JSX.Element[] | string | JSX.Element;
  variant?: "Primary" | "Secondary";
  onClick?: () => void
}
