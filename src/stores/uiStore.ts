import { makeAutoObservable } from 'mobx';

export type UserRole = 'manager' | 'employee';

class UiStore {
  role: UserRole = 'manager';

  constructor() {
    makeAutoObservable(this);
  }

  setRole(role: UserRole) {
    this.role = role;
  }
}

export const uiStore = new UiStore();


