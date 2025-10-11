import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Lock, User, Phone, Building, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { ZodError } from 'zod';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterInput>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    department: '',
    student_level: '',
    terms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, terms: checked }));
    if (errors.terms) {
      setErrors((prev) => ({ ...prev, terms: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = registerSchema.parse(formData);

      const result = await register(validatedData);

      if (result.success) {
        setSuccess(result.message || 'Kayıt başarılı!');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Kayıt başarısız');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof RegisterInput] = error.message;
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
        <CardDescription>
          YTT platformuna katılmak için bilgilerinizi girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Ad Soyad *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Adınız Soyadınız"
                value={formData.full_name}
                onChange={handleChange}
                className={`pl-10 ${errors.full_name ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
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
            <Label htmlFor="password">Şifre *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="En az 8 karakter"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={handleChange}
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Bölüm</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="department"
                name="department"
                type="text"
                placeholder="Bilgisayar Mühendisliği"
                value={formData.department}
                onChange={handleChange}
                className={`pl-10 ${errors.department ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_level">Sınıf</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="student_level"
                name="student_level"
                type="text"
                placeholder="1. Sınıf"
                value={formData.student_level}
                onChange={handleChange}
                className={`pl-10 ${errors.student_level ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.student_level && (
              <p className="text-sm text-red-500">{errors.student_level}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.terms}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kullanım koşullarını kabul ediyorum *
              </label>
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kayıt yapılıyor...
              </>
            ) : (
              'Kayıt Ol'
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

