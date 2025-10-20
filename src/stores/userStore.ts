import { makeAutoObservable } from 'mobx';

class UserStore {
  firstName = '';
  lastName = '';
  position = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUserData(firstName: string, lastName: string, position: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

export const userStore = new UserStore();


