import TagComponent from "@components/global/tag.module";
import { faker } from "@faker-js/faker";
import { Addon } from "@prisma/client";
import React, { useMemo } from "react";
import { BsWifi, BsWifiOff } from "react-icons/bs";
import styles from "./addon.module.scss";

// TODO display correct card count.

function AddonComponent({ addon, active, onclick }: Props) {
  const avatar = useMemo(() => faker.image.abstract(640, 640, true), []);
  return (
    <article className={styles.main} onClick={onclick}>
      {/* Addon avatar */}
      <img className={styles.avatar} src={avatar} alt="a" />

      {/* Title, card count and tags */}
      <section className={styles.info}>

        <h1>{addon.title}</h1>

        <section className={styles.tags}>
          <TagComponent><BsWifi />125</TagComponent>
          <TagComponent><BsWifiOff />125</TagComponent>
          {addon.is_official && <TagComponent>Official</TagComponent>}
        </section>

      </section>

      {/* Selection indicator */}
      {typeof active === "boolean" && <div className={styles.indicator} data-active={active}></div>}
    </article >
  );
}

export default AddonComponent;

interface Props {
  addon: Addon;
  onclick?: () => void;
  active?: boolean;
}
