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

      {/* Vision & Mission Section - Ultra Professional */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950/40 dark:to-teal-950/40 p-12 md:p-20 shadow-2xl">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(16 185 129 / 0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Floating Animated Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Orb 1 - Top Left */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-green-400/30 to-emerald-500/30 dark:from-green-600/20 dark:to-emerald-700/20 rounded-full blur-3xl animate-pulse-slow"></div>

            {/* Orb 2 - Bottom Right */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 dark:from-emerald-600/20 dark:to-teal-700/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            {/* Orb 3 - Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-green-500/20 dark:from-teal-600/15 dark:to-green-700/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

            {/* Floating Particles */}
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-1/4 w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-teal-400 dark:bg-teal-500 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-16">
            {/* Header with Animated Icon */}
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl backdrop-blur-md border border-emerald-200/50 dark:border-emerald-700/50 hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent animate-fade-in-up">
                  Biz Kimiz?
                </h2>

                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full"></div>
              </div>

              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Yaşayan Tasarım Topluluğu (YTT), doğayı, tasarımı ve teknolojiyi bir araya getiren;
                üretmeyi, paylaşmayı ve birlikte öğrenmeyi seven insanların buluşma noktasıdır.
              </p>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed italic animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Bizim için her proje sadece bir tasarım değil, aynı zamanda doğaya ve geleceğe bırakılan bir izdir.
              </p>
            </div>

            {/* Mission & Vision Cards with Advanced Animations */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Mission Card */}
              <div className="group relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700"></div>

                {/* Card */}
                <Card className="relative h-full border-2 border-green-200/60 dark:border-green-700/60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:border-green-400 dark:hover:border-green-500 overflow-hidden">
                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 group-hover:h-2 transition-all duration-500"></div>

                  <CardHeader className="space-y-6 pt-8">
                    <div className="flex items-center space-x-4">
                      {/* Animated Icon Container */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Target className="h-10 w-10 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                          Misyonumuz
                        </CardTitle>
                        <div className="h-0.5 w-20 bg-gradient-to-r from-green-500 to-emerald-500 mt-2 group-hover:w-full transition-all duration-500"></div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pb-8">
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                        Hayal gücümüzü doğayla harmanlayarak, üyelerimizin yeni şeyler keşfetmesini,
                        özgün işler üretmesini ve topluluk ruhunu yaşamasını sağlıyoruz.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                        Ortak projelerle, çevreye duyarlılık konusunda farkındalık oluşturuyor,
                        daha yaşanabilir bir dünya için adımlar atıyoruz.
                      </p>
                    </div>

                    {/* Animated Badges */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Heart className="h-4 w-4 mr-2 animate-pulse" />
                        Keşfetmek
                      </Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Users className="h-4 w-4 mr-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        Üretmek
                      </Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Leaf className="h-4 w-4 mr-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        Farkındalık
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vision Card */}
              <div className="group relative animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700"></div>

                {/* Card */}
                <Card className="relative h-full border-2 border-emerald-200/60 dark:border-emerald-700/60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:border-emerald-400 dark:hover:border-emerald-500 overflow-hidden">
                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 group-hover:h-2 transition-all duration-500"></div>

                  <CardHeader className="space-y-6 pt-8">
                    <div className="flex items-center space-x-4">
                      {/* Animated Icon Container */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Lightbulb className="h-10 w-10 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                          Vizyonumuz
                        </CardTitle>
                        <div className="h-0.5 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mt-2 group-hover:w-full transition-all duration-500"></div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pb-8">
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                        Yaratıcılığı, sürdürülebilirliği ve paylaşmayı merkezine alan bir topluluk inşa etmek.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                        Doğayı koruyarak, şehirleri güzelleştirerek ve tasarımın gücüyle yaşamı dönüştürerek
                        geleceğe ilham veren bir yolculuk başlatmak.
                      </p>
                    </div>

                    {/* Animated Badges */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Yaratıcılık
                      </Badge>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Leaf className="h-4 w-4 mr-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        Sürdürülebilirlik
                      </Badge>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 hover:scale-110 hover:shadow-lg transition-all duration-300 px-4 py-2 text-sm font-medium">
                        <Heart className="h-4 w-4 mr-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        Paylaşmak
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Inspirational Quote */}
            <div className="text-center pt-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <div className="relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-white/90 via-emerald-50/90 to-white/90 dark:from-gray-800/90 dark:via-emerald-950/50 dark:to-gray-800/90 rounded-full shadow-2xl backdrop-blur-md border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:scale-105 transition-all duration-500 group">
                {/* Animated Stars */}
                <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400 animate-pulse group-hover:rotate-180 transition-transform duration-700" />

                <p className="text-base md:text-lg font-semibold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Doğaya bırakılan her iz, geleceğe atılan bir adımdır
                </p>

                <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400 animate-pulse group-hover:rotate-180 transition-transform duration-700" style={{ animationDelay: '0.5s' }} />

                {/* Sparkle Effect on Hover */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.2s' }}></div>
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

