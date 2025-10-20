import { observer } from 'mobx-react-lite';
import styles from './KpiSection.module.scss';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { KpiCard } from './KpiCard';

export const KpiSection = observer(() => {
  const kpiList = employeeDetailStore.kpiList;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.title}>ЦКП: Сформированная отчетность вовремя и без ошибок</div>
        <div className={styles.subtitle}>Статистики:</div>
      </header>

      <div className={styles.grid}>
        {kpiList.map((kpi) => (
          <KpiCard key={kpi.guid} kpi={kpi} />
        ))}
      </div>
    </section>
  );
});

