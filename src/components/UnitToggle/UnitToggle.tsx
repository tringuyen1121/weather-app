import { useUnit } from "../../context/UnitContext";
import styles from "./UnitToggle.module.scss";

const UnitToggle = () => {
  const { isMetric, toggleUnits } = useUnit();

  return (
    <button
      className={styles.toggle}
      onClick={toggleUnits}
      aria-label={`Switch to ${isMetric ? "imperial" : "metric"} units`}
      title={`Switch to ${isMetric ? "imperial" : "metric"} units`}
    >
      <span className={`${styles.option} ${isMetric ? styles.active : ""}`}>
        °C
      </span>
      <span className={styles.divider} aria-hidden="true">
        |
      </span>
      <span className={`${styles.option} ${!isMetric ? styles.active : ""}`}>
        °F
      </span>
    </button>
  );
};

export default UnitToggle;
