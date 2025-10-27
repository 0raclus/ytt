// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/EventCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Search, Filter, Plus, Users, MapPin, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { neonClient } from '@/lib/neon-client';

interface EventStats {
  thisMonthEvents: number;
  newEventsThisMonth: number;
  totalRegistrations: number;
  newRegistrationsThisWeek: number;
  fillRate: number;
  userRegisteredCount: number;
}

export function EventManager() {
  const { user, isAuthenticated } = useAuth();
  const { events, registerForEvent, unregisterFromEvent, getUserRegistrations, loading, refreshEvents } = useEvents();
  const registeredEvents = getUserRegistrations();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [stats, setStats] = useState<EventStats>({
    thisMonthEvents: 0,
    newEventsThisMonth: 0,
    totalRegistrations: 0,
    newRegistrationsThisWeek: 0,
    fillRate: 0,
    userRegisteredCount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const userId = user?.uid || '';
      const response = await neonClient.get(`/events/stats?user_id=${userId}`);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Gerekli",
        description: "Etkinliğe kayıt olmak için önce giriş yapmalısınız.",
        variant: "destructive"
      });
      return;
    }

    await registerForEvent(eventId);
  };

  const getFilteredAndSortedEvents = () => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      
      const eventDate = new Date(event.date);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'week':
          matchesDate = eventDate >= today && eventDate <= nextWeek;
          break;
        case 'month':
          matchesDate = eventDate >= today && eventDate <= nextMonth;
          break;
        case 'past':
          matchesDate = eventDate < today;
          break;
      }
      
      return matchesSearch && matchesCategory && matchesDate;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'name':
          return a.title.localeCompare(b.title, 'tr');
        case 'capacity':
          return b.capacity - a.capacity;
        case 'registered':
          return b.registered - a.registered;
        case 'availability':
          return (b.capacity - b.registered) - (a.capacity - a.registered);
        default:
          return 0;
      }
    });
  };

  const filteredEvents = getFilteredAndSortedEvents();

  const categoryLabels = {
    all: 'Tüm Kategoriler',
    workshop: 'Atölyeler',
    walk: 'Yürüyüşler',
    seminar: 'Seminerler',
    planting: 'Dikim Etkinlikleri'
  };

  const dateLabels = {
    all: 'Tüm Tarihler',
    today: 'Bugün',
    week: 'Bu Hafta',
    month: 'Bu Ay',
    past: 'Geçmiş'
  };

  const sortLabels = {
    date: 'Tarihe Göre',
    name: 'İsme Göre',
    capacity: 'Kapasiteye Göre',
    registered: 'Kayıt Sayısına Göre',
    availability: 'Müsaitliğe Göre'
  };

  const eventStats = [
    {
      title: 'Bu Ay',
      value: `${events.length} Etkinlik`,
      change: '+2 yeni',
      icon: CalendarDays,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Toplam Katılımcı',
      value: `${totalRegistrations} Kişi`,
      change: '+15 bu hafta',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      title: 'Doluluk Oranı',
      value: `%${averageFillRate}`,
      change: 'Ortalama',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      title: 'Kayıtlı Etkinliklerim',
      value: `${registeredEvents.length} Etkinlik`,
      change: 'Aktif kayıtlar',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Etkinlik Yönetimi</h1>
              <p className="text-lg text-muted-foreground">
                Bitki ve doğa temalı etkinliklere katılın, yeni şeyler öğrenin.
              </p>
            </div>
          </div>
          <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span>Yeni Etkinlik Öner</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {eventStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Advanced Search & Filters */}
        <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Etkinlik, lokasyon, eğitmen ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900"
                />
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-white dark:bg-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tarih</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-white dark:bg-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dateLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sıralama</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white dark:bg-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sortLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aksiyonlar</label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setDateFilter('all');
                      setSortBy('date');
                    }}
                    className="w-full bg-white dark:bg-gray-900"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Sıfırla
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || categoryFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Aktif filtreler:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-2">
                      Arama: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}>×</button>
                    </Badge>
                  )}
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-2">
                      {categoryLabels[categoryFilter as keyof typeof categoryLabels]}
                      <button onClick={() => setCategoryFilter('all')}>×</button>
                    </Badge>
                  )}
                  {dateFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-2">
                      {dateLabels[dateFilter as keyof typeof dateLabels]}
                      <button onClick={() => setDateFilter('all')}>×</button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      {filteredEvents.length !== events.length && (
        <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border">
          <p className="text-sm">
            <span className="font-medium">{filteredEvents.length}</span> etkinlik bulundu
            {events.length !== filteredEvents.length && (
              <span className="text-muted-foreground"> (toplam {events.length} etkinlikten)</span>
            )}
          </p>
          <Badge variant="outline" className="text-xs">
            {sortLabels[sortBy as keyof typeof sortLabels]} sıralandı
          </Badge>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={handleRegister}
            isRegistered={registeredEvents.includes(event.id)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Etkinlik Bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              Arama kriterlerinize uygun etkinlik bulunamadı. Lütfen farklı filtreler deneyin veya yeni etkinlik önerisi gönderin.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDateFilter('all');
                }}
                variant="outline"
              >
                Filtreleri Temizle
              </Button>
              <Button>
                Yeni Etkinlik Öner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Events Summary */}
      {registeredEvents.length > 0 && (
        <Card className="border-2 border-dashed border-primary/25 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Kayıtlı Etkinliklerim</span>
            </CardTitle>
            <CardDescription>
              {registeredEvents.length} etkinliğe kayıt oldunuz. Etkinlik tarihlerinden 1 saat önce size hatırlatma gönderilecek.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}