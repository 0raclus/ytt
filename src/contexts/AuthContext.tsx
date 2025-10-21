import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { authApi, User, AuthResponse } from '@/lib/api/auth';
import { LoginInput, RegisterInput } from '@/lib/validations/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<AuthResponse>;
  register: (userData: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: any) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user?.id) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          if (session?.user?.id) {
            await loadUserProfile(session.user.id);
          }
        } else if (event === 'USER_UPDATED' && session?.user?.id) {
          await loadUserProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function initializeAuth() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        setUser(null);
        return;
      }

      const session = data?.session as any;
      if (session?.user?.id) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Load user profile error:', error);
      setUser(null);
    }
  }

  async function login(credentials: LoginInput) {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);

      if (response.success && response.data?.user) {
        await loadUserProfile(response.data.user.id);
      }

      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      };
    } finally {
      setLoading(false);
    }
  }

  async function registerFunc(userData: RegisterInput) {
    try {
      setLoading(true);
      const response = await authApi.register(userData);

      if (response.success && response.data?.user && !response.data.needsEmailVerification) {
        await loadUserProfile(response.data.user.id);
      }

      return response;
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<User>) {
    try {
      if (!user) {
        return { success: false, message: 'Kullanıcı oturumu bulunamadı' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: updates.full_name,
          phone: updates.phone,
          department: updates.department,
          student_level: updates.student_level,
          bio: updates.bio,
          avatar_url: updates.avatar_url,
          preferences: updates.preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Profil güncellenemedi' };
      }

      await loadUserProfile(user.id);

      return { success: true, message: 'Profil başarıyla güncellendi' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Bir hata oluştu' };
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      return await authApi.updatePassword(oldPassword, newPassword);
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu',
      };
    }
  }

  async function refreshUser() {
    if (user) {
      await loadUserProfile(user.id);
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register: registerFunc,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User };
