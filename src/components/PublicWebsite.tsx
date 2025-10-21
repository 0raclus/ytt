import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Calendar, Leaf, Bell, User, LogOut, Search, MapPin,
  Clock, Users, ArrowRight, Star, Award, TrendingUp,
  Menu, X, Moon, Sun, Home, BookOpen, Mail, Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export function PublicWebsite() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const [events, setEvents] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, plantsRes, regsRes, notifsRes] = await Promise.all([
        supabase.from('events').select('*').eq('status', 'active').limit(6),
        supabase.from('plants').select('*').limit(6),
        user ? supabase.from('event_registrations').select('event_id').eq('user_id', user.id) : { data: [] },
        user ? supabase.from('notifications').select('*').eq('user_id', user.id).limit(5) : { data: [] }
      ]);

      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      setPlants(plantsRes.data || []);
      setUserRegistrations((regsRes.data || []).map((r: any) => r.event_id));
      setNotifications(notifsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      toast({ title: "Giriş Gerekli", description: "Etkinliğe kaydolmak için giriş yapmalısınız.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from('event_registrations').insert([{
        event_id: eventId,
        user_id: user.id,
        status: 'confirmed'
      }]);

      if (error) throw error;

      setUserRegistrations([...userRegistrations, eventId]);
      toast({ title: "Başarılı!", description: "Etkinliğe kaydoldunuz." });
      loadData();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const cancelRegistration = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId);

      if (error) throw error;

      setUserRegistrations(userRegistrations.filter(id => id !== eventId));
      toast({ title: "İptal Edildi", description: "Kaydınız iptal edildi." });
      loadData();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const renderHome = () => (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/30 rounded-3xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Doğayla Bağlan, Yeşille Büyü
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Yenilikçi Teknoloji Takımı ile bitki yetiştirme, etkinlikler ve doğa tutkusu bir arada!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => setActiveView('events')} className="text-lg px-8">
              <Calendar className="mr-2 h-5 w-5" />
              Etkinlikleri Keşfet
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveView('plants')} className="text-lg px-8">
              <Leaf className="mr-2 h-5 w-5" />
              Bitki Kütüphanesi
            </Button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <Card className="text-center hover:shadow-xl transition-all duration-300 border-2">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Etkinlikler</CardTitle>
            <CardDescription>Atölyeler, yürüyüşler ve seminerler</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{events.length}+</p>
            <p className="text-sm text-muted-foreground">Aktif Etkinlik</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-xl transition-all duration-300 border-2">
          <CardHeader>
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle>Bitki Çeşitleri</CardTitle>
            <CardDescription>Zengin bitki veri tabanı</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{plants.length}+</p>
            <p className="text-sm text-muted-foreground">Kayıtlı Bitki</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-xl transition-all duration-300 border-2">
          <CardHeader>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Topluluk</CardTitle>
            <CardDescription>Aktif üyeler ve katılımcılar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-sm text-muted-foreground">Topluluk Üyesi</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Yaklaşan Etkinlikler</h2>
            <p className="text-muted-foreground">Hemen kaydol, yerine güvenle katıl</p>
          </div>
          <Button variant="outline" onClick={() => setActiveView('events')}>
            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map(event => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Calendar className="h-20 w-20 text-white opacity-50" />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3">{event.category_id || 'Etkinlik'}</Badge>
                  <h3 className="font-bold text-xl mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {event.current_participants || 0} / {event.capacity} katılımcı
                    </div>
                  </div>

                  {userRegistrations.includes(event.id) ? (
                    <Button variant="outline" className="w-full" onClick={() => cancelRegistration(event.id)}>
                      Kaydı İptal Et
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => registerForEvent(event.id)}>
                      Kaydol
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bitki Koleksiyonu</h2>
            <p className="text-muted-foreground">Yetiştirme rehberleri ve ipuçları</p>
          </div>
          <Button variant="outline" onClick={() => setActiveView('plants')}>
            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.slice(0, 3).map(plant => (
            <Card key={plant.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <img
                src={plant.image_url || 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg'}
                alt={plant.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-1">{plant.name}</h3>
                <p className="text-sm text-muted-foreground italic mb-3">{plant.scientific_name}</p>
                <p className="text-sm line-clamp-3">{plant.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tüm Etkinlikler</h1>
          <p className="text-muted-foreground">Doğa etkinliklerine katıl, deneyim kazan</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Etkinlik ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg py-6"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events
          .filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      e.description.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(event => (
          <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center relative">
              <Calendar className="h-20 w-20 text-white opacity-50" />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">{event.category_id || 'Etkinlik'}</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{event.description}</p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {event.current_participants || 0} / {event.capacity} katılımcı
                </div>
              </div>

              {userRegistrations.includes(event.id) ? (
                <Button variant="outline" className="w-full" onClick={() => cancelRegistration(event.id)}>
                  Kaydı İptal Et
                </Button>
              ) : (
                <Button className="w-full" onClick={() => registerForEvent(event.id)}>
                  Kaydol
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPlants = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Bitki Kütüphanesi</h1>
          <p className="text-muted-foreground">Bitki yetiştirme rehberleri ve bakım ipuçları</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Bitki ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg py-6"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants
          .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(plant => (
          <Card key={plant.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <img
              src={plant.image_url || 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg'}
              alt={plant.name}
              className="w-full h-56 object-cover"
            />
            <CardContent className="p-6">
              <Badge className="mb-3">{plant.difficulty_level === 'easy' ? 'Kolay' : plant.difficulty_level === 'medium' ? 'Orta' : 'Zor'}</Badge>
              <h3 className="font-bold text-xl mb-1">{plant.name}</h3>
              <p className="text-sm text-muted-foreground italic mb-3">{plant.scientific_name}</p>
              <p className="text-sm mb-4">{plant.description}</p>

              {plant.habitat && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Habitat:</span>
                  <p className="text-sm">{plant.habitat}</p>
                </div>
              )}

              {Array.isArray(plant.care_instructions) && plant.care_instructions.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-muted-foreground">Bakım İpuçları:</span>
                  <ul className="text-sm list-disc list-inside mt-1">
                    {plant.care_instructions.slice(0, 3).map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Profilim</CardTitle>
          <CardDescription>Hesap bilgileriniz ve kayıtlı etkinlikleriniz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-green-600">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{user?.full_name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {user?.department && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Bölüm</span>
                <p className="text-lg">{user.department}</p>
              </div>
            )}
            {user?.student_level && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Seviye</span>
                <p className="text-lg">{user.student_level}</p>
              </div>
            )}
            {user?.phone && (
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Telefon</span>
                <p className="text-lg">{user.phone}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Kayıtlı Etkinlikler</h4>
            <div className="space-y-3">
              {events.filter(e => userRegistrations.includes(e.id)).length === 0 ? (
                <p className="text-muted-foreground">Henüz kayıtlı etkinlik yok.</p>
              ) : (
                events.filter(e => userRegistrations.includes(e.id)).map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">{event.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => cancelRegistration(event.id)}>
                        İptal Et
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center">
            <Bell className="mr-3 h-8 w-8" />
            Bildirimler
          </CardTitle>
          <CardDescription>Son bildirimleriniz ve güncellemeler</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Henüz bildirim yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <Card key={notif.id} className={notif.read ? 'bg-muted/30' : 'border-l-4 border-l-green-500'}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: tr })}
                        </p>
                      </div>
                      <Badge variant={notif.type === 'info' ? 'secondary' : 'default'}>
                        {notif.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'home': return renderHome();
      case 'events': return renderEvents();
      case 'plants': return renderPlants();
      case 'profile': return renderProfile();
      case 'notifications': return renderNotifications();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">YTT Platform</h1>
              <p className="text-xs text-muted-foreground hidden md:block">Yenilikçi Teknoloji Takımı</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button variant={activeView === 'home' ? 'default' : 'ghost'} onClick={() => setActiveView('home')}>
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button variant={activeView === 'events' ? 'default' : 'ghost'} onClick={() => setActiveView('events')}>
              <Calendar className="h-4 w-4 mr-2" />
              Etkinlikler
            </Button>
            <Button variant={activeView === 'plants' ? 'default' : 'ghost'} onClick={() => setActiveView('plants')}>
              <Leaf className="h-4 w-4 mr-2" />
              Bitkiler
            </Button>
            <Button variant={activeView === 'notifications' ? 'default' : 'ghost'} onClick={() => setActiveView('notifications')}>
              <Bell className="h-4 w-4 mr-2" />
              {notifications.length > 0 && <Badge className="ml-1">{notifications.length}</Badge>}
            </Button>
            <Button variant={activeView === 'profile' ? 'default' : 'ghost'} onClick={() => setActiveView('profile')}>
              <User className="h-4 w-4 mr-2" />
              Profil
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Çıkış</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}>
              <Home className="h-4 w-4 mr-2" /> Ana Sayfa
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveView('events'); setMobileMenuOpen(false); }}>
              <Calendar className="h-4 w-4 mr-2" /> Etkinlikler
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveView('plants'); setMobileMenuOpen(false); }}>
              <Leaf className="h-4 w-4 mr-2" /> Bitkiler
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveView('notifications'); setMobileMenuOpen(false); }}>
              <Bell className="h-4 w-4 mr-2" /> Bildirimler {notifications.length > 0 && `(${notifications.length})`}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { setActiveView('profile'); setMobileMenuOpen(false); }}>
              <User className="h-4 w-4 mr-2" /> Profil
            </Button>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="border-t bg-card mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-lg">YTT</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Yenilikçi Teknoloji Takımı - Doğa ve teknoloji bir arada
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveView('home')} className="text-muted-foreground hover:text-foreground">Ana Sayfa</button></li>
                <li><button onClick={() => setActiveView('events')} className="text-muted-foreground hover:text-foreground">Etkinlikler</button></li>
                <li><button onClick={() => setActiveView('plants')} className="text-muted-foreground hover:text-foreground">Bitkiler</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  info@ytt.dev
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  +90 555 000 0000
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Topluluk</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Doğa tutkunu topluluğumuza katıl!
              </p>
              <Button variant="outline" className="w-full">
                Topluluğa Katıl
              </Button>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Yenilikçi Teknoloji Takımı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
