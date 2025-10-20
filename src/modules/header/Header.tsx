import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { userStore } from '@/stores/userStore';
import { accountStore } from '@/stores/accountStore';
import { authStore } from '@/stores/authStore';
import { teamStore } from '@/stores/teamStore';
import { employeeDetailStore } from '@/stores/employeeDetailStore';

export const Header = observer(() => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAccountSwitch = async (guid: string) => {
    const account = accountStore.accounts.find(acc => acc.guid === guid);
    if (!account) return;

    // Если переключаемся на Васю (менеджера), сбрасываем все статистики Никиты
    if (account.role === 'manager') {
      const nikitaGuid = '57f10bf8-3340-4ded-98be-27d85a9417d9'; // GUID Никиты
      await employeeDetailStore.resetAllKpiStats(nikitaGuid);
    }

    // Сбрасываем все данные сотрудника перед переключением
    employeeDetailStore.resetAllData();

    // Переключаем роль
    accountStore.switchAccount(account.role);
    
    // Обновляем userStore сразу
    userStore.setUserData(account.firstName, account.lastName, account.position);
    
    // Авторизуемся под новым аккаунтом
    const success = await authStore.login(account.email, account.password);
    if (success) {
      // Загружаем данные для нового аккаунта
      if (account.role === 'manager') {
        await teamStore.fetchUserData(account.guid);
        navigate('/');
      } else {
        await teamStore.fetchUserData('d71aaa68-e868-4504-a210-ec3458dbb909');
        // Перезагружаем свежие данные сотрудника с сервера
        await Promise.all([
          employeeDetailStore.fetchKpiData(account.guid),
          employeeDetailStore.fetchDevPlanData(account.guid),
          employeeDetailStore.fetchProjectsData(account.guid)
        ]);
        navigate(`/employee/${account.guid}`);
      }
    }
    
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className="material-icons" aria-hidden>rocket</span>
          <span>Навигатор развития</span>
        </div>

        <div className={styles.roleRow}>
          <div className={styles.userBox}>
            <div className={styles.fullName}>{userStore.fullName}</div>
            <div className={styles.position}>Должность: {userStore.position}</div>
          </div>
          
          <div className={styles.avatarGroup} ref={dropdownRef}>
            <div className={styles.avatar} title="Профиль" aria-label="Профиль">
              <span className="material-icons" style={{ fontSize: 20 }}>person</span>
            </div>
            
            <button 
              className={styles.switchBtn}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Сменить аккаунт"
            >
              <span className="material-icons">swap_horiz</span>
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdown}>
                {accountStore.accounts.map(account => (
                  <div
                    key={account.guid}
                    className={`${styles.dropdownItem} ${accountStore.currentAccount.guid === account.guid ? styles.active : ''}`}
                    onClick={() => handleAccountSwitch(account.guid)}
                  >
                    <div className={styles.accountAvatar}>
                      {account.firstName[0]}{account.lastName[0]}
                    </div>
                    <div className={styles.accountInfo}>
                      <div className={styles.accountName}>{account.firstName} {account.lastName}</div>
                      <div className={styles.accountRole}>{account.position}</div>
                    </div>
                    {accountStore.currentAccount.guid === account.guid && (
                      <span className="material-icons" style={{ fontSize: 18, color: '#10b981' }}>check</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});



