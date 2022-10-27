import styles from "./avatar.module.scss";

function AvatarComponent({ avatar: Avatar, canInteract = true }: Props) {
    return (
        <Avatar className={styles.main} data-can_interact={canInteract} />
    )
}

export default AvatarComponent;

interface Props {
    avatar: any;
    canInteract?: boolean;
    onClick?: () => void;
}