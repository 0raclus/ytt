import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, Users, Calendar, Leaf, Bell, ChartBar as BarChart3, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { UserManagement } from './admin/UserManagement';
import { EventManager } from './EventManager';
import { PlantManagement } from './admin/PlantManagement';
import { NotificationManagement } from './admin/NotificationManagement';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">YTT Admin</h1>
                <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Analitik</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Kullanıcılar</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Etkinlikler</span>
            </TabsTrigger>
            <TabsTrigger value="plants" className="flex items-center space-x-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden md:inline">Bitkiler</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Bildirimler</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventManager />
          </TabsContent>

          <TabsContent value="plants" className="space-y-6">
            <PlantManagement />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationManagement />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-8 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 YTT - Yenilikçi Teknoloji Takımı</p>
          <p className="mt-1">Admin Yönetim Paneli</p>
        </div>
      </footer>
    </div>
  );
}
