import styles from "./select.module.scss";
import * as Radix from "@radix-ui/react-select";
import React from "react";
import { BsCheck, BsChevronDown, BsChevronUp } from "react-icons/bs";

const Select: React.FC<SelectProps> = ({ defaultValue, value, onValueChange, disabled, items }) => {
  return (
    <Radix.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {/* Trigger */}
      <Radix.Trigger
        className={styles.trigger}
        disabled={disabled}
      >
        <Radix.Value />
        <Radix.Icon className={styles.icon}>
          <BsChevronDown />
        </Radix.Icon>
      </Radix.Trigger>

      {/* Content */}
      <Radix.Portal>
        <Radix.Content
          className={styles.content}
          onBlur={(e) => e.preventDefault()}
        >

          <Radix.ScrollUpButton className={styles.scrollButton}>
            <BsChevronUp />
          </Radix.ScrollUpButton>

          {/* Items */}
          <Radix.Viewport className={styles.viewport}>

            {items.map((item, index) => {
              return (
                <Radix.SelectItem
                  key={index}
                  value={item.value}
                  className={styles.item}
                >

                  <Radix.SelectItemText>
                    {item.label}
                  </Radix.SelectItemText>

                  <Radix.SelectItemIndicator className={styles.indicator}>
                    <BsCheck />
                  </Radix.SelectItemIndicator>

                </Radix.SelectItem>
              );
            })}

          </Radix.Viewport>

          <Radix.ScrollDownButton className={styles.scrollButton}>
            <BsChevronDown />
          </Radix.ScrollDownButton>

        </Radix.Content>
      </Radix.Portal>


    </Radix.Root>
  );
};

interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  items: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}


export { Select };
