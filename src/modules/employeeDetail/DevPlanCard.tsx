import { observer } from 'mobx-react-lite';
import styles from './DevPlanCard.module.scss';
import type { DevPlanItem } from '@/stores/employeeDetailStore';

interface Props {
  item: DevPlanItem;
}

export const DevPlanCard = observer(({ item }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.name}>{item.name}</div>
      <div className={styles.progressRow}>
        <div className={styles.barBg}>
          <div className={styles.barFill} style={{ width: `${item.factPercent}%` }} />
        </div>
        <div className={styles.percent}>{item.factPercent}%</div>
      </div>
    </article>
  );
});

