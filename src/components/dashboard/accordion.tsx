import styles from "./accordion.module.scss";
import * as Radix from "@radix-ui/react-accordion";
import React, { PropsWithChildren } from "react";
import { BsChevronDown } from "react-icons/bs";

const AccordionHeader = React.forwardRef<HTMLButtonElement, PropsWithChildren>(({ children, ...props }, ref) => (
  <Radix.Header className={styles.header}>
    <Radix.Trigger
      className={styles.trigger}
      {...props}
      ref={ref}
    >
      {children}
      <BsChevronDown className={styles.chevron} aria-hidden />
    </Radix.Trigger>
  </Radix.Header>
));

AccordionHeader.displayName = "AccordionTrigger";

const AccordionContent: React.FC<PropsWithChildren> = React.forwardRef<HTMLDivElement, PropsWithChildren>(({ children, ...props }, ref) => (
  <Radix.Content
    className={styles.content}
    {...props}
    ref={ref}
  >
    <div>
      {children}
    </div>
  </Radix.Content>
));

AccordionContent.displayName = "AccordionContent";


const AccordionItem: React.FC<PropsWithChildren<Props>> = ({ children, title }) => {
  return (
    <Radix.Item value={title}>
      <AccordionHeader>{title}</AccordionHeader>
      <AccordionContent>{children}</AccordionContent>
    </Radix.Item>
  );
};

export { AccordionItem };

interface Props {
  title: string;
}
