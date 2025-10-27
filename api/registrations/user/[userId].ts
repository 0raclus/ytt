import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { userId } = req.query;
    const registrations = await sql\`
      SELECT r.*, e.title, e.date, e.time, e.location, e.image_url, c.name as category_name, c.slug as category_slug
      FROM event_registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE r.user_id = \${userId as string} AND r.status = 'confirmed'
      ORDER BY e.date ASC
    \`;
    return res.status(200).json({ data: registrations, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
