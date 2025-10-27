import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders, ADMIN_EMAILS } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { firebase_uid, email, full_name, avatar_url } = req.body;
    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';

    const result = await sql\`
      INSERT INTO user_profiles (user_id, email, full_name, avatar_url, role)
      VALUES (\${firebase_uid}, \${email}, \${full_name || email.split('@')[0]}, \${avatar_url || null}, \${role})
      ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        role = EXCLUDED.role,
        last_login = NOW()
      RETURNING user_id, email, full_name, avatar_url, role
    \`;

    return res.status(200).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
