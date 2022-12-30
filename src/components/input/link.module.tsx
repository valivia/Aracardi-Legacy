import React, { PropsWithChildren } from "react";
import styles from "./button.module.scss";
import NextLink from "next/link";


const Link: React.FC<PropsWithChildren<Props>> = ({ href,
  children,
  size = "normal",
  variant = "primary",
  onClick = () => undefined,
}) => {

  return (
    <NextLink
      href={href}
      className={styles.main}

      data-size={size}
      data-variant={variant}

      onClick={onClick}
    >
      {children}
    </NextLink>
  );
};

export { Link };

interface Props {
  href: string;
  variant?: "primary" | "secondary";
  size?: "small" | "normal" | "big";
  onClick?: () => void | Promise<void>;
}
