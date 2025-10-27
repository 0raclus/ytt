import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { user_id, event_id } = req.query;
    if (!user_id || !event_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing user_id or event_id' } });
    }

    const registrations = await sql\`SELECT * FROM event_registrations WHERE user_id = \${user_id as string} AND event_id = \${event_id as string}\`;
    return res.status(200).json({ data: { isRegistered: registrations.length > 0 }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
