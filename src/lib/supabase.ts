// Neon PostgreSQL API Client
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },
  async post(endpoint: string, data: unknown) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
  },
};

// Supabase-compatible mock
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({ then: async (r: (v: { data: unknown[]; error: null }) => void) => r({ data: [], error: null }) }),
      order: () => ({ then: async (r: (v: { data: unknown[]; error: null }) => void) => r({ data: [], error: null }) }),
      then: async (r: (v: { data: unknown[]; error: null }) => void) => r({ data: [], error: null })
    }),
    insert: () => ({ then: async (r: (v: { data: unknown; error: null }) => void) => r({ data: null, error: null }) }),
    update: () => ({ eq: () => ({ then: async (r: (v: { error: null }) => void) => r({ error: null }) }) }),
    delete: () => ({ eq: () => ({ then: async (r: (v: { error: null }) => void) => r({ error: null }) }) })
  }),
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Not implemented' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Not implemented' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  channel: () => ({ on: () => ({ subscribe: () => {} }) }),
  removeChannel: () => {},
};
