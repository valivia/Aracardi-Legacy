import { memo, useEffect, useState } from "react";
import styles from "./avatar.module.scss";

const Avatar = memo<Props>(({ id }) => {
  const [element, setElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    import(`@public/avatars/${id || "marceline"}.svg`).then((res) => {
      const Icon = res.default as React.ComponentType<JSX.IntrinsicElements["svg"]>;
      setElement(<Icon className={styles.main} />);
    });
  }, [id]);

  return element;
});

Avatar.displayName = "Avatar";

export { Avatar };

interface Props {
  id?: string | null;
}
