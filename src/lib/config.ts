/**
 * Application Configuration
 * Centralized configuration management with validation
 */

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    url: string;
  };
  admin: {
    email: string;
  };
  features: {
    realtime: boolean;
    analytics: boolean;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

const getBooleanEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnv = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const config: AppConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL', 'https://your-project.supabase.co'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'your-anon-key'),
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'YTT Platform'),
    url: getEnvVar('VITE_APP_URL', 'http://localhost:5173'),
  },
  admin: {
    email: getEnvVar('VITE_ADMIN_EMAIL', 'ebrar@ytt.dev'),
  },
  features: {
    realtime: getBooleanEnv('VITE_ENABLE_REALTIME', true),
    analytics: getBooleanEnv('VITE_ENABLE_ANALYTICS', true),
  },
  upload: {
    maxFileSize: getNumberEnv('VITE_MAX_FILE_SIZE', 5242880), // 5MB default
    allowedTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/webp,application/pdf').split(','),
  },
};

export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

