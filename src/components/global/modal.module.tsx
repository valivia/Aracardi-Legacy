import styles from "./modal.module.scss";

function ModalComponent({ onClose, children }: Props) {

  return (
    <div className={styles.main} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default ModalComponent;
interface Props {
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}