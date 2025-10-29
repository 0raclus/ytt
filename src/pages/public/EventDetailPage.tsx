// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Heart,
  CheckCircle, AlertCircle, User, Award, Info
} from 'lucide-react';
import { neonClient } from '@/lib/neon-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
      if (user) {
        checkRegistration();
      }
    }
  }, [id, user]);

  const loadEvent = async () => {
    try {
      const response = await neonClient.get(`/events/${id}`);

      if (response.error) throw new Error(response.error.message);
      if (response.data) {
        setEvent(response.data);
      }
    } catch (error) {
      console.error('Error loading event:', error);
      toast({
        title: 'Hata',
        description: 'Etkinlik yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!user || !id) return;

    try {
      const response = await neonClient.get(`/registrations/check?user_id=${user.id}&event_id=${id}`);
      setIsRegistered(response.data?.isRegistered || false);
    } catch (error) {
      // No registration found is not an error
      setIsRegistered(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Giriş Gerekli',
        description: 'Etkinliğe kayıt olmak için giriş yapmalısınız.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      const response = await neonClient.post('/registrations', {
        user_id: user!.id,
        event_id: id,
      });

      if (response.error) throw new Error(response.error.message);

      setIsRegistered(true);
      toast({
        title: 'Başarılı!',
        description: 'Etkinliğe başarıyla kaydoldunuz.',
      });
      loadEvent();
    } catch (error: any) {
      console.error('Error registering:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Kayıt sırasında bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', user!.id)
        .eq('event_id', id);

      if (error) throw error;

      // Update current_participants count
      await supabase
        .from('events')
        .update({ current_participants: Math.max(0, (event.current_participants || 0) - 1) })
        .eq('id', id);

      setIsRegistered(false);
      toast({
        title: 'İptal Edildi',
        description: 'Etkinlik kaydınız iptal edildi.',
      });
      loadEvent();
    } catch (error: any) {
      console.error('Error unregistering:', error);
      toast({
        title: 'Hata',
        description: error.message || 'İptal sırasında bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Etkinlik Bulunamadı</h2>
            <p className="text-muted-foreground mb-6">Aradığınız etkinlik mevcut değil.</p>
            <Link to="/events">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Etkinliklere Dön
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFull = (event.current_participants || 0) >= event.capacity;
  const spotsLeft = event.capacity - (event.current_participants || 0);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/events">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Etkinliklere Dön
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {event.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{event.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{event.difficulty === 'beginner' ? 'Başlangıç' : event.difficulty === 'intermediate' ? 'Orta' : 'İleri'}</Badge>
                    <Badge variant="outline">{event.status === 'active' ? 'Aktif' : event.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Açıklama</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>

              {event.requirements && event.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Gereksinimler</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {event.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Eğitmen</p>
                    <p className="text-sm text-muted-foreground">{event.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Süre</p>
                    <p className="text-sm text-muted-foreground">{event.duration || '2 saat'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Etkinlik Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Tarih</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Saat</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Konum</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Katılımcı</p>
                  <p className="text-sm text-muted-foreground">
                    {event.current_participants || 0} / {event.capacity}
                  </p>
                  {spotsLeft > 0 && spotsLeft <= 5 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Sadece {spotsLeft} kişilik yer kaldı!
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {isRegistered ? (
                <Button
                  onClick={handleUnregister}
                  disabled={registering}
                  variant="outline"
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {registering ? 'İşleniyor...' : 'Kaydı İptal Et'}
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={registering || isFull}
                  className="w-full"
                >
                  {registering ? 'İşleniyor...' : isFull ? 'Kontenjan Dolu' : 'Kayıt Ol'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

