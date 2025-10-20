import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/modules/header/Header';
import { EmployeeDetailHeader } from '@/modules/employeeDetail/EmployeeDetailHeader';
import { TopInfoGrid } from '@/modules/employeeDetail/TopInfoGrid';
import { KpiSection } from '@/modules/employeeDetail/KpiSection';
import { DevPlanSection } from '@/modules/employeeDetail/DevPlanSection';
import { ProjectsSection } from '@/modules/employeeDetail/ProjectsSection';
import { CareerOpportunities } from '@/modules/employeeDetail/CareerOpportunities';
import { teamStore, type Subordinate } from '@/stores/teamStore';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { authStore } from '@/stores/authStore';
import { userStore } from '@/stores/userStore';
import { dashboardStore } from '@/stores/dashboardStore';
import { accountStore } from '@/stores/accountStore';
import styles from './EmployeeDetailPage.module.scss';

export const EmployeeDetailPage = observer(() => {
  const { guid } = useParams<{ guid: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Subordinate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!guid) {
        navigate('/');
        return;
      }

      // Сбрасываем KPI статистики и бонус при перезагрузке страницы
      await employeeDetailStore.resetAllKpiStats(guid);
      employeeDetailStore.resetBonus();

      // Если teamStore пуст (перезагрузка страницы), загружаем данные заново
      if (!teamStore.data) {
        // Проверяем авторизацию
        if (!authStore.isAuthenticated) {
          const success = await authStore.login('user11@mail.com', '122334');
          if (!success) {
            console.error('Ошибка авторизации');
            navigate('/');
            return;
          }
        }

        // Загружаем данные команды (guid руководителя захардкожен)
        const userGuid = 'd71aaa68-e868-4504-a210-ec3458dbb909';
        const loaded = await teamStore.fetchUserData(userGuid);
        if (!loaded) {
          console.error('Не удалось загрузить данные команды');
          navigate('/');
          return;
        }
      }

      // Проверяем что данные загружены
      if (!teamStore.data) {
        console.error('Данные команды не загружены');
        navigate('/');
        return;
      }

      // Синхронизируем данные для Dashboard
      dashboardStore.setTeamPlanPercent(teamStore.data.teamKpiAverage.avgFactPercent);
      
      // Обновляем userStore данными из accountStore (при перезагрузке)
      userStore.setUserData(
        accountStore.currentAccount.firstName,
        accountStore.currentAccount.lastName,
        accountStore.currentAccount.position
      );

      // Ищем сотрудника
      const found = teamStore.data.subordinates.find((emp) => emp.guid === guid);
      if (!found) {
        console.error('Сотрудник не найден');
        navigate('/');
        return;
      }
      setEmployee(found);
      
      // Загружаем все данные для этого сотрудника параллельно
      await Promise.all([
        employeeDetailStore.fetchKpiData(guid),
        employeeDetailStore.fetchDevPlanData(guid),
        employeeDetailStore.fetchProjectsData(guid)
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [guid, navigate]);

  if (isLoading || !employee) {
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
        <EmployeeDetailHeader employee={employee} />
        <TopInfoGrid userGuid={guid!} />
        <KpiSection />
        <div className={styles.sideBySide}>
          <DevPlanSection />
          <ProjectsSection />
        </div>
        <CareerOpportunities />
      </div>
    </>
  );
});

