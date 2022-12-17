import styles from "./tag.module.scss";

// TODO semantics?, tag size (only 24px rn)

function TagComponent({ children: input }: Props) {
  const children = input instanceof Array ? input : [input];
  let style = {};

  if (typeof children[0] === "object") style = { ...style, paddingLeft: 0 };
  if (typeof children[children.length - 1] === "object") style = { ...style, paddingRight: 0 };

  return (
    <div className={styles.main} style={style}>
      {children}
    </div>
  );
}

export default TagComponent;

interface Props {
  children: (JSX.Element | string)[] | string | JSX.Element
}
