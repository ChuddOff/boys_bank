import { api } from '../../shared/api/client';
import { AuthResponse, User } from '../../shared/types/bank';
export const authApi = {
  login: (data: { email: string; password: string }) => api.post<AuthResponse>('/api/auth/login', data).then(r => r.data),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => api.post<AuthResponse>('/api/auth/register', data).then(r => r.data),
  me: () => api.get<User>('/api/auth/me').then(r => r.data),
  logout: () => api.post('/api/auth/logout').then(r => r.data)
};
