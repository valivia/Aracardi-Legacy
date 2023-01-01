import React from "react";
import styles from "./header.module.scss";

const Header: React.FC<Props> = ({ title, description, avatar: Avatar }) => {
  return (
    <header className={styles.main}>
      {Avatar && <figure className={styles.avatar}><Avatar /></figure>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {description && <p className={styles.description}>{description}</p>}
      <hr className={styles.line} />
    </header>
  );
};

export { Header };

interface Props {
  title?: string;
  description?: string;
  avatar: any;
}
