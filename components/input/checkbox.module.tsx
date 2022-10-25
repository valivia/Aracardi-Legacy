import styles from "./checkbox.module.scss";

function CheckBoxComponent({ text: inputText, name, value, onChange }: Props) {
    const text = inputText ?? name;
    return (
        <fieldset className={styles.main}>
            <label
                className={styles.label}
                htmlFor={name}
            >
                {text}
            </label>

            <input
                id={name}
                type="checkBox"
                name={name}
                onChange={onChange}
                defaultChecked={value}
                className={styles.input}
            />

            <span className={styles.checkbox}></span>
        </fieldset>
    )
}

export default CheckBoxComponent;

interface Props {
    text?: string;
    name: string;
    value: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}