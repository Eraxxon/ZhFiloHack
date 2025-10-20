import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import styles from './KpiCard.module.scss';
import { employeeDetailStore, type KpiItem } from '@/stores/employeeDetailStore';
import { accountStore } from '@/stores/accountStore';

interface Props {
  kpi: KpiItem;
}

export const KpiCard = observer(({ kpi }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(kpi.factPercent.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isReadOnly = accountStore.isManager;

  const status = employeeDetailStore.getKpiStatus(kpi.planPercent, kpi.factPercent);
  const statusIcons = {
    green: 'check_circle',
    yellow: 'warning',
    red: 'error'
  };

  // Прогресс bar: план — это 100%, факт — относительно плана
  const progressPercent = kpi.planPercent > 0 
    ? Math.min(100, (kpi.factPercent / kpi.planPercent) * 100) 
    : 0;

  const handleEditClick = () => {
    setEditValue(kpi.factPercent.toString());
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Разрешаем только цифры и точку/запятую для десятичных чисел
    if (value === '' || /^\d*[.,]?\d*$/.test(value)) {
      // Убираем лидирующие нули, кроме случаев "0" или "0." или "0,"
      if (value.length > 1 && value[0] === '0' && value[1] !== '.' && value[1] !== ',') {
        value = value.replace(/^0+/, '');
      }
      
      setEditValue(value);
      
      // Проверяем значение в реальном времени
      const numValue = parseFloat(value.replace(',', '.'));
      if (value !== '' && !isNaN(numValue)) {
        if (numValue < 0) {
          setError('Значение не может быть меньше 0');
        } else if (numValue > 200) {
          setError('Значение не может быть больше 200');
        } else {
          setError(null);
        }
      } else if (value === '') {
        setError(null);
      }
    }
  };

  const handleSave = async () => {
    const value = parseFloat(editValue.replace(',', '.'));
    if (isNaN(value) || value < 0 || value > 200) {
      setError('Введите корректное значение (число от 0 до 200)');
      return;
    }

    setError(null);
    setIsUpdating(true);
    const success = await employeeDetailStore.updateKpiFact(kpi.guid, value, kpi.userGuid);
    setIsUpdating(false);

    if (success) {
      setIsEditing(false);
    } else {
      setError('Ошибка при обновлении. Попробуйте еще раз.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <article className={styles.card}>
        <div className={`${styles.statusIcon} ${styles[status]}`}>
          <span className="material-icons" style={{ fontSize: 18 }}>{statusIcons[status]}</span>
        </div>

        <div className={styles.name}>{kpi.name}</div>

        <div className={styles.row}>
          <span className={styles.label}>План: {kpi.planPercent}%</span>
          <span className={styles.label}>Факт: {kpi.factPercent}%</span>
        </div>

        <div className={styles.barWrap}>
          <div className={styles.barBg}>
            <div className={`${styles.barFill} ${styles[status]}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </article>

      {/* Серая панель с кнопкой-стрелкой */}
      <button 
        className={styles.toggleBtn}
        onClick={handleEditClick}
        title={isReadOnly ? "Недоступно" : "Редактировать факт"}
        disabled={isReadOnly}
      >
        <span className="material-icons">
          {isEditing ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Сообщение об ошибке над панелью */}
      {isEditing && error && (
        <div className={styles.errorMessage}>
          <span className="material-icons" style={{ fontSize: 16 }}>error</span>
          {error}
        </div>
      )}

      {/* Выдвижная панель редактирования */}
      {isEditing && (
        <div className={styles.editPanel}>
          <div className={styles.editContent}>
            <label className={styles.editLabel}>
              Факт (%)
              <input
                type="text"
                inputMode="decimal"
                className={`${styles.editInput} ${error ? styles.inputError : ''}`}
                value={editValue}
                onChange={handleInputChange}
                disabled={isUpdating}
                placeholder="0"
              />
            </label>
            <button 
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isUpdating || !!error}
            >
              {isUpdating ? 'Сохранение...' : 'Изменить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

