import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, Leaf, Users, TrendingUp, ArrowRight, Star,
  MapPin, Clock, Award, BookOpen, FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalPlants: 0,
    totalUsers: 0,
    activeEvents: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [eventsRes, plantsRes, usersRes, postsRes] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact' }),
        supabase.from('plants').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('user_id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
      ]);

      const activeEvents = eventsRes.data?.filter((e: any) => e.status === 'active') || [];

      setStats({
        totalEvents: eventsRes.count || 0,
        totalPlants: plantsRes.count || 0,
        totalUsers: usersRes.count || 0,
        activeEvents: activeEvents.length,
      });

      setFeaturedEvents(activeEvents.slice(0, 3));
      setRecentPosts(postsRes.data || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/30 rounded-3xl"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Doğayla Bağlan, Yeşille Büyü
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Yenilikçi Teknoloji Takımı ile bitki yetiştirme, etkinlikler ve doğa tutkusu bir arada!
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/events">
                <Button size="lg" className="text-lg px-8">
                  <Calendar className="mr-2 h-5 w-5" />
                  Etkinlikleri Keşfet
                </Button>
              </Link>
              <Link to="/plants">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Leaf className="mr-2 h-5 w-5" />
                  Bitki Kütüphanesi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Etkinlik</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeEvents} aktif etkinlik
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bitki Türü</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlants}</div>
              <p className="text-xs text-muted-foreground">
                Kütüphanemizde
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Aktif kullanıcı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                Katılımcı memnuniyeti
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Öne Çıkan Etkinlikler</h2>
            <p className="text-muted-foreground mt-2">Yaklaşan etkinliklere göz atın</p>
          </div>
          <Link to="/events">
            <Button variant="outline">
              Tümünü Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={event.image_url || 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg'}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">
                    {event.difficulty === 'beginner' ? 'Başlangıç' : event.difficulty === 'intermediate' ? 'Orta' : 'İleri'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.registered_count || 0}/{event.capacity} katılımcı
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Son Yazılar</h2>
              <p className="text-muted-foreground mt-2">Blog'dan en son haberler</p>
            </div>
            <Link to="/blog">
              <Button variant="outline">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featured_image && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/30 border-none">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Topluluğumuza Katılın</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Doğa severlerle tanışın, etkinliklere katılın ve bitki yetiştirme deneyiminizi paylaşın.
            </p>
            {!user ? (
              <Link to="/login">
                <Button size="lg" className="text-lg px-8">
                  Hemen Üye Ol
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/events">
                <Button size="lg" className="text-lg px-8">
                  Etkinliklere Katıl
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

