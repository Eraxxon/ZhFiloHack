import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';

interface LoginResponse {
  token: string;
}

class AuthStore {
  token: string | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadTokenFromStorage();
  }

  loadTokenFromStorage() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
      this.isAuthenticated = true;
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const { data } = await http.post<LoginResponse>(
        '/api/auth/v1/login',
        { email, password }
      );
      runInAction(() => {
        this.token = data.token;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', data.token);
      });
      return true;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка авторизации';
        this.isAuthenticated = false;
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }
}

export const authStore = new AuthStore();

