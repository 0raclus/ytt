import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader as Loader2, Shield, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200">Erişim Engellendi</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              Bu sayfaya erişim için giriş yapmanız gerekiyor.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Lütfen geçerli yönetici hesabınızla giriş yapın.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Giriş Sayfasına Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-orange-200 dark:border-orange-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800 dark:text-orange-200">Yetkisiz Erişim</CardTitle>
            <CardDescription className="text-orange-600 dark:text-orange-400">
              Bu alanı görüntüleme yetkiniz bulunmuyor.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Kullanıcı: <span className="font-medium">{user?.full_name}</span><br />
              Rol: <span className="font-medium">{user?.role}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Admin yetkisi gereklidir. Eğer bu bir hata olduğunu düşünüyorsanız, 
              sistem yöneticisiyle iletişime geçin.
            </p>
            <div className="flex space-x-2">
              <Button onClick={() => window.history.back()} variant="outline" className="flex-1">
                Geri Dön
              </Button>
              <Button onClick={logout} variant="outline" className="flex-1">
                Çıkış Yap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}