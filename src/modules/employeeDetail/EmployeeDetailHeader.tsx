import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeeDetailHeader.module.scss';
import type { Subordinate } from '@/stores/teamStore';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { accountStore } from '@/stores/accountStore';

interface Props {
  employee: Subordinate;
}

export const EmployeeDetailHeader = observer(({ employee }: Props) => {
  const navigate = useNavigate();
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const showBackButton = accountStore.isManager;

  return (
    <header className={styles.header}>
      {showBackButton && (
        <button type="button" className={styles.backBtn} onClick={() => navigate('/')}>
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
          <span>Назад</span>
        </button>
      )}

      <div className={styles.userRow}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.info}>
          <div className={styles.name}>{fullName}</div>
          <div className={styles.position}>Должность: {employee.role.name}</div>
        </div>
      </div>

      <div className={styles.marginCard}>
        <div className={styles.marginLabel}>Маржа компании</div>
        <div className={styles.marginValue}>{employeeDetailStore.companyMargin}%</div>
      </div>
    </header>
  );
});

