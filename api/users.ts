import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const users = await sql`
      SELECT user_id as id, email, full_name, role, created_at, last_login
      FROM user_profiles
      ORDER BY created_at DESC
    `;
    return res.status(200).json({ data: users, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
