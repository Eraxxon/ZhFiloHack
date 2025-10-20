import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';

export interface KpiItem {
  guid: string;
  userGuid: string;
  name: string;
  planPercent: number;
  factPercent: number;
  user: {
    guid: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KpiApiResponse {
  coefficient: number;
  statistics: KpiItem[];
}

export interface DevPlanApiResponse {
  coefficient: number;
  developmentPlans: DevPlanItem[];
}

export interface ProjectApiResponse {
  coefficient: number;
  projects: ProjectItem[];
}

export interface DevPlanItem {
  guid: string;
  userGuid: string;
  name: string;
  planPercent: number;
  factPercent: number;
  user: {
    guid: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  guid: string;
  userGuid: string;
  name: string;
  planNumber: number;
  factNumber: number;
  user: {
    guid: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  createdAt: string;
  updatedAt: string;
}

class EmployeeDetailStore {
  // Константа
  companyMargin = 99;
  
  // Инпуты
  salary: number | null = null;
  calculatedBonusPercent: number = 0;
  calculatedBonusAmount: number = 0;
  
  // KPI данные
  coefficient = 0;
  kpiList: KpiItem[] = [];
  
  // План развития
  devPlanCoef = 0;
  devPlanList: DevPlanItem[] = [];
  
  // Проекты
  projectCoefficient = 0;
  projectsList: ProjectItem[] = [];

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    // Мок данные загрузятся только если не будет реального вызова API
  }

  async fetchKpiData(userGuid: string) {
    this.isLoading = true;
    try {
      const { data } = await http.get<KpiApiResponse>(
        `/api/kpi/v1/list?userGuid=${userGuid}`
      );
      runInAction(() => {
        this.coefficient = data.coefficient;
        this.kpiList = data.statistics;
      });
      return true;
    } catch (error) {
      console.error('Ошибка загрузки KPI данных:', error);
      // В случае ошибки загружаем мок данные
      this.loadMockKpi();
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Метод для обновления факта KPI
  async updateKpiFact(kpiGuid: string, factPercent: number, userGuid: string) {
    try {
      console.log('Отправка запроса на обновление KPI:', {
        url: `/api/kpi/v1/${kpiGuid}`,
        method: 'PUT',
        body: { factPercent }
      });
      
      const response = await http.put(`/api/kpi/v1/${kpiGuid}`, {
        factPercent
      });
      
      console.log('Ответ сервера:', response);
      
      // После успешного обновления перезагружаем данные KPI
      await this.fetchKpiData(userGuid);
      return true;
    } catch (error: any) {
      console.error('Ошибка обновления KPI:', error);
      console.error('Детали ошибки:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      return false;
    }
  }

  // Метод для сброса всех статистик к начальным значениям
  async resetAllKpiStats(userGuid: string) {
    try {
      // Массив с захардкоженными значениями для сброса
      const resetData = [
        { guid: '0b3a55c8-94a5-49de-bd5a-58b9f3668014', factPercent: 35 },
        { guid: 'ac76c513-32f6-40c9-bbec-4a100ebfb6fc', factPercent: 95 },
        { guid: '19c9c9f6-2c8d-42fb-b10c-db04d68c29fc', factPercent: 60 },
        // Добавьте сюда все нужные статистики
      ];

      console.log('Начинается сброс всех статистик...');

      // Отправляем все запросы параллельно
      const promises = resetData.map(item => 
        http.put(`/api/kpi/v1/${item.guid}`, {
          factPercent: item.factPercent
        }).catch(err => {
          console.error(`Ошибка сброса статистики ${item.guid}:`, err);
          return null;
        })
      );

      await Promise.all(promises);
      
      console.log('Все статистики сброшены, обновляем данные...');

      // После сброса перезагружаем данные KPI
      await this.fetchKpiData(userGuid);
      return true;
    } catch (error) {
      console.error('Ошибка при сбросе статистик:', error);
      return false;
    }
  }

  async fetchDevPlanData(userGuid: string) {
    this.isLoading = true;
    try {
      const { data } = await http.get<DevPlanApiResponse>(
        `/api/development/v1/list?userGuid=${userGuid}`
      );
      runInAction(() => {
        this.devPlanCoef = data.coefficient;
        this.devPlanList = data.developmentPlans;
      });
      return true;
    } catch (error) {
      console.error('Ошибка загрузки данных Плана развития:', error);
      // В случае ошибки загружаем мок данные
      this.loadMockDevPlan();
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchProjectsData(userGuid: string) {
    this.isLoading = true;
    try {
      const { data } = await http.get<ProjectApiResponse>(
        `/api/project/v1/list?userGuid=${userGuid}`
      );
      runInAction(() => {
        this.projectCoefficient = data.coefficient;
        this.projectsList = data.projects;
      });
      return true;
    } catch (error) {
      console.error('Ошибка загрузки данных Проектов:', error);
      // В случае ошибки загружаем мок данные
      this.loadMockProjects();
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  loadMockKpi() {
    this.kpiList = [
      {
        guid: 'd8a3e59c-1754-4053-8e67-7cc775de9b81',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Охват обучением',
        planPercent: 90,
        factPercent: 80,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T08:52:00.108Z',
        updatedAt: '2025-10-17T08:52:00.108Z'
      },
      {
        guid: '265c27b3-9ace-4a2b-b83c-51418c9ac5b3',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Качество работ',
        planPercent: 83,
        factPercent: 56,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T08:51:52.453Z',
        updatedAt: '2025-10-17T08:51:52.453Z'
      },
      {
        guid: '49ec7f5f-76e3-4068-95ab-4f5a7fb33cfa',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Сроки проектов',
        planPercent: 85,
        factPercent: 35,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T08:51:47.776Z',
        updatedAt: '2025-10-17T08:51:47.776Z'
      },
      {
        guid: '49ec7f5f-76e3-4068-95ab-4f5a7fb33cfb',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Удовлетворенность клиентов',
        planPercent: 75,
        factPercent: 78,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T08:51:47.776Z',
        updatedAt: '2025-10-17T08:51:47.776Z'
      }
    ];
  }

  setSalary(value: number | null) {
    if (value === null || value >= 0) {
      this.salary = value === null ? null : Math.round(value);
    }
  }

  // Метод для расчета полугодовой премии
  calculateBonus() {
    if (this.salary === null || this.salary === 0) {
      this.calculatedBonusPercent = 0;
      this.calculatedBonusAmount = 0;
      return;
    }
    
    // Расчет суммы
    const iprPart = this.salary * 0.06 * this.devPlanCoef;
    const statsPart = this.salary * 0.18 * this.coefficient;
    const projectsPart = this.salary * 0.06 * this.projectCoefficient;
    
    this.calculatedBonusAmount = Math.round((iprPart + statsPart + projectsPart) * 6);
    
    // Расчет процента
    const numerator = (this.salary * 0.06 * this.devPlanCoef) + 
                      (this.salary * 0.18 * this.coefficient) + 
                      (this.salary * 0.06 * this.projectCoefficient);
    
    const denominator = (this.salary * 0.06 * 1) + 
                        (this.salary * 0.18 * 1.2) + 
                        (this.salary * 0.06 * 1.8);
    
    if (denominator === 0) {
      this.calculatedBonusPercent = 0;
    } else {
      const result = (numerator * 6) / (denominator * 6);
      this.calculatedBonusPercent = Math.round(result * 100); // Переводим в проценты
    }
  }

  // Метод для сброса всех данных
  resetBonus() {
    this.salary = null;
    this.calculatedBonusPercent = 0;
    this.calculatedBonusAmount = 0;
  }

  // Полный сброс всех данных store
  resetAllData() {
    this.salary = null;
    this.calculatedBonusPercent = 0;
    this.calculatedBonusAmount = 0;
    this.coefficient = 0;
    this.kpiList = [];
    this.devPlanCoef = 0;
    this.devPlanList = [];
    this.projectCoefficient = 0;
    this.projectsList = [];
    this.isLoading = false;
  }

  loadMockDevPlan() {
    this.devPlanList = [
      {
        guid: '97a322a3-d95e-48b8-9df8-936c51acc4f0',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Оптимизация процесса закупок',
        planPercent: 100,
        factPercent: 80,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:49:18.245Z',
        updatedAt: '2025-10-17T11:49:18.245Z'
      },
      {
        guid: '6a1f1fc6-7beb-4cc7-a92e-79770856c971',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Управление проектами',
        planPercent: 100,
        factPercent: 0,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:49:06.743Z',
        updatedAt: '2025-10-17T11:49:06.743Z'
      },
      {
        guid: '0e015df7-07cc-4bb3-a286-ab91c50e3604',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Мышление, быстрее и медленное',
        planPercent: 100,
        factPercent: 40,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:48:57.894Z',
        updatedAt: '2025-10-17T11:48:57.894Z'
      }
    ];
  }

  loadMockProjects() {
    this.projectsList = [
      {
        guid: '083fd992-d469-4910-bd58-3a88b5cff2e4',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Менторство',
        planNumber: 0,
        factNumber: 0,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:52:41.533Z',
        updatedAt: '2025-10-17T11:52:41.533Z'
      },
      {
        guid: 'a0e5a0db-cea8-4bf5-8677-698c00b99a47',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Синертимы',
        planNumber: 0,
        factNumber: 0,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:52:35.552Z',
        updatedAt: '2025-10-17T11:52:35.552Z'
      },
      {
        guid: '70c1f519-d557-4663-afe4-f7f239317438',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Предложения по улучшению',
        planNumber: 1,
        factNumber: 2,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:52:24.180Z',
        updatedAt: '2025-10-17T11:52:24.180Z'
      },
      {
        guid: '392923cf-93e3-4b81-a6ff-6ef941966607',
        userGuid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
        name: 'Локальные проекты',
        planNumber: 0,
        factNumber: 1,
        user: {
          guid: 'fab5a0a1-541b-4896-94ec-377e880924b1',
          email: 'user2@test.ru',
          firstName: 'Никита',
          lastName: 'Костылев',
          roleId: 2
        },
        createdAt: '2025-10-17T11:52:10.554Z',
        updatedAt: '2025-10-17T11:52:10.554Z'
      }
    ];
  }

  getKpiStatus(plan: number, fact: number): 'green' | 'yellow' | 'red' {
    if (plan === 0) return 'red';
    const ratio = fact / plan;
    if (ratio >= 0.85) return 'green';
    if (ratio >= 0.5) return 'yellow';
    return 'red';
  }
}

export const employeeDetailStore = new EmployeeDetailStore();

