import { makeAutoObservable } from 'mobx';

export type AccountRole = 'manager' | 'employee';

export interface Account {
  guid: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AccountRole;
  position: string;
}

class AccountStore {
  currentRole: AccountRole = 'manager';
  
  // Доступные аккаунты
  accounts: Account[] = [
    {
      guid: 'd71aaa68-e868-4504-a210-ec3458dbb909',
      email: 'user11@mail.com',
      password: '122334',
      firstName: 'Вася',
      lastName: 'Пупкин',
      role: 'manager',
      position: 'Руководитель'
    },
    {
      guid: '57f10bf8-3340-4ded-98be-27d85a9417d9',
      email: 'user12@mail.com',
      password: '122334',
      firstName: 'Никита',
      lastName: 'Никитич',
      role: 'employee',
      position: 'Специалист по работе с данными'
    }
  ];

  constructor() {
    makeAutoObservable(this);
    this.loadRoleFromStorage();
  }

  loadRoleFromStorage() {
    const savedRole = localStorage.getItem('currentRole') as AccountRole | null;
    if (savedRole) {
      this.currentRole = savedRole;
    }
  }

  get currentAccount(): Account {
    return this.accounts.find(acc => acc.role === this.currentRole) || this.accounts[0];
  }

  get isManager(): boolean {
    return this.currentRole === 'manager';
  }

  get isEmployee(): boolean {
    return this.currentRole === 'employee';
  }

  switchAccount(role: AccountRole) {
    this.currentRole = role;
    localStorage.setItem('currentRole', role);
  }
}

export const accountStore = new AccountStore();

