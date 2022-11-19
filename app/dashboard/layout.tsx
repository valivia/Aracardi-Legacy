import styles from "./layout.module.scss";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav></nav>
      {children}
    </section>
  );
}
