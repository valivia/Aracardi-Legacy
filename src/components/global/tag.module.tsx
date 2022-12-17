import { PropsWithChildren } from "react";
import styles from "./tag.module.scss";

// TODO semantics?, tag size (only 24px rn)

const Tag: React.FC<PropsWithChildren> = ({ children: input }) => {
  const children = Array.isArray(input) ? input : [input];

  // Remove padding if icon borders sides.
  const style = {
    paddingLeft: typeof children[0] === "object" ? 0 : undefined,
    paddingRight: typeof children[children.length - 1] === "object" ? 0 : undefined,
  };

  return (
    <div className={styles.main} style={style}>
      {children}
    </div>
  );
};

export { Tag };
