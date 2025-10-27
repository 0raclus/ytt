import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { event_id, user_id, notes } = req.body;
    if (!event_id || !user_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing event_id or user_id' } });
    }

    const events = await sql\`SELECT * FROM events WHERE id = \${event_id}\`;
    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }

    const event = events[0];
    if (event.registered_count >= event.capacity) {
      return res.status(400).json({ data: null, error: { message: 'Event is full' } });
    }

    const existing = await sql\`SELECT * FROM event_registrations WHERE event_id = \${event_id} AND user_id = \${user_id}\`;
    if (existing.length > 0) {
      return res.status(400).json({ data: null, error: { message: 'Already registered' } });
    }

    const result = await sql\`
      INSERT INTO event_registrations (event_id, user_id, notes, status)
      VALUES (\${event_id}, \${user_id}, \${notes || null}, 'confirmed')
      RETURNING *
    \`;

    await sql\`
      UPDATE events SET
        registered_count = registered_count + 1,
        status = CASE WHEN registered_count + 1 >= capacity THEN 'full' ELSE status END
      WHERE id = \${event_id}
    \`;

    return res.status(201).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
