import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';

class AppStore {
  isLoading = false;
  ping: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPing() {
    this.isLoading = true;
    try {
      const { data } = await http.get('/api/ping');
      runInAction(() => {
        this.ping = typeof data === 'string' ? data : JSON.stringify(data);
      });
    } catch (error) {
      runInAction(() => {
        this.ping = 'Ошибка запроса';
      });
      // For debugging in development
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const appStore = new AppStore();


