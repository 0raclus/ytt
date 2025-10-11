import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      const errorLog = {
        error: {
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      try {
        const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
        existingLogs.push(errorLog);
        localStorage.setItem('error_logs', JSON.stringify(existingLogs.slice(-10)));
      } catch (e) {
        console.error('Failed to log error to localStorage:', e);
      }
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Bir Hata Oluştu</CardTitle>
                  <CardDescription>
                    Üzgünüz, beklenmeyen bir hata meydana geldi.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {this.state.error && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Hata Detayı:</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm text-destructive break-all">
                      {this.state.error.message}
                    </code>
                  </div>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <details className="space-y-2">
                  <summary className="font-semibold text-sm cursor-pointer hover:text-primary">
                    Stack Trace (Geliştirici Modu)
                  </summary>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
                      <code>{this.state.error.stack}</code>
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tekrar Dene
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sayfayı Yenile
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfaya Dön
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Bu hata otomatik olarak kaydedildi. Sorun devam ederse lütfen destek ekibiyle iletişime geçin.
                </p>
                <p className="text-xs">
                  Hata Kodu: {Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

