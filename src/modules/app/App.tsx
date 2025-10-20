import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styles from './App.module.scss';
import { appStore } from '@/stores/appStore';
import { Header } from '@/modules/header/Header';
import { TeamPlanCard } from '@/modules/dashboard/TeamPlanCard';
import { TeamSection } from '@/modules/team/TeamSection';
import { dashboardStore } from '@/stores/dashboardStore';
import { teamStore } from '@/stores/teamStore';
import { userStore } from '@/stores/userStore';

export const App = observer(() => {
  useEffect(() => {
    if (teamStore.data) {
      // Синхронизируем teamPlanPercent из teamKpiAverage
      dashboardStore.setTeamPlanPercent(teamStore.data.teamKpiAverage.avgFactPercent);
      // Синхронизируем данные пользователя (firstName, lastName, role.name)
      userStore.setUserData(
        teamStore.data.firstName,
        teamStore.data.lastName,
        teamStore.data.role.name
      );
    }
  }, []);

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