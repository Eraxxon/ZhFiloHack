import { observer } from 'mobx-react-lite';
import styles from './TeamSection.module.scss';
import { teamStore, type EmployeeStatus } from '@/stores/teamStore';
import { EmployeeCard } from './EmployeeCard';

export const TeamSection = observer(() => {
  const count = teamStore.subordinatesCount;
  const employees = teamStore.filteredSubordinates;
  const filter = teamStore.statusFilter;

  const setFilter = (f: EmployeeStatus | 'all') => {
    teamStore.setStatusFilter(f);
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Моя команда ({count} сотрудников)</h2>
        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${styles.filterBtnIcon} ${styles.green} ${filter === 'green' ? styles.active : ''}`}
            onClick={() => setFilter('green')}
            aria-label="Зеленый статус"
          >
            <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${styles.filterBtnIcon} ${styles.yellow} ${filter === 'yellow' ? styles.active : ''}`}
            onClick={() => setFilter('yellow')}
            aria-label="Желтый статус"
          >
            <span className="material-icons" style={{ fontSize: 18 }}>warning</span>
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${styles.filterBtnIcon} ${styles.red} ${filter === 'red' ? styles.active : ''}`}
            onClick={() => setFilter('red')}
            aria-label="Красный статус"
          >
            <span className="material-icons" style={{ fontSize: 18 }}>error</span>
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {employees.map((emp) => (
          <EmployeeCard key={emp.guid} employee={emp} />
        ))}
      </div>
    </section>
  );
});

