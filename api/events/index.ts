import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);
  return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const { category, status, upcoming } = req.query;
    let whereClause = 'WHERE 1=1';
    if (category) whereClause += ` AND c.slug = '${category}'`;
    if (status) whereClause += ` AND e.status = '${status}'`;
    if (upcoming === 'true') whereClause += ` AND e.date >= CURRENT_DATE`;

    let events;
    if (whereClause !== 'WHERE 1=1') {
      const query = `
        SELECT e.id, e.title, e.description, e.date, e.time, e.location,
          e.capacity, e.registered_count, e.status, e.requirements,
          e.image_url, e.instructor, e.duration, e.difficulty,
          e.category_id, e.created_by, e.created_at, e.updated_at,
          c.name as category_name, c.slug as category_slug,
          c.icon as category_icon, c.color as category_color
        FROM events e
        LEFT JOIN event_categories c ON e.category_id = c.id
        ${whereClause}
        ORDER BY e.date ASC, e.time ASC
      `;
      events = await sql.unsafe(query);
    } else {
      events = await sql\`
        SELECT e.id, e.title, e.description, e.date, e.time, e.location,
          e.capacity, e.registered_count, e.status, e.requirements,
          e.image_url, e.instructor, e.duration, e.difficulty,
          e.category_id, e.created_by, e.created_at, e.updated_at,
          c.name as category_name, c.slug as category_slug,
          c.icon as category_icon, c.color as category_color
        FROM events e
        LEFT JOIN event_categories c ON e.category_id = c.id
        ORDER BY e.date ASC, e.time ASC
      \`;
    }
    return res.status(200).json({ data: events, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { title, description, date, time, location, capacity, category, requirements, image_url, instructor, duration, difficulty, user_id } = req.body;
    if (!title || !description || !date || !time || !location || !capacity || !category) {
      return res.status(400).json({ data: null, error: { message: 'Missing required fields' } });
    }
    const categories = await sql\`SELECT id FROM event_categories WHERE slug = \${category}\`;
    if (categories.length === 0) {
      return res.status(400).json({ data: null, error: { message: 'Invalid category' } });
    }
    const categoryId = categories[0].id;
    const result = await sql\`
      INSERT INTO events (title, description, date, time, location, capacity, category_id, requirements, image_url, instructor, duration, difficulty, created_by)
      VALUES (\${title}, \${description}, \${date}, \${time}, \${location}, \${capacity}, \${categoryId}, \${requirements || null}, \${image_url || null}, \${instructor || null}, \${duration || null}, \${difficulty || 'beginner'}, \${user_id})
      RETURNING *
    \`;
    return res.status(201).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
