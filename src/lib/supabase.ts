const API_URL = import.meta.env.VITE_API_URL || '/api';
interface ApiResponse<T> { data: T | null; error: { message: string } | null; }
class NeonAPIClient {
  private baseURL: string;
  constructor(baseURL: string) { this.baseURL = baseURL; }
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
      if (!res.ok) { const errorText = await res.text(); return { data: null, error: { message: errorText || res.statusText } }; }
      const data = await res.json();
      return { data, error: null };
    } catch (error) { return { data: null, error: { message: error instanceof Error ? error.message : 'Unknown error' } }; }
  }
  async get<T>(endpoint: string): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { method: 'GET' }); }
  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> { return this.request<T>(endpoint, { method: 'DELETE' }); }
}
export const api = new NeonAPIClient(API_URL);
export const supabase = {
  from: (table: string) => ({
    select: (_columns = '*') => ({
      eq: (_column: string, _value: unknown) => ({ eq: (_column2: string, _value2: unknown) => ({ order: (_orderCol: string, _opts?: { ascending?: boolean }) => ({ limit: (_count: number) => ({ then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), order: (_orderCol: string, _opts?: { ascending?: boolean }) => ({ limit: (_count: number) => ({ then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), limit: (_count: number) => ({ then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }),
      order: (_column: string, _opts?: { ascending?: boolean }) => ({ limit: (_count: number) => ({ then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }), then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }),
      limit: (_count: number) => ({ then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); } }),
      single: () => ({ then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.get(`/${table}`); return resolve(result); } }),
      maybeSingle: () => ({ then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.get(`/${table}`); return resolve(result); } }),
      then: async (resolve: (value: ApiResponse<unknown[]>) => void) => { const result = await api.get(`/${table}`); return resolve({ data: result.data || [], error: result.error }); }
    }),
    insert: (_values: unknown) => ({ select: () => ({ single: () => ({ then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.post(`/${table}`, _values); return resolve(result); } }), then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.post(`/${table}`, _values); return resolve(result); } }), then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.post(`/${table}`, _values); return resolve(result); } }),
    update: (_values: unknown) => ({ eq: (_column: string, value: unknown) => ({ eq: (_column2: string, _value2: unknown) => ({ then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.put(`/${table}/${value}`, _values); return resolve(result); } }), select: () => ({ then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.put(`/${table}/${value}`, _values); return resolve(result); } }), then: async (resolve: (value: ApiResponse<unknown>) => void) => { const result = await api.put(`/${table}/${value}`, _values); return resolve(result); } }) }),
    delete: () => ({ eq: (_column: string, value: unknown) => ({ eq: (_column2: string, _value2: unknown) => ({ then: async (resolve: (value: ApiResponse<null>) => void) => { const result = await api.delete(`/${table}/${value}`); return resolve({ data: null, error: result.error }); } }), then: async (resolve: (value: ApiResponse<null>) => void) => { const result = await api.delete(`/${table}/${value}`); return resolve({ data: null, error: result.error }); } }) })
  }),
  auth: { signUp: async (_credentials: { email: string; password: string }) => { const result = await api.post('/auth/signup', _credentials); return result; }, signInWithPassword: async (_credentials: { email: string; password: string }) => { const result = await api.post('/auth/login', _credentials); return result; }, signOut: async () => { const result = await api.post('/auth/logout', {}); return { error: result.error }; }, getSession: async () => { const result = await api.get('/auth/session'); return { data: { session: result.data }, error: result.error }; }, onAuthStateChange: (_callback: (event: string, session: unknown) => void) => { return { data: { subscription: { unsubscribe: () => {} } } }; } },
  channel: (_name: string) => ({ on: (_event: string, _filter: unknown, _callback: () => void) => ({ subscribe: () => ({}) }) }),
  removeChannel: (_channel: unknown) => {}
};
