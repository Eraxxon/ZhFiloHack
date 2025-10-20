import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';

export type EmployeeStatus = 'green' | 'yellow' | 'red';

export interface Role {
  id: number;
  name: string;
  keyWord: string;
}

export interface Subordinate {
  guid: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: Role;
  avgPlanPercent: number;
  avgFactPercent: number;
}

export interface TeamData {
  guid: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  managerGuid: string;
  role: Role;
  subordinates: Subordinate[];
  teamKpiAverage: { avgFactPercent: number };
  createdAt: string;
  updatedAt: string;
}

class TeamStore {
  data: TeamData | null = null;
  statusFilter: EmployeeStatus | 'all' = 'all';

  constructor() {
    makeAutoObservable(this);
    // loadMockData вызовется только если нет реальных данных
  }

  async fetchUserData(guid: string) {
    try {
      const { data } = await http.get<TeamData>(`/api/user/v1/${guid}`);
      runInAction(() => {
        this.data = data;
      });
      return true;
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      return false;
    }
  }

  loadMockData() {
    // Мок данных на основе JSON
    this.data = {
      guid: 'ab0f000b-b5d8-422b-a9b0-53661c82d41e',
      email: 'user1@test.ru',
      firstName: 'Роман',
      lastName: 'Васенин',
      roleId: 1,
      managerGuid: '',
      role: { id: 1, name: 'Руководитель', keyWord: 'lead' },
      subordinates: [
        {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2,
          role: { id: 2, name: 'Разработчик', keyWord: 'proger' },
          avgPlanPercent: 86,
          avgFactPercent: 75.67
        },
        {
          guid: '637b351c-8b7a-401d-bf94-0d65975648f5',
          email: 'user3@test.ru',
          firstName: 'Александр',
          lastName: 'Бровцын',
          roleId: 2,
          role: { id: 2, name: 'Разработчик', keyWord: 'proger' },
          avgPlanPercent: 80,
          avgFactPercent: 45
        },
        {
          guid: '994c9109-74be-434e-a7c4-a97b5b1a20c0',
          email: 'user4@test.ru',
          firstName: 'Данил',
          lastName: 'Плотников',
          roleId: 2,
          role: { id: 2, name: 'Разработчик', keyWord: 'proger' },
          avgPlanPercent: 70,
          avgFactPercent: 25
        }
      ],
      teamKpiAverage: { avgFactPercent: 25.22 },
      createdAt: '2025-10-17T07:24:38.153Z',
      updatedAt: '2025-10-17T07:24:38.153Z'
    };
  }

  setStatusFilter(filter: EmployeeStatus | 'all') {
    this.statusFilter = filter;
  }

  getEmployeeStatus(plan: number, fact: number): EmployeeStatus {
    if (plan === 0) return 'red';
    const ratio = fact / plan;
    if (ratio >= 0.85) return 'green';
    if (ratio >= 0.5) return 'yellow';
    return 'red';
  }

  get filteredSubordinates() {
    if (!this.data) return [];
    const { subordinates } = this.data;
    if (this.statusFilter === 'all') return subordinates;
    return subordinates.filter((emp) => {
      const status = this.getEmployeeStatus(emp.avgPlanPercent, emp.avgFactPercent);
      return status === this.statusFilter;
    });
  }

  get subordinatesCount() {
    return this.data?.subordinates.length ?? 0;
  }
}

export const teamStore = new TeamStore();

