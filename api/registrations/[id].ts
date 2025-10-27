import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { id } = req.query;
    const registrations = await sql\`SELECT * FROM event_registrations WHERE id = \${id as string}\`;
    if (registrations.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Registration not found' } });
    }

    const registration = registrations[0];
    await sql\`DELETE FROM event_registrations WHERE id = \${id as string}\`;
    await sql\`
      UPDATE events SET
        registered_count = GREATEST(registered_count - 1, 0),
        status = CASE WHEN status = 'full' AND registered_count - 1 < capacity THEN 'active' ELSE status END
      WHERE id = \${registration.event_id}
    \`;

    return res.status(200).json({ data: { success: true }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
