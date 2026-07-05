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
  login: (role?: UserRole, email?: string) => void;
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
    async function initAuth() {
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
          
          let userRole: UserRole = 'user';
          
          const idTokenRoles = (account.idTokenClaims as any)?.roles || [];
          
          // Method 3: Hardcoded Super Admin check (Always grant admin to specific email)
          if (account.username.toLowerCase() === 'watchara.kid@trrgroup.com') {
            userRole = 'admin';
          } else if (idTokenRoles.includes('ITAdmin')) {
            // Method 2: Check App Roles from Azure AD Token
            userRole = 'admin';
          } else {
            // Method 1: Check Database (Supabase) as fallback
            try {
              // Import dynamically or ensure supabase is available
              const { supabase } = await import('./supabase');
              const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('entra_object_id', account.localAccountId)
                .single();
                
              if (data && data.role === 'admin') {
                userRole = 'admin';
              }
            } catch (error) {
              console.error("Error fetching user role from database:", error);
            }
          }

          let department = 'IT';
          let subsidiary = 'TRR';
          let profileImageUrl = null;

          try {
            const tokenResponse = await instance.acquireTokenSilent({
              scopes: ['User.Read'],
              account: account
            });

            const graphData = await fetch('https://graph.microsoft.com/v1.0/me?$select=department,companyName', {
              headers: { Authorization: `Bearer ${tokenResponse.accessToken}` }
            }).then(res => res.json());

            if (graphData.department) department = graphData.department;
            if (graphData.companyName) subsidiary = graphData.companyName;

            const photoRes = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
              headers: { Authorization: `Bearer ${tokenResponse.accessToken}` }
            });
            if (photoRes.ok) {
              const blob = await photoRes.blob();
              profileImageUrl = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error("Error fetching from MS Graph:", error);
          }

          // Create a temporary User object from MSAL account
          setUser({
            id: account.homeAccountId || account.localAccountId,
            entra_object_id: account.localAccountId,
            email: account.username,
            display_name: account.name || account.username.split('@')[0],
            role: userRole,
            department: department,
            subsidiary: subsidiary,
            profile_image_url: profileImageUrl,
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
    }

    initAuth();
  }, [isMockAuth, isMsalAuthenticated, accounts]);

  const login = useCallback(async (role: UserRole = 'user', email?: string) => {
    if (isMockAuth) {
      let mockUser = mockUsers[0]; // default to jakkrit (PS)
      if (email) {
        mockUser = mockUsers.find(u => u.email === email) || mockUser;
      } else if (role === 'admin') {
        mockUser = mockUsers.find(u => u.role === 'admin') || mockUser;
      }
      setUser(mockUser);
      sessionStorage.setItem('itam_user', JSON.stringify(mockUser));
    } else {
      try {
        await instance.loginRedirect(loginRequest);
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
      instance.logoutRedirect().catch(console.error);
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
