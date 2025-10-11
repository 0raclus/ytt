import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Users, Calendar, Leaf, Bell, BarChart3, LogOut,
  Moon, Sun, Menu, X, Settings, FileText, BookOpen, Home,
  Activity, Database, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    { path: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
    { path: '/admin/users', label: 'Kullanıcılar', icon: Users },
    { path: '/admin/events', label: 'Etkinlikler', icon: Calendar },
    { path: '/admin/plants', label: 'Bitkiler', icon: Leaf },
    { path: '/admin/blog', label: 'Blog', icon: BookOpen },
    { path: '/admin/resources', label: 'Kaynaklar', icon: FileText },
    { path: '/admin/notifications', label: 'Bildirimler', icon: Bell },
    { path: '/admin/activity', label: 'Aktivite', icon: Activity },
    { path: '/admin/settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {sidebarOpen && (
              <Link to="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">Admin Panel</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? location.pathname === item.path
                : isActive(item.path);

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <Icon className={`h-4 w-4 ${sidebarOpen ? 'mr-2' : ''}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t space-y-2">
            <Link to="/">
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <Home className={`h-4 w-4 ${sidebarOpen ? 'mr-2' : ''}`} />
                {sidebarOpen && <span>Ana Siteye Dön</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {navItems.find((item) =>
                    item.exact
                      ? location.pathname === item.path
                      : isActive(item.path)
                  )?.label || 'Admin Panel'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {config.app.name} Yönetim Paneli
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/50 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} {config.app.name}. Tüm hakları saklıdır.</p>
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                <span>v1.0.0</span>
                <span>•</span>
                <Link to="/admin/settings" className="hover:text-foreground">
                  Ayarlar
                </Link>
                <span>•</span>
                <a href="#" className="hover:text-foreground">
                  Yardım
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

