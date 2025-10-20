import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeeCard.module.scss';
import { teamStore, type Subordinate } from '@/stores/teamStore';

interface Props {
  employee: Subordinate;
}

export const EmployeeCard = observer(({ employee }: Props) => {
  const navigate = useNavigate();
  const status = teamStore.getEmployeeStatus(employee.avgPlanPercent, employee.avgFactPercent);
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();

  const statusIcons = {
    green: 'check_circle',
    yellow: 'warning',
    red: 'error'
  };

  // Проверяем, является ли это Никита Никитич (по GUID)
  const isClickable = employee.guid === '57f10bf8-3340-4ded-98be-27d85a9417d9';

  const handleClick = () => {
    if (isClickable) {
      navigate(`/employee/${employee.guid}`);
    }
  };

  return (
    <article 
      className={`${styles.card} ${isClickable ? styles.clickable : styles.disabled}`} 
      onClick={handleClick}
    >
      <div className={`${styles.statusIcon} ${styles[status]}`}>
        <span className="material-icons" style={{ fontSize: 18 }}>{statusIcons[status]}</span>
      </div>

      <div className={styles.avatar}>{initials}</div>

      <div className={styles.name}>
        {employee.firstName} {employee.lastName}
      </div>
      <div className={styles.position}>{employee.role.name}</div>

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>План</span>
          <span className={styles.statValue}>{employee.avgPlanPercent}%</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Факт</span>
          <span className={styles.statValue}>{employee.avgFactPercent}%</span>
        </div>
      </div>
    </article>
  );
});

