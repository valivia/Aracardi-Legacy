import * as Radix from "@radix-ui/react-slider";
import React from "react";
import styles from "./slider.module.scss";


const Slider: React.FC<Props> = ({
  name,

  defaultValue,
  value,
  onValueChange,

  max,
  min,

  step,
  minStepsBetweenThumbs = 2,

  disabled = false,
  inverted = false,
}) => {
  value = value ?? defaultValue ?? [min];

  return (
    <Radix.Root
      className={styles.root}
      name={name}

      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}

      max={max}
      min={min}

      step={step}
      minStepsBetweenThumbs={minStepsBetweenThumbs}

      disabled={disabled}

      inverted={inverted}
    >

      <Radix.Track className={styles.track}>
        <Radix.Range className={styles.range} />
      </Radix.Track>

      <Radix.Thumb className={styles.thumb} />

      {value?.length > 1 &&
        <Radix.Thumb className={styles.thumb} />
      }

    </Radix.Root>

  );
};

export { Slider };

interface Props {
  name?: string;

  defaultValue?: number[];
  value?: number[];
  onValueChange?: (values: number[]) => void;

  max: number;
  min: number;

  step?: number;
  minStepsBetweenThumbs?: number;

  disabled?: boolean;
  inverted?: boolean;
}
