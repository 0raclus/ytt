import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { eventId } = req.query;
    const registrations = await sql\`
      SELECT r.id, r.user_id, r.status, r.registered_at, u.full_name, u.email, u.phone
      FROM event_registrations r
      LEFT JOIN user_profiles u ON r.user_id = u.user_id
      WHERE r.event_id = \${eventId as string}
      ORDER BY r.registered_at DESC
    \`;

    const mapped = registrations.map(r => ({
      id: r.id,
      user_id: r.user_id,
      status: r.status,
      registered_at: r.registered_at,
      user_profiles: { full_name: r.full_name, email: r.email, phone: r.phone }
    }));

    return res.status(200).json({ data: mapped, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
