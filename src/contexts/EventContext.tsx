import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { neonClient } from '@/lib/neon-client';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<boolean>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  registerForEvent: (eventId: string) => Promise<boolean>;
  unregisterFromEvent: (eventId: string) => Promise<boolean>;
  getUserRegistrations: () => string[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [user]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await neonClient.get('/events?upcoming=true');

      if (response.data) {
        const mappedEvents: Event[] = response.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date.split('T')[0],
          time: e.time.substring(0, 5),
          location: e.location,
          capacity: e.capacity,
          registered: e.registered_count || 0,
          category: e.category_slug || 'workshop',
          requirements: e.requirements || [],
          image: e.image_url || 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
          instructor: e.instructor,
          duration: e.duration || '2 saat',
          difficulty: e.difficulty || 'beginner'
        }));

        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Hata",
        description: "Etkinlikler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserRegistrations = async () => {
    if (!user) return;

    try {
      const response = await neonClient.get(`/registrations/user/${user.id}`);

      if (response.data) {
        const eventIds = response.data.map((r: any) => r.event_id);
        setRegistrations(eventIds);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'>): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Giriş Gerekli",
        description: "Etkinlik eklemek için giriş yapmalısınız.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const response = await neonClient.post('/events', {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        capacity: eventData.capacity,
        category: eventData.category,
        requirements: eventData.requirements,
        image_url: eventData.image,
        instructor: eventData.instructor,
        duration: eventData.duration,
        difficulty: eventData.difficulty,
        user_id: user.id
      });

      if (response.data) {
        const dbData = response.data as any;
        const newEvent: Event = {
          id: dbData.id,
          title: dbData.title,
          description: dbData.description,
          date: dbData.date.split('T')[0],
          time: dbData.time.substring(0, 5),
          location: dbData.location,
          capacity: dbData.capacity,
          registered: dbData.registered_count || 0,
          category: eventData.category,
          requirements: dbData.requirements || [],
          image: dbData.image_url || eventData.image,
          instructor: dbData.instructor,
          duration: dbData.duration || '2 saat',
          difficulty: dbData.difficulty
        };

          setEvents(prev => [newEvent, ...prev]);
        }

      toast({
        title: "Etkinlik Eklendi!",
        description: `${eventData.title} başarıyla oluşturuldu.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Hata",
        description: "Etkinlik eklenirken bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Gerekli",
        description: "Etkinlik güncellemek için giriş yapmalısınız.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const response = await neonClient.put(`/events/${id}`, {
        title: updates.title,
        description: updates.description,
        date: updates.date,
        time: updates.time,
        location: updates.location,
        capacity: updates.capacity,
        category: updates.category,
        requirements: updates.requirements,
        image_url: updates.image,
        instructor: updates.instructor,
        duration: updates.duration,
        difficulty: updates.difficulty
      });

      if (response.data) {
        setEvents(prev => prev.map(event =>
          event.id === id ? { ...event, ...updates } : event
        ));

        toast({
          title: "Etkinlik Güncellendi!",
          description: "Etkinlik başarıyla güncellendi.",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Hata",
        description: "Etkinlik güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast({
        title: "Yetki Yok",
        description: "Bu işlem için admin yetkisi gerekli.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));

      const newRegistrations = registrations.filter(regId => regId !== id);
      saveUserRegistrations(newRegistrations);

      toast({
        title: "Etkinlik Silindi!",
        description: "Etkinlik başarıyla silindi.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Hata",
        description: "Etkinlik silinirken bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Giriş Gerekli",
        description: "Etkinliğe kayıt olmak için giriş yapmalısınız.",
        variant: "destructive"
      });
      return false;
    }

    if (registrations.includes(eventId)) {
      toast({
        title: "Zaten Kayıtlı",
        description: "Bu etkinliğe zaten kayıt oldunuz.",
        variant: "destructive"
      });
      return false;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) {
      toast({
        title: "Etkinlik Bulunamadı",
        description: "Bu etkinlik artık mevcut değil.",
        variant: "destructive"
      });
      return false;
    }

    if (event.registered >= event.capacity) {
      toast({
        title: "Etkinlik Dolu",
        description: "Bu etkinlik kapasitesi dolu.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: eventId,
          status: 'confirmed'
        });

      if (error) throw error;

      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, registered: e.registered + 1 } : e
      ));

      const newRegistrations = [...registrations, eventId];
      saveUserRegistrations(newRegistrations);

      toast({
        title: "Kayıt Başarılı!",
        description: `${event.title} etkinliğine kayıt oldunuz.`,
      });

      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Hata",
        description: "Kayıt sırasında bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Giriş Gerekli",
        description: "İşlem için giriş yapmalısınız.",
        variant: "destructive"
      });
      return false;
    }

    if (!registrations.includes(eventId)) {
      toast({
        title: "Kayıt Yok",
        description: "Bu etkinliğe kayıtlı değilsiniz.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(prev => prev.map(e =>
        e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e
      ));

      const newRegistrations = registrations.filter(id => id !== eventId);
      saveUserRegistrations(newRegistrations);

      const event = events.find(e => e.id === eventId);
      toast({
        title: "Kayıt İptal Edildi",
        description: `${event?.title} etkinliğinden kayıt iptal edildi.`,
      });

      return true;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Hata",
        description: "İptal sırasında bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserRegistrations = (): string[] => {
    return registrations;
  };

  const refreshEvents = async () => {
    setLoading(true);
    try {
      await loadEvents();
      toast({
        title: "Güncellendi",
        description: "Etkinlikler güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Güncellenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      unregisterFromEvent,
      getUserRegistrations,
      loading,
      refreshEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
