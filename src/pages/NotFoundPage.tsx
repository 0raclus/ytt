import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Leaf } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            {/* 404 Illustration */}
            <div className="relative">
              <div className="text-9xl font-bold text-primary/10 select-none">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-primary/10 rounded-full">
                  <Leaf className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Sayfa Bulunamadı</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h2 className="font-semibold text-sm text-muted-foreground">
                Şunları deneyebilirsiniz:
              </h2>
              <ul className="text-sm space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>URL'yi kontrol edin ve tekrar deneyin</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Ana sayfaya giderek aradığınızı bulun</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Arama özelliğini kullanarak içerik arayın</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Geri Dön</span>
              </Button>
              <Link to="/">
                <Button className="flex items-center space-x-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  <span>Ana Sayfaya Git</span>
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
                  <Search className="h-4 w-4" />
                  <span>Etkinliklere Göz At</span>
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-3">Popüler Sayfalar:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/events">
                  <Button variant="ghost" size="sm">Etkinlikler</Button>
                </Link>
                <Link to="/plants">
                  <Button variant="ghost" size="sm">Bitkiler</Button>
                </Link>
                <Link to="/blog">
                  <Button variant="ghost" size="sm">Blog</Button>
                </Link>
                <Link to="/resources">
                  <Button variant="ghost" size="sm">Kaynaklar</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

