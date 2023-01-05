import Prisma from "@prisma/client";
import React from "react";
import styles from "./user.module.scss";
import { BsGear } from "react-icons/bs";

const User: React.FC<Props> = ({ user, role, canEdit, avatar: Avatar }) => {
  return (
    <li className={styles.main}>
      <figure className={styles.avatar}><Avatar /></figure>
      <p className={styles.name}>{user.name}</p>
      {/* TODO roles */}
      <p className={styles.role}>{role}</p>
      {canEdit && <div className={styles.icon}><BsGear /></div>}
    </li>
  );
};

export { User };

interface Props {
  user: Prisma.User
  role: string;
  avatar: React.FC;
  canEdit: boolean;
}
