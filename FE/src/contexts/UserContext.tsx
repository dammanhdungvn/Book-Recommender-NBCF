import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DemoUser } from '../types';
import { userService } from '../services';

interface UserContextType {
  selectedUser: DemoUser | null;
  setSelectedUser: (user: DemoUser | null) => void;
  demoUsers: DemoUser[];
  loadingUsers: boolean;
  errorUsers: string | null;
  refreshDemoUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const loadDemoUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers(null);
      const users = await userService.getDemoUsers();
      // Đảm bảo users là array
      if (Array.isArray(users)) {
        setDemoUsers(users);
      } else {
        console.error('Demo users response is not an array:', users);
        setDemoUsers([]);
        setErrorUsers('Dữ liệu không đúng định dạng');
      }
    } catch (error) {
      setErrorUsers(error instanceof Error ? error.message : 'Không tải được danh sách user demo');
      console.error('Error loading demo users:', error);
      setDemoUsers([]); // Set empty array khi lỗi
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadDemoUsers();
  }, []);

  const value: UserContextType = {
    selectedUser,
    setSelectedUser,
    demoUsers,
    loadingUsers,
    errorUsers,
    refreshDemoUsers: loadDemoUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

