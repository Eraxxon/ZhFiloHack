import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/modules/header/Header';
import { TeamPlanCard } from '@/modules/dashboard/TeamPlanCard';
import { TeamSection } from '@/modules/team/TeamSection';
import { dashboardStore } from '@/stores/dashboardStore';
import { teamStore } from '@/stores/teamStore';
import { userStore } from '@/stores/userStore';
import { authStore } from '@/stores/authStore';
import { accountStore } from '@/stores/accountStore';
import styles from './DashboardPage.module.scss';

export const DashboardPage = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initData = async () => {
      // Если пользователь - сотрудник, редиректим на его страницу
      if (accountStore.isEmployee) {
        navigate(`/employee/${accountStore.currentAccount.guid}`);
        return;
      }

      // Автоматический логин с тестовыми данными
      if (!authStore.isAuthenticated) {
        const success = await authStore.login(accountStore.currentAccount.email, accountStore.currentAccount.password);
        if (!success) {
          console.error('Ошибка авторизации');
          setIsLoading(false);
          return;
        }
      }

      // Получаем данные пользователя (guid захардкожен, но можно вытащить из токена)
      const userGuid = accountStore.currentAccount.guid;
      const loaded = await teamStore.fetchUserData(userGuid);
      
      if (loaded && teamStore.data) {
        // Синхронизируем teamPlanPercent из teamKpiAverage
        dashboardStore.setTeamPlanPercent(teamStore.data.teamKpiAverage.avgFactPercent);
        // Синхронизируем данные пользователя
        userStore.setUserData(
          teamStore.data.firstName,
          teamStore.data.lastName,
          teamStore.data.role.name
        );
      }
      setIsLoading(false);
    };

    initData();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={`container ${styles.wrapper}`}>
          <p>Загрузка данных...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`container ${styles.wrapper}`}>
        <TeamPlanCard />
        <TeamSection />
      </div>
    </>
  );
});

