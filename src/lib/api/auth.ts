// @ts-nocheck
import { supabase } from '@/lib/supabase';
import { LoginInput, RegisterInput, ResetPasswordInput } from '@/lib/validations/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'moderator';
  avatar_url?: string;
  department?: string;
  student_level?: string;
  phone?: string;
  bio?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    reminder_time: number;
    language: string;
    theme: string;
  };
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
}

const ADMIN_EMAILS = ['ebrar@ytt.dev', 'admin@ytt.dev'];

const determineUserRole = (email: string): 'admin' | 'user' => {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
};

export const authApi = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'E-posta veya şifre hatalı',
          };
        }
        if (authError.message.includes('Email not confirmed')) {
          return {
            success: false,
            error: 'E-posta adresinizi doğrulamanız gerekiyor',
          };
        }
        return {
          success: false,
          error: authError.message || 'Giriş başarısız',
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Kullanıcı bilgileri alınamadı',
        };
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', authData.user.id);

      return {
        success: true,
        message: 'Giriş başarılı',
        data: {
          user: authData.user,
          profile: profile,
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      };
    }
  },

  async register(userData: RegisterInput): Promise<AuthResponse> {
    try {
      const userRole = determineUserRole(userData.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: userData.full_name,
            role: userRole,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return {
            success: false,
            error: 'Bu e-posta adresi zaten kayıtlı',
          };
        }
        if (authError.message.includes('Password should be at least')) {
          return {
            success: false,
            error: 'Şifre çok zayıf',
          };
        }
        return {
          success: false,
          error: authError.message || 'Kayıt başarısız',
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Kullanıcı oluşturulamadı',
        };
      }

      const { error: profileError } = await supabase.from('user_profiles').insert([
        {
          user_id: authData.user.id,
          full_name: userData.full_name,
          email: userData.email,
          role: userRole,
          phone: userData.phone || null,
          department: userData.department || null,
          student_level: userData.student_level || null,
          preferences: {
            notifications: true,
            newsletter: true,
            reminder_time: 1,
            language: 'tr',
            theme: 'system',
          },
        },
      ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        return {
          success: false,
          error: 'Profil oluşturulamadı. Lütfen tekrar deneyin.',
        };
      }

      return {
        success: true,
        message: authData.user.identities && authData.user.identities.length === 0
          ? 'Hesabınız oluşturuldu. E-posta adresinize gönderilen doğrulama linkine tıklayın.'
          : 'Kayıt başarılı! E-posta doğrulama linki gönderildi.',
        data: {
          user: authData.user,
          needsEmailVerification: true,
        },
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      };
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message || 'Çıkış yapılamadı',
        };
      }

      return {
        success: true,
        message: 'Başarıyla çıkış yapıldı',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu',
      };
    }
  },

  async resetPassword(data: ResetPasswordInput): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Şifre sıfırlama başarısız',
        };
      }

      return {
        success: true,
        message: 'Şifre sıfırlama linki e-posta adresinize gönderildi',
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu',
      };
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı',
        };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        return {
          success: false,
          error: 'Mevcut şifre hatalı',
        };
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return {
          success: false,
          error: updateError.message || 'Şifre güncellenemedi',
        };
      }

      return {
        success: true,
        message: 'Şifreniz başarıyla güncellendi',
      };
    } catch (error: any) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: 'Bir hata oluştu',
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
        department: profile.department,
        student_level: profile.student_level,
        phone: profile.phone,
        bio: profile.bio,
        preferences: profile.preferences,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_login: profile.last_login,
        is_active: profile.is_active,
        email_verified: user.email_confirmed_at !== null,
        two_factor_enabled: profile.two_factor_enabled,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

