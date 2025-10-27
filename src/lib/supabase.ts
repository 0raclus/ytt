// Backward compatibility wrapper
export const supabase = {
  from: (table: string) => ({
    select: (columns = '*', options?: any) => ({
      eq: (column: string, value: unknown) => ({
        then: async (resolve: (value: { data: unknown[] | null; error: null; count?: number }) => void) => {
          return resolve({ data: [], error: null, count: 0 });
        }
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({
          then: async (resolve: (value: { data: unknown[] | null; error: null }) => void) => {
            return resolve({ data: [], error: null });
          }
        }),
        then: async (resolve: (value: { data: unknown[] | null; error: null }) => void) => {
          return resolve({ data: [], error: null });
        }
      }),
      limit: (count: number) => ({
        then: async (resolve: (value: { data: unknown[] | null; error: null }) => void) => {
          return resolve({ data: [], error: null });
        }
      }),
      then: async (resolve: (value: { data: unknown[] | null; error: null; count?: number }) => void) => {
        return resolve({ data: [], error: null, count: 0 });
      }
    }),
    insert: (data: unknown) => ({
      select: () => ({
        single: () => ({
          then: async (resolve: (value: { data: unknown | null; error: null }) => void) => {
            return resolve({ data: null, error: null });
          }
        }),
        then: async (resolve: (value: { data: unknown | null; error: null }) => void) => {
          return resolve({ data: null, error: null });
        }
      }),
      then: async (resolve: (value: { data: unknown | null; error: null }) => void) => {
        return resolve({ data: null, error: null });
      }
    }),
    update: (data: unknown) => ({
      eq: (column: string, value: unknown) => ({
        then: async (resolve: (value: { error: null }) => void) => {
          return resolve({ error: null });
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: unknown) => ({
        then: async (resolve: (value: { error: null }) => void) => {
          return resolve({ error: null });
        }
      })
    })
  })
};
