import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { ZodError } from 'zod';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await loginWithGoogle();

      if (result.success) {
        setSuccess('Google ile giriş başarılı! Yönlendiriliyorsunuz...');

        setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError(result.message || 'Google ile giriş başarısız');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);

      const result = await login(validatedData);

      if (result.success) {
        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');

        setTimeout(() => {
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError(result.message || 'Giriş başarısız');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof LoginInput] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Giriş Yap</CardTitle>
        <CardDescription>
          Hesabınıza giriş yapmak için bilgilerinizi girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          size="lg"
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span className="ml-2 font-medium">Google ile Giriş Yap</span>
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Giriş yaparak{' '}
          <a href="/terms" className="underline hover:text-primary">
            Kullanım Koşulları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="underline hover:text-primary">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursunuz.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 hidden">

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Şifre</Label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => navigate('/auth/forgot-password')}
              >
                Şifremi unuttum
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Hesabınız yok mu? </span>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/register')}
            >
              Kayıt Ol
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

