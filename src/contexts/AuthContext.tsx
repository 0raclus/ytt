import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut as firebaseSignOut, onAuthChange, FirebaseUser } from '@/lib/firebase';
import { neonClient } from '@/lib/neon-client';
import { LoginInput, RegisterInput } from '@/lib/validations/auth';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  department?: string;
  student_level?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  register: (userData: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserToNeon(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function syncUserToNeon(firebaseUser: FirebaseUser) {
    try {
      setLoading(true);
      
      const response = await neonClient.post('/auth/sync-firebase-user', {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        avatar_url: firebaseUser.photoURL,
      });

      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Sync user error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials: LoginInput) {
    try {
      setLoading(true);
      const { user: firebaseUser, error } = await signInWithEmail(credentials.email, credentials.password);

      if (error) {
        return { success: false, message: error };
      }

      if (firebaseUser) {
        await syncUserToNeon(firebaseUser);
        return { success: true, message: 'Giriş başarılı!' };
      }

      return { success: false, message: 'Giriş başarısız' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Giriş sırasında bir hata oluştu.' };
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setLoading(true);
      const { user: firebaseUser, error } = await signInWithGoogle();

      if (error) {
        return { success: false, message: error };
      }

      if (firebaseUser) {
        await syncUserToNeon(firebaseUser);
        return { success: true, message: 'Google ile giriş başarılı!' };
      }

      return { success: false, message: 'Google ile giriş başarısız' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Google ile giriş sırasında bir hata oluştu.' };
    } finally {
      setLoading(false);
    }
  }

  async function registerFunc(userData: RegisterInput) {
    try {
      setLoading(true);
      const { user: firebaseUser, error } = await signUpWithEmail(userData.email, userData.password);

      if (error) {
        return { success: false, message: error };
      }

      if (firebaseUser) {
        const response = await neonClient.post('/auth/sync-firebase-user', {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: userData.full_name || firebaseUser.email?.split('@')[0],
          avatar_url: firebaseUser.photoURL,
        });

        if (response.data) {
          setUser(response.data);
        }

        return { success: true, message: 'Kayıt başarılı!' };
      }

      return { success: false, message: 'Kayıt başarısız' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Kayıt sırasında bir hata oluştu.' };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await firebaseSignOut();
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

      const response = await neonClient.put(`/users/${user.id}`, updates);

      if (response.data) {
        setUser(response.data);
        return { success: true, message: 'Profil başarıyla güncellendi' };
      }

      return { success: false, message: 'Profil güncellenemedi' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Bir hata oluştu' };
    }
  }

  async function refreshUser() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await syncUserToNeon(currentUser);
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    loginWithGoogle,
    register: registerFunc,
    logout,
    updateProfile,
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
