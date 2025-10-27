import { neon } from '@neondatabase/serverless';

if (!process.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL is not set');
}

export const sql = neon(process.env.VITE_DATABASE_URL);

export const ADMIN_EMAILS = [
  'klausmullermaxwell@gmail.com',
];

export const isAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email);
};

export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
