'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './msal-config';
import { User, UserRole } from './database.types';
import { mockUsers } from './mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { instance, accounts } = useMsal();
  const isMsalAuthenticated = useIsAuthenticated();

  const isMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

  useEffect(() => {
    if (isMockAuth) {
      // Mock auth flow
      const stored = sessionStorage.getItem('itam_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          sessionStorage.removeItem('itam_user');
        }
      }
      setIsLoading(false);
    } else {
      // MSAL flow
      if (isMsalAuthenticated && accounts.length > 0) {
        const account = accounts[0];
        // Create a temporary User object from MSAL account
        setUser({
          id: account.homeAccountId || account.localAccountId,
          entra_object_id: account.localAccountId,
          email: account.username,
          display_name: account.name || account.username.split('@')[0],
          role: 'user', // Default to user, admin logic can be added later
          department: 'IT',
          subsidiary: 'TRR',
          last_login_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [isMockAuth, isMsalAuthenticated, accounts]);

  const login = useCallback(async (role: UserRole = 'user') => {
    if (isMockAuth) {
      const mockUser = role === 'admin' ? mockUsers[1] : mockUsers[0];
      setUser(mockUser);
      sessionStorage.setItem('itam_user', JSON.stringify(mockUser));
    } else {
      try {
        await instance.loginPopup(loginRequest);
      } catch (error) {
        console.error("MSAL Login Error:", error);
      }
    }
  }, [isMockAuth, instance]);

  const logout = useCallback(() => {
    if (isMockAuth) {
      setUser(null);
      sessionStorage.removeItem('itam_user');
    } else {
      instance.logoutPopup().catch(console.error);
    }
  }, [isMockAuth, instance]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
