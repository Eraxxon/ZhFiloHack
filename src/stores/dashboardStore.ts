import { makeAutoObservable } from 'mobx';

class DashboardStore {
  teamPlanPercent = 78; // мок: будет приходить с бэка

  constructor() {
    makeAutoObservable(this);
  }

  setTeamPlanPercent(value: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    this.teamPlanPercent = clamped;
  }
}

export const dashboardStore = new DashboardStore();


