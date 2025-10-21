// API client for Neon PostgreSQL backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },

  async put(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },

  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  },
};

// Legacy supabase object for compatibility
export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: async (column: string, value: any) => {
        const data = await api.get(`/${table}?${column}=${value}`);
        return { data, error: null };
      },
      order: (column: string, options?: any) => ({
        then: async (callback: any) => {
          const data = await api.get(`/${table}`);
          return callback({ data, error: null });
        }
      }),
      then: async (callback: any) => {
        const data = await api.get(`/${table}`);
        return callback({ data, error: null });
      }
    }),
    insert: async (values: any) => {
      const data = await api.post(`/${table}`, values);
      return { data, error: null };
    },
    update: async (values: any) => ({
      eq: async (column: string, value: any) => {
        const data = await api.put(`/${table}/${value}`, values);
        return { data, error: null };
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        await api.delete(`/${table}/${value}`);
        return { error: null };
      }
    })
  }),
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Auth not implemented yet' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Auth not implemented yet' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash?: string;
          full_name: string;
          role: 'admin' | 'user' | 'moderator';
          avatar_url?: string;
          department?: string;
          student_level?: string;
          phone?: string;
          bio?: string;
          preferences: {
            notifications: boolean;
            newsletter: boolean;
            reminder_time: number;
            language: string;
            theme: string;
          };
          created_at: string;
          updated_at: string;
          last_login?: string;
          is_active: boolean;
          email_verified: boolean;
          two_factor_enabled: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          instructor: string;
          date: string;
          time: string;
          end_time?: string;
          duration: string;
          location: string;
          capacity: number;
          registered_count: number;
          waiting_list_count: number;
          category_id?: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          requirements: string[];
          image_url?: string;
          gallery_images: string[];
          status: 'active' | 'cancelled' | 'completed' | 'draft' | 'postponed';
          price: number;
          is_free: boolean;
          tags: string[];
          meeting_point?: string;
          parking_info?: string;
          weather_dependent: boolean;
          min_age?: number;
          max_age?: number;
          materials_provided: boolean;
          certificate_provided: boolean;
          created_by?: string;
          approved_by?: string;
          approved_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'registered_count' | 'waiting_list_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      plants: {
        Row: {
          id: string;
          name: string;
          scientific_name: string;
          common_names: string[];
          description: string;
          characteristics: string[];
          habitat: string;
          native_region?: string;
          uses: string[];
          care_instructions: string[];
          image_url?: string;
          gallery_images: string[];
          seasonal_info: {
            blooming: string;
            planting: string;
            harvesting: string;
          };
          growth_info: {
            height: string;
            spread: string;
            growth_rate: string;
          };
          environmental_needs: {
            sunlight: string;
            water: string;
            soil_type: string;
            temperature_min: number;
            temperature_max: number;
            humidity: string;
          };
          tags: string[];
          category_id?: string;
          difficulty_level: 'easy' | 'medium' | 'hard';
          toxicity_info?: string;
          conservation_status?: string;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['plants']['Insert']>;
      };
      event_registrations: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          registered_at: string;
          status: 'confirmed' | 'cancelled' | 'waitlist' | 'completed' | 'no_show';
          notes?: string;
          dietary_requirements?: string;
          emergency_contact?: Record<string, any>;
          attendance_confirmed: boolean;
          feedback?: Record<string, any>;
          rating?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['event_registrations']['Row'], 'id' | 'registered_at' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['event_registrations']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
          category: 'system' | 'event' | 'admin' | 'marketing';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          read: boolean;
          read_at?: string;
          event_id?: string;
          action_url?: string;
          expires_at?: string;
          scheduled_for?: string;
          sent_at?: string;
          delivery_method: string[];
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
          interests: string[];
          emergency_contact: Record<string, any>;
          dietary_restrictions: string[];
          medical_conditions: string[];
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          social_links: Record<string, any>;
          privacy_settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id?: string;
          action: string;
          resource_type: string;
          resource_id?: string;
          old_values?: Record<string, any>;
          new_values?: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          session_id?: string;
          additional_info?: Record<string, any>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      system_settings: {
        Row: {
          id: string;
          key: string;
          value: any;
          description?: string;
          category: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['system_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['system_settings']['Insert']>;
      };
    };
  };
}

// Helper functions with error handling
export const getUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Exception in getUser:', error);
    return null;
  }
};

export const getEvents = async (filters?: {
  category?: string;
  status?: string;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const getPlants = async () => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting plants:', error);
    return [];
  }
};

export const registerForEvent = async (userId: string, eventId: string, notes?: string) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: userId,
        event_id: eventId,
        notes,
        status: 'confirmed'
      })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const getUserRegistrations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user registrations:', error);
    return [];
  }
};

export const createNotification = async (notification: Database['public']['Tables']['notifications']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return [];
  }
};

export const logAuditEvent = async (log: Database['public']['Tables']['audit_logs']['Insert']) => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert(log);
    
    if (error) {
      // Silently skip RLS policy errors for audit logging
      if (error.code === '42501' || 
          error.code === '42P17' ||
          error.message?.includes('row-level security policy') ||
          error.message?.includes('infinite recursion')) {
        return;
      }
      return;
    }
  } catch (error) {
    // Silently continue without audit logging if any error occurs
  }
};

// Analytics functions
export const getSystemMetrics = async () => {
  try {
    const [usersResult, eventsResult, registrationsResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('event_registrations').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: usersResult.count || 0,
      totalEvents: eventsResult.count || 0,
      totalRegistrations: registrationsResult.count || 0,
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return {
      totalUsers: 0,
      totalEvents: 0,
      totalRegistrations: 0,
    };
  }
};

export const getEventAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        category_id,
        registered_count,
        capacity,
        status
      `);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting event analytics:', error);
    return [];
  }
};

// Real-time subscriptions
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToEvents = (callback: (payload: any) => void) => {
  return supabase
    .channel('events')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events'
      },
      callback
    )
    .subscribe();
};