import { apiClient } from './client';

export const authApi = {
  register: async (email: string, password: string): Promise<void> => {
    await apiClient.post('/auth/register', { email, password });
  },

  login: async (email: string, password: string): Promise<void> => {
    await apiClient.post('/auth/login', { email, password });
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<{ userId: string; email: string }> => {
    const { data } = await apiClient.get<{ data: { user: { userId: string; email: string } } }>('/auth/me');
    return data.data.user;
  },
};