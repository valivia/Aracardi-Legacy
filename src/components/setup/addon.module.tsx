import { Tag } from "@components/global/tag.module";
import { faker } from "@faker-js/faker";
import prisma from "@prisma/client";
import React, { useMemo } from "react";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import styles from "./addon.module.scss";

// TODO display correct card count. keyboard accessibility (keydown and infinite load?)

const Addon: React.FC<Props> = ({ addon, active, onClick }) => {
  const avatar = useMemo(() => faker.image.abstract(640, 640, true), []);
  return (
    <article
      className={styles.main}
      onClick={onClick}
      tabIndex={0}
    >

      {/* Addon avatar */}
      <img className={styles.avatar} src={avatar} alt="" />

      {/* Title, card count and tags */}
      <section className={styles.info}>

        <h2>{addon.title}</h2>

        <section className={styles.tags}>
          <Tag><BsWifi />125</Tag>
          <Tag><BsWifiOff />125</Tag>
          {addon.is_official && <Tag>Official</Tag>}
        </section>

      </section>

      {/* Selection indicator */}
      {typeof active === "boolean" && <div className={styles.indicator} data-active={active}></div>}
    </article>
  );
};

export { Addon };

interface Props {
  addon: prisma.Addon;
  onClick?: () => void | Promise<void>;
  active?: boolean;
}
