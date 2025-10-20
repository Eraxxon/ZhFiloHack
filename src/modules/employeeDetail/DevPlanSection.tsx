import { observer } from 'mobx-react-lite';
import styles from './DevPlanSection.module.scss';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { DevPlanCard } from './DevPlanCard';

export const DevPlanSection = observer(() => {
  const items = employeeDetailStore.devPlanList;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.title}>Индивидуальный план развития</div>
      </header>

      <div className={styles.list}>
        {items.map((item) => (
          <DevPlanCard key={item.guid} item={item} />
        ))}
      </div>
    </section>
  );
});

