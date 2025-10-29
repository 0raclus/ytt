import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader as Loader2, Shield, Eye, EyeOff, Lock, CircleCheck as CheckCircle, ArrowLeft, CircleAlert as AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function PasswordReset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });

  // const { changePassword } = useAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!passwords.password) {
      setError('Yeni şifre gereklidir.');
      setIsLoading(false);
      return;
    }

    if (passwords.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setIsLoading(false);
      return;
    }

    try {
      // This would typically get the token from URL parameters
      // For demo purposes, we'll simulate a successful reset
      setSuccess('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setError('Şifre sıfırlama sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Şifre Sıfırla</h1>
          <p className="text-muted-foreground">
            Yeni şifrenizi belirleyin
          </p>
        </div>

        {/* Reset Form */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Yeni Şifre</CardTitle>
            <CardDescription className="text-center">
              Güçlü bir şifre seçin ve tekrar girin
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="En az 6 karakter"
                    value={passwords.password}
                    onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Şifrenizi tekrar girin"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {passwords.password && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Şifre Gücü:</div>
                  <div className="flex space-x-1">
                    <div className={`h-1 flex-1 rounded ${
                      passwords.password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`h-1 flex-1 rounded ${
                      passwords.password.length >= 8 && /[A-Z]/.test(passwords.password) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`h-1 flex-1 rounded ${
                      passwords.password.length >= 8 && /[A-Z]/.test(passwords.password) && /[0-9]/.test(passwords.password) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {passwords.password.length < 6 && "En az 6 karakter gerekli"}
                    {passwords.password.length >= 6 && passwords.password.length < 8 && "Güçlü bir şifre için 8+ karakter kullanın"}
                    {passwords.password.length >= 8 && !/[A-Z]/.test(passwords.password) && "Büyük harf ekleyin"}
                    {passwords.password.length >= 8 && /[A-Z]/.test(passwords.password) && !/[0-9]/.test(passwords.password) && "Rakam ekleyin"}
                    {passwords.password.length >= 8 && /[A-Z]/.test(passwords.password) && /[0-9]/.test(passwords.password) && "Güçlü şifre!"}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !passwords.password || passwords.password !== passwords.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Şifre güncelleniyor...
                  </>
                ) : (
                  'Şifreyi Güncelle'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Giriş sayfasına dön
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Güvenlik Önerisi
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Güçlü şifreniz için en az 8 karakter, büyük/küçük harf, rakam ve özel karakter kullanın.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 YTT - Yaşayan Tasarım Topluluğu</p>
        </div>
      </div>
    </div>
  );
}