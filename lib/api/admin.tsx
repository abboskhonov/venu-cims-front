import { api } from '@/lib/instance';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface UpdateUserPayload {
  name: string;
  surname: string;
  email: string;
  is_active: boolean;
  password?: string;
}

export interface AdminDashboardData {
  users: User[];
  statistics: {
    user_count: number;
    active_user_count: number;
    inactive_user_count: number;
  };
}

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const response = await api.get('/superuser/dashboard');
  return response.data;
};

export const updateUser = async (
  user: UpdateUserPayload,
  userId: number
): Promise<User> => {
  const response = await api.put(`/superuser/users/${userId}`, user);
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/superuser/users/${userId}`);
};

export const toggleUserActive = async (userId: number): Promise<void> => {
  await api.patch(`/superuser/users/${userId}/toggle-active`);
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post('/superuser/users', user);
  return response.data;
};