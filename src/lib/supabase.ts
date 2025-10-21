// Backward compatibility wrapper - redirects to Neon client
import { neonClient, type ApiResponse } from './neon-client';

export { neonClient as api };

// Minimal Supabase-compatible interface for existing code
export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: unknown) => ({
        eq: (column2: string, value2: unknown) => ({
          then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
            const result = await neonClient.get<unknown[]>(`/${table}`);
            return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
          }
        }),
        order: (orderCol: string, opts?: { ascending?: boolean }) => ({
          limit: (count: number) => ({
            then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
              const result = await neonClient.get<unknown[]>(`/${table}`);
              return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
            }
          }),
          then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
            const result = await neonClient.get<unknown[]>(`/${table}`);
            return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
          }
        }),
        limit: (count: number) => ({
          then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
            const result = await neonClient.get<unknown[]>(`/${table}`);
            return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
          }
        }),
        single: () => ({
          then: async (resolve: (value: ApiResponse<unknown>) => void) => {
            const result = await neonClient.get<unknown>(`/${table}`);
            return resolve(result);
          }
        }),
        then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
          const result = await neonClient.get<unknown[]>(`/${table}`);
          return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
        }
      }),
      order: (column: string, opts?: { ascending?: boolean }) => ({
        limit: (count: number) => ({
          then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
            const result = await neonClient.get<unknown[]>(`/${table}`);
            return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
          }
        }),
        then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
          const result = await neonClient.get<unknown[]>(`/${table}`);
          return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
        }
      }),
      limit: (count: number) => ({
        then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
          const result = await neonClient.get<unknown[]>(`/${table}`);
          return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
        }
      }),
      single: () => ({
        then: async (resolve: (value: ApiResponse<unknown>) => void) => {
          const result = await neonClient.get<unknown>(`/${table}`);
          return resolve(result);
        }
      }),
      then: async (resolve: (value: ApiResponse<unknown[]>) => void) => {
        const result = await neonClient.get<unknown[]>(`/${table}`);
        return resolve({ data: Array.isArray(result.data) ? result.data : [], error: result.error });
      }
    }),
    insert: (values: unknown) => ({
      select: () => ({
        single: () => ({
          then: async (resolve: (value: ApiResponse<unknown>) => void) => {
            const result = await neonClient.post<unknown>(`/${table}`, values);
            return resolve(result);
          }
        }),
        then: async (resolve: (value: ApiResponse<unknown>) => void) => {
          const result = await neonClient.post<unknown>(`/${table}`, values);
          return resolve(result);
        }
      }),
      then: async (resolve: (value: ApiResponse<unknown>) => void) => {
        const result = await neonClient.post<unknown>(`/${table}`, values);
        return resolve(result);
      }
    }),
    update: (values: unknown) => ({
      eq: (column: string, value: unknown) => ({
        select: () => ({
          then: async (resolve: (value: ApiResponse<unknown>) => void) => {
            const result = await neonClient.put<unknown>(`/${table}/${value}`, values);
            return resolve(result);
          }
        }),
        then: async (resolve: (value: ApiResponse<unknown>) => void) => {
          const result = await neonClient.put<unknown>(`/${table}/${value}`, values);
          return resolve(result);
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: unknown) => ({
        then: async (resolve: (value: ApiResponse<null>) => void) => {
          const result = await neonClient.delete<null>(`/${table}/${value}`);
          return resolve({ data: null, error: result.error });
        }
      })
    })
  }),
  auth: {
    signUp: async (credentials: { email: string; password: string }) => {
      return neonClient.post('/auth/signup', credentials);
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      return neonClient.post('/auth/login', credentials);
    },
    signOut: async () => {
      const result = await neonClient.post('/auth/logout', {});
      return { error: result.error };
    },
    getSession: async () => {
      const result = await neonClient.get('/auth/session');
      return { data: { session: result.data }, error: result.error };
    },
    getUser: async () => {
      const result = await neonClient.get('/auth/user');
      return { data: { user: result.data }, error: result.error };
    },
    updateUser: async (updates: unknown) => {
      const result = await neonClient.put('/auth/user', updates);
      return { data: { user: result.data }, error: result.error };
    },
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  channel: (name: string) => ({
    on: (event: string, filter: unknown, callback: () => void) => ({
      subscribe: () => ({})
    })
  }),
  removeChannel: (channel: unknown) => {},
};
