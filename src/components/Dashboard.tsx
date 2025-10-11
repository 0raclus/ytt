import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Leaf, Bell, TrendingUp, Award, MapPin, Clock } from 'lucide-react';
import { Plus, Settings, CheckCircle } from 'lucide-react';
import { events } from '@/data/events';
import { plants } from '@/data/plants';

export function Dashboard() {
  const upcomingEvents = events.slice(0, 3);
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const averageCapacityUsage = Math.round((totalRegistrations / totalCapacity) * 100);
  
  const stats = [
    {
      title: 'Toplam Etkinlik',
      value: events.length,
      change: '+2 bu ay',
      icon: CalendarDays,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Kayıtlı Katılımcı',
      value: totalRegistrations,
      change: '+15 bu hafta',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      title: 'Bitki Türü',
      value: plants.length,
      change: 'Tam koleksiyon',
      icon: Leaf,
      color: 'text-nature',
      bgColor: 'bg-green-100 dark:bg-green-950/30'
    },
    {
      title: 'Doluluk Oranı',
      value: `%${averageCapacityUsage}`,
      change: 'Ortalama kapasite',
      icon: Bell,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    }
  ];

  const quickActions = [
    {
      title: 'Yeni Etkinlik',
      icon: CalendarDays,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
      description: 'Etkinlik planla'
    },
    {
      title: 'Bitki Ekle',
      icon: Leaf,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-950/20',
      description: 'Kütüphaneye ekle'
    },
    {
      title: 'Bildirim Gönder',
      icon: Bell,
      color: 'text-orange-600 hover:text-orange-700',
      bgColor: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
      description: 'Kullanıcılara bildir'
    },
    {
      title: 'Katılımcıları Gör',
      icon: Users,
      color: 'text-purple-600 hover:text-purple-700',
      bgColor: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
      description: 'Kayıtlı listesi'
    }
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'walk':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'seminar':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'planting':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">YTT Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Yenilikçi Teknoloji Takımı etkinlik platformuna hoş geldiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team Management Section */}
      <Card className="border-2 border-dashed border-primary/25 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Ekip Yönetimi</span>
          </CardTitle>
          <CardDescription>
            YTT ekibi ve roller yönetimi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-3xl mb-2">👨‍💼</div>
              <h3 className="font-semibold">Proje Lideri</h3>
              <p className="text-sm text-muted-foreground mt-1">Ahmet Y.</p>
              <div className="mt-3">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  Full Stack
                </Badge>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-3xl mb-2">👩‍🎨</div>
              <h3 className="font-semibold">UI/UX Designer</h3>
              <p className="text-sm text-muted-foreground mt-1">Ayşe D.</p>
              <div className="mt-3">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  Frontend
                </Badge>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-3xl mb-2">👨‍⚙️</div>
              <h3 className="font-semibold">Backend Developer</h3>
              <p className="text-sm text-muted-foreground mt-1">Mehmet K.</p>
              <div className="mt-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Backend
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="mr-2">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Üye Ekle
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Roller Yönet
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Quick Actions */}
      <Card className="border-2 border-dashed border-muted-foreground/25 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-primary" />
            <span>Hızlı İşlemler</span>
          </CardTitle>
          <CardDescription>
            Sık kullanılan işlemler için kısayollar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={action.title}
                  variant="ghost" 
                  className={`h-auto p-6 flex-col space-y-3 transition-all duration-300 ${action.bgColor} border border-muted hover:border-primary/50`}
                >
                  <div className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold block">{action.title}</span>
                    <span className="text-xs text-muted-foreground">{action.description}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span>Yaklaşan Etkinlikler</span>
            </CardTitle>
            <CardDescription>
              Bu hafta ve önümüzdeki hafta düzenlenecek etkinlikler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex items-center justify-between p-4 border border-border rounded-lg transition-all duration-300 hover:bg-accent/30 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-muted group-hover:border-primary/50 transition-colors"
                    />
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{event.registered}/{event.capacity}</p>
                      <p className="text-xs text-muted-foreground">katılımcı</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
                      {event.category === 'workshop' && 'Atölye'}
                      {event.category === 'walk' && 'Yürüyüş'}
                      {event.category === 'seminar' && 'Seminer'}
                      {event.category === 'planting' && 'Dikim'}
                    </div>
                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Detay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Sistem Durumu</span>
            </CardTitle>
            <CardDescription>
              Sistem sağlığı ve son aktiviteler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Sistem Çalışıyor</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400">Aktif</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Veritabanı Bağlantısı</span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">Stabil</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Bildirim Servisi</span>
                </div>
                <span className="text-xs text-orange-600 dark:text-orange-400">8 aktif</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium mb-3">Son Aktiviteler</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Yeni kayıt: Bitki Tanıma Yürüyüşü</span>
                  <span className="text-xs text-muted-foreground">2s önce</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bildirim gönderildi: 15 kullanıcı</span>
                  <span className="text-xs text-muted-foreground">5d önce</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Yeni etkinlik eklendi</span>
                  <span className="text-xs text-muted-foreground">1h önce</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}