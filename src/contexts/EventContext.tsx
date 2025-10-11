import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const mappedEvents: Event[] = (data || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        date: e.date,
        time: e.time,
        location: e.location,
        capacity: e.capacity,
        registered: e.registered_count || 0,
        category: mapCategory(e.category_id),
        requirements: e.requirements || [],
        image: e.image_url || 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
        instructor: e.instructor,
        duration: e.duration || '2 saat',
        difficulty: e.difficulty
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error loading events from database:', error);
      toast({
        title: "Hata",
        description: "Etkinlikler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const mapCategory = (categoryId: string | null): 'workshop' | 'walk' | 'seminar' | 'planting' => {
    return 'workshop';
  };

  const getCategoryId = async (category: string): Promise<string | null> => {
    try {
      const { data } = await supabase
        .from('event_categories')
        .select('id')
        .eq('slug', getCategorySlug(category))
        .maybeSingle();

      return data?.id || null;
    } catch (error) {
      return null;
    }
  };

  const getCategorySlug = (category: string): string => {
    const map: Record<string, string> = {
      'workshop': 'workshops',
      'walk': 'walks',
      'seminar': 'seminars',
      'planting': 'planting'
    };
    return map[category] || 'workshops';
  };

  const loadUserRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('status', 'confirmed');

      if (!error && data) {
        setRegistrations(data.map(r => r.event_id));
        return;
      }
    } catch (error) {
      console.error('Error loading registrations from database:', error);
    }

    const savedRegistrations = localStorage.getItem(`user_registrations_${user.id}`);
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  };

  const saveUserRegistrations = (newRegistrations: string[]) => {
    if (user) {
      localStorage.setItem(`user_registrations_${user.id}`, JSON.stringify(newRegistrations));
      setRegistrations(newRegistrations);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'>): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Gerekli",
        description: "Etkinlik eklemek için giriş yapmalısınız.",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const categoryId = await getCategoryId(eventData.category);

      const { data, error } = await supabase
          .from('events')
          .insert({
            title: eventData.title,
            slug: eventData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            description: eventData.description,
            instructor: eventData.instructor,
            date: eventData.date,
            time: eventData.time,
            duration: eventData.duration,
            location: eventData.location,
            capacity: eventData.capacity,
            category_id: categoryId,
            difficulty: eventData.difficulty,
            requirements: eventData.requirements,
            image_url: eventData.image,
            status: 'active',
            is_free: true,
            materials_provided: true,
            created_by: user?.id
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const newEvent: Event = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            date: data.date,
            time: data.time,
            location: data.location,
            capacity: data.capacity,
            registered: 0,
            category: eventData.category,
            requirements: data.requirements || [],
            image: data.image_url || eventData.image,
            instructor: data.instructor,
            duration: data.duration || '2 saat',
            difficulty: data.difficulty
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
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.date) dbUpdates.date = updates.date;
      if (updates.time) dbUpdates.time = updates.time;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.capacity) dbUpdates.capacity = updates.capacity;
      if (updates.instructor) dbUpdates.instructor = updates.instructor;
      if (updates.duration) dbUpdates.duration = updates.duration;
      if (updates.difficulty) dbUpdates.difficulty = updates.difficulty;

      const { error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      ));

      toast({
        title: "Etkinlik Güncellendi!",
        description: "Etkinlik başarıyla güncellendi.",
      });

      return true;
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
        .eq('user_id', user.id)
        .eq('event_id', eventId);

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
