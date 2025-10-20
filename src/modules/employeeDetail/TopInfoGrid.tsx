import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import styles from './TopInfoGrid.module.scss';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { accountStore } from '@/stores/accountStore';

interface Props {
  userGuid: string;
}

export const TopInfoGrid = observer(({ userGuid }: Props) => {
  const store = employeeDetailStore;
  const [isResetting, setIsResetting] = useState(false);
  const isReadOnly = accountStore.isManager;

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Разрешаем только пустую строку или числа
    if (val === '') {
      store.setSalary(null);
      return;
    }
    
    // Проверяем, что введены только цифры
    if (!/^\d+$/.test(val)) {
      return; // Игнорируем ввод
    }
    
    // Убираем лидирующие нули (кроме самого "0")
    if (val.length > 1 && val[0] === '0') {
      val = val.replace(/^0+/, '');
      if (val === '') {
        val = '0';
      }
    }
    
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      store.setSalary(num);
    }
  };

  const handleCalculate = () => {
    store.calculateBonus();
  };

  const handleReset = async () => {
    setIsResetting(true);
    const success = await store.resetAllKpiStats(userGuid);
    setIsResetting(false);
    
    if (success) {
      // Очищаем оклад и бонус
      store.resetBonus();
    } else {
      alert('Ошибка при сбросе статистик. Попробуйте еще раз.');
    }
  };

  return (
    <div className={styles.grid}>
      {/* Мой оклад */}
      <div className={styles.card}>
        <div className={styles.label}>Мой оклад</div>
        <input
          type="text"
          inputMode="numeric"
          className={styles.input}
          value={store.salary ?? ''}
          onChange={handleSalaryChange}
          placeholder="0"
          disabled={isReadOnly}
        />
      </div>

      {/* Моя полугодовая */}
      <div className={`${styles.card} ${styles.bonusCard}`}>
        <div className={styles.bonusLabel}>Моя полугодовая</div>
        <div className={styles.bonusRow}>
          <span className={styles.bonusPercent}>{store.calculatedBonusPercent}%</span>
          <span className={styles.bonusAmount}>{store.calculatedBonusAmount.toLocaleString()} ₽</span>
        </div>
        <div className={styles.bonusButtons}>
          <button 
            className={`${styles.bonusBtn} ${styles.bonusBtnSave}`}
            onClick={handleCalculate}
            disabled={isReadOnly}
          >
            Рассчитать
          </button>
          <button 
            className={`${styles.bonusBtn} ${styles.bonusBtnReset}`}
            onClick={handleReset}
            disabled={isResetting || isReadOnly}
          >
            {isResetting ? 'Сброс...' : 'Сбросить'}
          </button>
        </div>
      </div>

      {/* Коэффициенты */}
      <div className={`${styles.card} ${styles.coefCard}`}>
        <div className={styles.coefItem}>
          <span className={styles.coefLabel}>Статистики</span>
          <span className={styles.coefValue}>{store.coefficient}</span>
        </div>
        <div className={styles.coefItem}>
          <span className={styles.coefLabel}>Проекты</span>
          <span className={styles.coefValue}>{store.projectCoefficient}</span>
        </div>
        <div className={styles.coefItem}>
          <span className={styles.coefLabel}>ИПР</span>
          <span className={styles.coefValue}>{store.devPlanCoef}</span>
        </div>
      </div>
    </div>
  );
});
