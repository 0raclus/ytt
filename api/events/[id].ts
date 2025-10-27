import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'PUT') return handlePut(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const events = await sql\`
      SELECT e.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.id = \${id as string}
    \`;
    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: events[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const { title, description, date, time, location, capacity, category, requirements, image_url, instructor, duration, difficulty, status } = req.body;
    let categoryId = null;
    if (category) {
      const categories = await sql\`SELECT id FROM event_categories WHERE slug = \${category}\`;
      if (categories.length > 0) categoryId = categories[0].id;
    }
    const updated = await sql\`
      UPDATE events SET
        title = COALESCE(\${title}, title),
        description = COALESCE(\${description}, description),
        date = COALESCE(\${date}, date),
        time = COALESCE(\${time}, time),
        location = COALESCE(\${location}, location),
        capacity = COALESCE(\${capacity}, capacity),
        category_id = COALESCE(\${categoryId}, category_id),
        requirements = COALESCE(\${requirements}, requirements),
        image_url = COALESCE(\${image_url}, image_url),
        instructor = COALESCE(\${instructor}, instructor),
        duration = COALESCE(\${duration}, duration),
        difficulty = COALESCE(\${difficulty}, difficulty),
        status = COALESCE(\${status}, status),
        updated_at = NOW()
      WHERE id = \${id as string}
      RETURNING *
    \`;
    if (updated.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: updated[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const deleted = await sql\`DELETE FROM events WHERE id = \${id as string} RETURNING id\`;
    if (deleted.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: { success: true }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
