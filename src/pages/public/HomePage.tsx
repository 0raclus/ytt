// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, Leaf, Users, TrendingUp, ArrowRight, Star,
  MapPin, Clock, Award, BookOpen, FileText, Target, Lightbulb, Heart, Sparkles
} from 'lucide-react';
import { neonClient } from '@/lib/neon-client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomePage() {
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
      const [eventsRes, plantsRes, blogRes] = await Promise.all([
        neonClient.get('/events'),
        neonClient.get('/plants'),
        neonClient.get('/blog?limit=3'),
      ]);

      const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];
      const activeEvents = events.filter((e: any) => e.status === 'active');

      setStats({
        totalEvents: events.length,
        totalPlants: Array.isArray(plantsRes.data) ? plantsRes.data.length : 0,
        totalUsers: 0, // We don't expose user count publicly
        activeEvents: activeEvents.length,
      });

      setFeaturedEvents(activeEvents.slice(0, 3));
      setRecentPosts(Array.isArray(blogRes.data) ? blogRes.data : []);
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

      {/* Vision & Mission Section */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30 p-12 md:p-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 dark:bg-green-700/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-200/30 dark:bg-emerald-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-teal-200/30 dark:bg-teal-700/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center p-3 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Biz Kimiz?
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Yaşayan Tasarım Topluluğu (YTT), doğayı, tasarımı ve teknolojiyi bir araya getiren;
                üretmeyi, paylaşmayı ve birlikte öğrenmeyi seven insanların buluşma noktasıdır.
                Bizim için her proje sadece bir tasarım değil, aynı zamanda doğaya ve geleceğe bırakılan bir izdir.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <Card className="relative h-full border-2 border-green-200/50 dark:border-green-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
                        Misyonumuz
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Hayal gücümüzü doğayla harmanlayarak, üyelerimizin yeni şeyler keşfetmesini,
                      özgün işler üretmesini ve topluluk ruhunu yaşamasını sağlıyoruz.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Ortak projelerle, çevreye duyarlılık konusunda farkındalık oluşturuyor,
                      daha yaşanabilir bir dünya için adımlar atıyoruz.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <Heart className="h-3 w-3 mr-1" />
                        Keşfetmek
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <Users className="h-3 w-3 mr-1" />
                        Üretmek
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <Leaf className="h-3 w-3 mr-1" />
                        Farkındalık
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <Card className="relative h-full border-2 border-emerald-200/50 dark:border-emerald-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Lightbulb className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                        Vizyonumuz
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Yaratıcılığı, sürdürülebilirliği ve paylaşmayı merkezine alan bir topluluk inşa etmek.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      Doğayı koruyarak, şehirleri güzelleştirerek ve tasarımın gücüyle yaşamı dönüştürerek
                      geleceğe ilham veren bir yolculuk başlatmak.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Yaratıcılık
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                        <Leaf className="h-3 w-3 mr-1" />
                        Sürdürülebilirlik
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                        <Heart className="h-3 w-3 mr-1" />
                        Paylaşmak
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doğaya bırakılan her iz, geleceğe atılan bir adımdır
                </p>
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
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

