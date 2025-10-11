import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, getUser, logAuditEvent } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  department?: string;
  student_level?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'ebrar@ytt.dev',
  password: 'filistin',
  userData: {
    id: 'admin-001',
    email: 'ebrar@ytt.dev',
    full_name: 'Ebrar Admin',
    role: 'admin' as const,
    department: 'YTT Yönetim',
    student_level: 'Yönetici',
    phone: '+90 555 000 0001',
    bio: 'YTT Yenilikçi Teknoloji Takımı kurucu üyesi ve baş yönetici',
    preferences: {
      notifications: true,
      newsletter: true,
      reminder_time: 1,
      language: 'tr',
      theme: 'system'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    email_verified: true,
    two_factor_enabled: false
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (event === 'SIGNED_IN' && session?.user) {
            // User just signed in - update state
            let userData = null;
            let retries = 5;

            while (retries > 0 && !userData) {
              await new Promise(resolve => setTimeout(resolve, 300));
              userData = await getUser(session.user.id);
              retries--;
            }

            const userRole = checkUserRole(session.user.email || '');

            if (userData) {
              setUser({ ...userData, role: userRole });
            } else {
              const fallbackUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                role: userRole,
                avatar_url: session.user.user_metadata?.avatar_url,
                department: session.user.user_metadata?.department,
                student_level: session.user.user_metadata?.student_level,
                phone: session.user.user_metadata?.phone,
                bio: undefined,
                preferences: {
                  notifications: true,
                  newsletter: true,
                  reminder_time: 1,
                  language: 'tr',
                  theme: 'system'
                },
                created_at: session.user.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                is_active: true,
                email_verified: false,
                two_factor_enabled: false
              };
              setUser(fallbackUser);
            }
            setLoading(false);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setLoading(false);
          }
        })();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile from our users table with comprehensive fallback
        let userData = null;
        try {
          userData = await getUser(session.user.id);
        } catch (error) {
          // Ignore any errors from getUser
        }
        
        if (userData) {
          setUser(userData);
        } else {
          // Fallback: create basic user object from auth session
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: checkUserRole(session.user.email || '') as 'admin' | 'user' | 'moderator',
            avatar_url: session.user.user_metadata?.avatar_url,
            department: session.user.user_metadata?.department,
            student_level: session.user.user_metadata?.student_level,
            phone: session.user.user_metadata?.phone,
            bio: undefined,
            preferences: {
              notifications: true,
              newsletter: true,
              reminder_time: 1,
              language: 'tr',
              theme: 'system'
            },
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true,
            email_verified: false,
            two_factor_enabled: false
          };
          setUser(fallbackUser);
        }
        
        // Try to log login activity (silently fails if RLS blocks it)
        try {
          await logAuditEvent({
            user_id: session.user.id,
            action: 'session_check',
            resource_type: 'auth',
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
          });
        } catch (error) {
          // Silently ignore audit logging errors
        }
      } else {
        // Check for admin session in localStorage (fallback)
        const adminToken = localStorage.getItem('ytt_admin_token');
        const adminData = localStorage.getItem('ytt_admin_data');
        
        if (adminToken && adminData) {
          const parsedUser = JSON.parse(adminData);
          setUser(parsedUser);
        }
      }
    } catch (error) {
      // Silently handle all auth check errors
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const checkUserRole = (email: string): 'admin' | 'user' => {
    // Admin emails list
    const adminEmails = [
      'ebrar@ytt.dev',
      'admin@ytt.dev',
      'yonetici@ytt.dev'
    ];
    
    return adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    
    try {
      // Check admin credentials first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const token = `ytt_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        localStorage.setItem('ytt_admin_token', token);
        localStorage.setItem('ytt_admin_data', JSON.stringify(ADMIN_CREDENTIALS.userData));
        
        setUser(ADMIN_CREDENTIALS.userData);
        
        try {
          await logAuditEvent({
            user_id: ADMIN_CREDENTIALS.userData.id,
            action: 'admin_login',
            resource_type: 'auth',
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
          });
        } catch (auditError) {
          // Silently ignore audit logging errors
        }
        
        return { success: true };
      }
      
      // Try Supabase authentication for regular users (with fallback)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, message: getErrorMessage(error.message) };
        }

        if (data.user) {
          // Get or create user profile with retry mechanism
          let userData = null;
          let retries = 5;

          while (retries > 0 && !userData) {
            await new Promise(resolve => setTimeout(resolve, 300));
            userData = await getUser(data.user.id);
            retries--;
          }

          const userRole = checkUserRole(email);

          if (userData) {
            // User found in database
            setUser({ ...userData, role: userRole });
          } else {
            // Fallback: Create user object from auth session
            const fallbackUser: User = {
              id: data.user.id,
              email: data.user.email || email,
              full_name: data.user.user_metadata?.full_name || email.split('@')[0],
              role: userRole,
              avatar_url: data.user.user_metadata?.avatar_url,
              department: data.user.user_metadata?.department,
              student_level: data.user.user_metadata?.student_level,
              phone: data.user.user_metadata?.phone,
              bio: undefined,
              preferences: {
                notifications: true,
                newsletter: true,
                reminder_time: 1,
                language: 'tr',
                theme: 'system'
              },
              created_at: data.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              is_active: true,
              email_verified: false,
              two_factor_enabled: false
            };
            setUser(fallbackUser);
          }

          try {
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', data.user.id);
          } catch (updateError) {
            // Silently ignore update errors
          }

          try {
            await logAuditEvent({
              user_id: data.user.id,
              action: 'user_login',
              resource_type: 'auth',
              ip_address: await getClientIP(),
              user_agent: navigator.userAgent
            });
          } catch (auditError) {
            // Silently ignore audit logging errors
          }

          return { success: true };
        }
      } catch (supabaseError) {
        console.error('Supabase authentication failed:', supabaseError);
        return { 
          success: false, 
          message: 'Giriş sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.' 
        };
      }

      return { success: false, message: 'Geçersiz giriş bilgileri.' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: 'Giriş sırasında bir hata oluştu.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      const userRole = checkUserRole(userData.email);

      // Supabase auth'a kayıt ol
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role: userRole,
            full_name: userData.full_name,
            department: userData.department,
            student_level: userData.student_level,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        return { success: false, message: getErrorMessage(error.message) };
      }

      if (data.user) {
        // Trigger otomatik olarak users ve user_profiles tablosunu oluşturacak
        // Retry mekanizması ile kullanıcı profilini çek
        let userProfile = null;
        let retries = 5;

        while (retries > 0 && !userProfile) {
          await new Promise(resolve => setTimeout(resolve, 500));
          userProfile = await getUser(data.user.id);
          retries--;
        }

        if (userProfile) {
          setUser({ ...userProfile, role: userRole });

          // Audit log kaydet (async, hata olursa sessizce devam et)
          try {
            await logAuditEvent({
              user_id: data.user.id,
              action: 'user_register',
              resource_type: 'auth',
              ip_address: await getClientIP(),
              user_agent: navigator.userAgent
            });
          } catch (auditError) {
            console.error('Audit log error:', auditError);
          }

          return {
            success: true,
            message: userRole === 'admin'
              ? 'Yönetici hesabınız oluşturuldu ve giriş yapıldı!'
              : 'Hesabınız oluşturuldu ve giriş yapıldı! Hoş geldiniz!'
          };
        } else {
          // Profil oluşturulamadıysa, kullanıcıyı manuel set et
          const manualUser = {
            id: data.user.id,
            email: data.user.email || userData.email,
            full_name: userData.full_name,
            role: userRole,
            department: userData.department,
            student_level: userData.student_level,
            phone: userData.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(manualUser as any);

          return {
            success: true,
            message: 'Hesabınız oluşturuldu! Hoş geldiniz!'
          };
        }
      }

      return { success: false, message: 'Kayıt sırasında bir hata oluştu.' };
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.message?.includes('fetch')) {
        return { success: false, message: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.' };
      }

      return { success: false, message: 'Kayıt sırasında bir hata oluştu: ' + (error.message || 'Bilinmeyen hata') };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, message: getErrorMessage(error.message) };
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          await logAuditEvent({
            user_id: currentSession.user.id,
            action: 'password_reset_request',
            resource_type: 'auth',
            resource_id: email,
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
          });
        }
      } catch (auditError) {
        // Silently ignore audit logging errors
      }

      return { 
        success: true, 
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' 
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, message: 'Şifre sıfırlama sırasında bir hata oluştu.' };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'Kullanıcı bulunamadı.' };

    try {
      // First verify the old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
      });

      if (signInError) {
        return { success: false, message: 'Mevcut şifre yanlış.' };
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, message: getErrorMessage(error.message) };
      }

      return { success: true, message: 'Şifreniz başarıyla güncellendi.' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Şifre değiştirme sırasında bir hata oluştu.' };
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'Kullanıcı bulunamadı.' };

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        return { success: false, message: 'Profil güncellenemedi.' };
      }

      // Update local state
      setUser({ ...user, ...updates });
      
      try {
        await logAuditEvent({
          user_id: user.id,
          action: 'profile_update',
          resource_type: 'user',
          resource_id: user.id,
          old_values: { id: user.id, ...Object.keys(updates).reduce((obj, key) => ({ ...obj, [key]: (user as any)[key] }), {}) },
          new_values: updates,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });
      } catch (auditError) {
        // Silently ignore audit logging errors
      }

      return { success: true, message: 'Profil başarıyla güncellendi.' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Profil güncellenirken hata oluştu.' };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        try {
          await logAuditEvent({
            user_id: user.id,
            action: user.role === 'admin' ? 'admin_logout' : 'user_logout',
            resource_type: 'auth',
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
          });
        } catch (auditError) {
          // Silently ignore audit logging errors
        }
      }

      await supabase.auth.signOut();
      localStorage.removeItem('ytt_admin_token');
      localStorage.removeItem('ytt_admin_data');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper functions
const getErrorMessage = (error: string) => {
  switch (error) {
    case 'Invalid login credentials':
      return 'Geçersiz e-posta veya şifre.';
    case 'Email not confirmed':
      return 'E-posta adresinizi doğrulamanız gerekiyor.';
    case 'User already registered':
      return 'Bu e-posta adresi zaten kayıtlı.';
    case 'Password should be at least 6 characters':
      return 'Şifre en az 6 karakter olmalıdır.';
    case 'Email rate limit exceeded':
      return 'Çok fazla e-posta gönderildi. Lütfen birkaç dakika bekleyin.';
    default:
      return error;
  }
};

const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};