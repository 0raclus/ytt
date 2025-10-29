import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError() as Error & { status?: number; statusText?: string };
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Check if it's a chunk loading error
  const isChunkError = 
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed') ||
    error?.message?.includes('error loading dynamically imported module');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {isChunkError ? 'Güncelleme Gerekli' : 'Bir Hata Oluştu'}
              </CardTitle>
              <CardDescription>
                {isChunkError 
                  ? 'Uygulama güncellenmiş görünüyor. Lütfen sayfayı yenileyin.'
                  : 'Üzgünüz, beklenmeyen bir hata meydana geldi.'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isChunkError ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Uygulama yeni bir sürüme güncellendi. Değişiklikleri görmek için sayfayı yenilemeniz gerekiyor.
              </p>
              <Button onClick={handleReload} className="w-full" size="lg">
                <RefreshCw className="h-5 w-5 mr-2" />
                Sayfayı Yenile
              </Button>
            </div>
          ) : (
            <>
              {error?.message && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Hata Detayı:</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm text-destructive break-all">
                      {error.message}
                    </code>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleReload} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sayfayı Yenile
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfaya Dön
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Sorun devam ederse lütfen destek ekibiyle iletişime geçin.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

