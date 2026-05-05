import { NavLink } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚡</span>
          <span className={styles.brandName}>InterviewIQ</span>
        </div>
        <div className={styles.links}>
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Practice
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Dashboard
          </NavLink>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
