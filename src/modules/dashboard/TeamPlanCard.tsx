import { observer } from 'mobx-react-lite';
import styles from './TeamPlanCard.module.scss';
import { dashboardStore } from '@/stores/dashboardStore';

export const TeamPlanCard = observer(() => {
  const value = dashboardStore.teamPlanPercent;
  const display = `${value}%`;
  return (
    <section className={styles.card} aria-label="План работы команды">
      <div>
        <div className={styles.title}>План работы команды</div>
        <div className={styles.percent}>{display}</div>
      </div>
      <div className={styles.icon} aria-hidden>
        <span className="material-icons">insert_chart_outlined</span>
      </div>
      <div className={styles.barWrap}>
        <div className={styles.barBg}>
          <div className={styles.barFill} style={{ width: `${value}%` }} />
        </div>
      </div>
    </section>
  );
});


