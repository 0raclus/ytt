import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Leaf, Calendar, BookOpen, FileText, User, Bell, LogOut,
  Menu, X, Moon, Sun, Home, Mail, Phone, MapPin, Users, Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';
import YTTLogo from '@/images/YTT_Kalem.svg';

export function PublicLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/about', label: 'Hakkımızda', icon: Info },
    { path: '/events', label: 'Etkinlikler', icon: Calendar },
    // { path: '/plants', label: 'Bitkiler', icon: Leaf },
    // { path: '/blog', label: 'Blog', icon: BookOpen },
    // { path: '/resources', label: 'Kaynaklar', icon: FileText },
    { path: '/team', label: 'Ekibimiz', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md p-1.5">
                <img
                  src={YTTLogo}
                  alt="YTT Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold truncate">YTT</h1>
                <p className="text-xs text-muted-foreground hidden sm:block truncate">Yaşayan Tasarım Topluluğu</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {user ? (
                <>
                  <Link to="/notifications">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="hidden md:flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.full_name}</span>
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" className="hidden md:flex">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button>Giriş Yap</Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              {user && (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Button>
                  </Link>
                  <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Bildirimler
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md p-1">
                  <img src={YTTLogo} alt="YTT Logo" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold text-lg">{config.app.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Doğayla bağlan, yeşille büyü. Bitki yetiştirme ve doğa tutkusu bir arada.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/events" className="text-muted-foreground hover:text-foreground">Etkinlikler</Link></li>
                {/* <li><Link to="/plants" className="text-muted-foreground hover:text-foreground">Bitki Kütüphanesi</Link></li> */}
                {/* <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li> */}
                {/* <li><Link to="/resources" className="text-muted-foreground hover:text-foreground">Kaynaklar</Link></li> */}
                <li><Link to="/team" className="text-muted-foreground hover:text-foreground">Ekibimiz</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kurumsal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">Hakkımızda</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">İletişim</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Gizlilik Politikası</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Kullanım Koşulları</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@ytt.dev</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+90 555 000 0000</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>İstanbul, Türkiye</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {config.app.name}. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

