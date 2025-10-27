// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  capacity: number;
  current_participants: number;
  category: string;
  difficulty: string;
  requirements: string[];
  image_url: string;
  status: string;
  created_at: string;
}

interface Registration {
  id: string;
  user_id: string;
  status: string;
  registered_at: string;
  user_profiles: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Registration[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    instructor: '',
    capacity: 20,
    category: '',
    difficulty: 'Başlangıç',
    requirements: '',
    image_url: '',
    status: 'upcoming',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Hata',
        description: 'Etkinlikler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          user_profiles (
            full_name,
            email,
            phone
          )
        `)
        .eq('event_id', eventId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        title: 'Hata',
        description: 'Katılımcılar yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        ...formData,
        requirements: formData.requirements
          ? formData.requirements.split(',').map((r) => r.trim())
          : [],
        capacity: Number(formData.capacity),
      };

      if (selectedEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', selectedEvent.id);

        if (error) throw error;

        toast({
          title: 'Başarılı!',
          description: 'Etkinlik güncellendi.',
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([{ ...eventData, current_participants: 0 }]);

        if (error) throw error;

        toast({
          title: 'Başarılı!',
          description: 'Etkinlik oluşturuldu.',
        });
      }

      setDialogOpen(false);
      resetForm();
      loadEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Etkinlik kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      instructor: event.instructor,
      capacity: event.capacity,
      category: event.category,
      difficulty: event.difficulty,
      requirements: event.requirements?.join(', ') || '',
      image_url: event.image_url,
      status: event.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Başarılı!',
        description: 'Etkinlik silindi.',
      });
      loadEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Etkinlik silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleViewParticipants = async (event: Event) => {
    setSelectedEvent(event);
    await loadParticipants(event.id);
    setParticipantsDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      instructor: '',
      capacity: 20,
      category: '',
      difficulty: 'Başlangıç',
      requirements: '',
      image_url: '',
      status: 'upcoming',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Etkinlik Yönetimi</h1>
          <p className="text-muted-foreground">
            Etkinlikleri oluşturun, düzenleyin ve katılımcıları yönetin
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Etkinlik
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}
              </DialogTitle>
              <DialogDescription>
                Etkinlik bilgilerini doldurun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Açıklama *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Tarih *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Saat *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Konum *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructor">Eğitmen *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Kapasite *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Workshop, Eğitim, vb."
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Zorluk</Label>
                  <select
                    id="difficulty"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                  >
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta">Orta</option>
                    <option value="İleri">İleri</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="upcoming">Yaklaşan</option>
                    <option value="ongoing">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="requirements">Gereksinimler (virgülle ayırın)</Label>
                  <Input
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    placeholder="Not defteri, Kalem, Laptop"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="image_url">Görsel URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {selectedEvent ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Etkinlikler</CardTitle>
          <CardDescription>
            Toplam {events.length} etkinlik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Katılımcı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(event.date), 'dd MMM yyyy', { locale: tr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewParticipants(event)}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      {event.current_participants || 0} / {event.capacity}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === 'upcoming'
                          ? 'default'
                          : event.status === 'ongoing'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {event.status === 'upcoming'
                        ? 'Yaklaşan'
                        : event.status === 'ongoing'
                        ? 'Devam Ediyor'
                        : event.status === 'completed'
                        ? 'Tamamlandı'
                        : 'İptal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Katılımcılar - {selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Toplam {participants.length} katılımcı
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Henüz katılımcı yok
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">
                        {participant.user_profiles?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{participant.user_profiles?.email || 'N/A'}</TableCell>
                      <TableCell>{participant.user_profiles?.phone || '-'}</TableCell>
                      <TableCell>
                        {format(new Date(participant.registered_at), 'dd MMM yyyy HH:mm', {
                          locale: tr,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            participant.status === 'registered'
                              ? 'default'
                              : participant.status === 'attended'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {participant.status === 'registered'
                            ? 'Kayıtlı'
                            : participant.status === 'attended'
                            ? 'Katıldı'
                            : 'İptal'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

