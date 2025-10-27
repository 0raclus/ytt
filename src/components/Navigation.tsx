import React from 'react';
import { CalendarDays, Leaf, Bell, Settings, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  navItems?: Array<{ id: string; label: string; icon: string }>;
  extraActions?: React.ReactNode;
}

export function Navigation({ activeTab, setActiveTab, isDark, toggleTheme, navItems, extraActions }: NavigationProps) {
  const { user, logout } = useAuth();
  
  const defaultNavItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: CalendarDays },
    { id: 'plants', label: 'Bitkiler', icon: Leaf },
    { id: 'events', label: 'Etkinlikler', icon: CalendarDays },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'about', label: 'Hakkında', icon: User },
    { id: 'profile', label: 'Profil', icon: User },
  ];
  
  const adminNavItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: CalendarDays },
    { id: 'management', label: 'Yönetim', icon: Settings },
    { id: 'users', label: 'Kullanıcılar', icon: User },
    { id: 'analytics', label: 'Analitik', icon: CalendarDays },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];
  
  const items = navItems ? navItems.map(item => ({
    ...item,
    icon: item.icon === 'CalendarDays' ? CalendarDays :
          item.icon === 'Leaf' ? Leaf :
          item.icon === 'Bell' ? Bell :
          item.icon === 'Settings' ? Settings :
          User
  })) : (user?.role === 'admin' ? adminNavItems : defaultNavItems);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <img
                src="/assets/ytt-logo.png"
                alt="YTT Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">YTT</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="flex items-center space-x-2 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            {extraActions}
            
            {user && (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {user.full_name}
                  </span>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
                    {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Çıkış
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="transition-all duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto space-x-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className="flex items-center space-x-1 whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}