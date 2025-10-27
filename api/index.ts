import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

if (!process.env.VITE_DATABASE_URL) {
  throw new Error('VITE_DATABASE_URL is not set');
}

const sql = neon(process.env.VITE_DATABASE_URL);

const ADMIN_EMAILS = ['klausmullermaxwell@gmail.com'];

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.replace('/api', '') || '/';
  
  // Route: GET /categories
  if (path === '/categories' && req.method === 'GET') {
    return handleGetCategories(req, res);
  }
  
  // Route: GET /users
  if (path === '/users' && req.method === 'GET') {
    return handleGetUsers(req, res);
  }
  
  // Route: GET /plants
  if (path === '/plants' && req.method === 'GET') {
    return handleGetPlants(req, res);
  }
  
  // Route: GET /blog
  if (path === '/blog' && req.method === 'GET') {
    return handleGetBlog(req, res);
  }
  
  // Route: /events
  if (path === '/events' && req.method === 'GET') {
    return handleGetEvents(req, res);
  }
  if (path === '/events' && req.method === 'POST') {
    return handleCreateEvent(req, res);
  }
  
  // Route: /events/stats
  if (path === '/events/stats' && req.method === 'GET') {
    return handleGetEventStats(req, res);
  }
  
  // Route: /events/:id
  if (path.startsWith('/events/') && !path.includes('/stats')) {
    const id = path.split('/')[2];
    if (req.method === 'GET') return handleGetEvent(id, req, res);
    if (req.method === 'PUT') return handleUpdateEvent(id, req, res);
    if (req.method === 'DELETE') return handleDeleteEvent(id, req, res);
  }
  
  // Route: /registrations
  if (path === '/registrations' && req.method === 'POST') {
    return handleCreateRegistration(req, res);
  }
  
  // Route: /registrations/check
  if (path.startsWith('/registrations/check') && req.method === 'GET') {
    return handleCheckRegistration(req, res);
  }
  
  // Route: /registrations/:id
  if (path.startsWith('/registrations/') && !path.includes('/check') && !path.includes('/user/') && !path.includes('/event/')) {
    const id = path.split('/')[2];
    if (req.method === 'DELETE') return handleDeleteRegistration(id, req, res);
  }
  
  // Route: /registrations/user/:userId
  if (path.startsWith('/registrations/user/') && req.method === 'GET') {
    const userId = path.split('/')[3];
    return handleGetUserRegistrations(userId, req, res);
  }
  
  // Route: /registrations/event/:eventId
  if (path.startsWith('/registrations/event/') && req.method === 'GET') {
    const eventId = path.split('/')[3];
    return handleGetEventRegistrations(eventId, req, res);
  }
  
  // Route: /auth/sync-firebase-user
  if (path === '/auth/sync-firebase-user' && req.method === 'POST') {
    return handleSyncFirebaseUser(req, res);
  }
  
  // Route: /profile/update
  if (path === '/profile/update' && req.method === 'PUT') {
    return handleUpdateProfile(req, res);
  }
  
  return res.status(404).json({ data: null, error: { message: 'Not found' } });
}

// Categories
async function handleGetCategories(req: VercelRequest, res: VercelResponse) {
  try {
    const categories = await sql`SELECT * FROM event_categories ORDER BY name ASC`;
    return res.status(200).json({ data: categories, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Users
async function handleGetUsers(req: VercelRequest, res: VercelResponse) {
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

// Plants
async function handleGetPlants(req: VercelRequest, res: VercelResponse) {
  try {
    const plants = await sql`SELECT * FROM plants ORDER BY name ASC`;
    return res.status(200).json({ data: plants, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Blog
async function handleGetBlog(req: VercelRequest, res: VercelResponse) {
  try {
    const posts = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    return res.status(200).json({ data: posts, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - GET all
async function handleGetEvents(req: VercelRequest, res: VercelResponse) {
  try {
    const { status, category, difficulty } = req.query;
    let whereClause = 'WHERE 1=1';
    if (status) whereClause += ` AND e.status = '${status}'`;
    if (category) whereClause += ` AND c.slug = '${category}'`;
    if (difficulty) whereClause += ` AND e.difficulty = '${difficulty}'`;

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
      events = await sql`
        SELECT e.id, e.title, e.description, e.date, e.time, e.location,
          e.capacity, e.registered_count, e.status, e.requirements,
          e.image_url, e.instructor, e.duration, e.difficulty,
          e.category_id, e.created_by, e.created_at, e.updated_at,
          c.name as category_name, c.slug as category_slug,
          c.icon as category_icon, c.color as category_color
        FROM events e
        LEFT JOIN event_categories c ON e.category_id = c.id
        ORDER BY e.date ASC, e.time ASC
      `;
    }
    return res.status(200).json({ data: events, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - POST create
async function handleCreateEvent(req: VercelRequest, res: VercelResponse) {
  try {
    const { title, description, date, time, location, capacity, category, requirements, image_url, instructor, duration, difficulty, user_id } = req.body;
    if (!title || !description || !date || !time || !location || !capacity || !category) {
      return res.status(400).json({ data: null, error: { message: 'Missing required fields' } });
    }
    const categories = await sql`SELECT id FROM event_categories WHERE slug = ${category}`;
    if (categories.length === 0) {
      return res.status(400).json({ data: null, error: { message: 'Invalid category' } });
    }
    const categoryId = categories[0].id;
    const result = await sql`
      INSERT INTO events (title, description, date, time, location, capacity, category_id, requirements, image_url, instructor, duration, difficulty, created_by)
      VALUES (${title}, ${description}, ${date}, ${time}, ${location}, ${capacity}, ${categoryId}, ${requirements || null}, ${image_url || null}, ${instructor || null}, ${duration || null}, ${difficulty || 'beginner'}, ${user_id})
      RETURNING *
    `;
    return res.status(201).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - GET stats
async function handleGetEventStats(req: VercelRequest, res: VercelResponse) {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month') as monthly_events,
        COALESCE(SUM(registered_count) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'), 0) as monthly_registrations,
        CASE
          WHEN SUM(capacity) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month') > 0
          THEN ROUND((SUM(registered_count) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::numeric / SUM(capacity) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::numeric) * 100, 1)
          ELSE 0
        END as fill_rate
      FROM events
    `;
    return res.status(200).json({ data: stats[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - GET single
async function handleGetEvent(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    const events = await sql`
      SELECT e.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.id = ${id}
    `;
    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: events[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - PUT update
async function handleUpdateEvent(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    const { title, description, date, time, location, capacity, category, requirements, image_url, instructor, duration, difficulty, status } = req.body;
    let categoryId = null;
    if (category) {
      const categories = await sql`SELECT id FROM event_categories WHERE slug = ${category}`;
      if (categories.length > 0) categoryId = categories[0].id;
    }
    const updated = await sql`
      UPDATE events SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        location = COALESCE(${location}, location),
        capacity = COALESCE(${capacity}, capacity),
        category_id = COALESCE(${categoryId}, category_id),
        requirements = COALESCE(${requirements}, requirements),
        image_url = COALESCE(${image_url}, image_url),
        instructor = COALESCE(${instructor}, instructor),
        duration = COALESCE(${duration}, duration),
        difficulty = COALESCE(${difficulty}, difficulty),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (updated.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: updated[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Events - DELETE
async function handleDeleteEvent(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    const deleted = await sql`DELETE FROM events WHERE id = ${id} RETURNING id`;
    if (deleted.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }
    return res.status(200).json({ data: { success: true }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Registrations - POST create
async function handleCreateRegistration(req: VercelRequest, res: VercelResponse) {
  try {
    const { event_id, user_id, notes } = req.body;
    if (!event_id || !user_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing event_id or user_id' } });
    }

    const events = await sql`SELECT * FROM events WHERE id = ${event_id}`;
    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }

    const event = events[0];
    if (event.registered_count >= event.capacity) {
      return res.status(400).json({ data: null, error: { message: 'Event is full' } });
    }

    const existing = await sql`SELECT * FROM event_registrations WHERE event_id = ${event_id} AND user_id = ${user_id}`;
    if (existing.length > 0) {
      return res.status(400).json({ data: null, error: { message: 'Already registered' } });
    }

    const result = await sql`
      INSERT INTO event_registrations (event_id, user_id, notes, status)
      VALUES (${event_id}, ${user_id}, ${notes || null}, 'confirmed')
      RETURNING *
    `;

    await sql`
      UPDATE events SET
        registered_count = registered_count + 1,
        status = CASE WHEN registered_count + 1 >= capacity THEN 'full' ELSE status END
      WHERE id = ${event_id}
    `;

    return res.status(201).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Registrations - DELETE
async function handleDeleteRegistration(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    const registrations = await sql`SELECT * FROM event_registrations WHERE id = ${id}`;
    if (registrations.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Registration not found' } });
    }

    const registration = registrations[0];
    await sql`DELETE FROM event_registrations WHERE id = ${id}`;

    await sql`
      UPDATE events SET
        registered_count = GREATEST(0, registered_count - 1),
        status = CASE WHEN status = 'full' AND registered_count - 1 < capacity THEN 'active' ELSE status END
      WHERE id = ${registration.event_id}
    `;

    return res.status(200).json({ data: { success: true }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Registrations - GET check
async function handleCheckRegistration(req: VercelRequest, res: VercelResponse) {
  try {
    const { event_id, user_id } = req.query;
    if (!event_id || !user_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing event_id or user_id' } });
    }

    const registrations = await sql`
      SELECT * FROM event_registrations
      WHERE event_id = ${event_id as string} AND user_id = ${user_id as string}
    `;

    return res.status(200).json({ data: { isRegistered: registrations.length > 0 }, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Registrations - GET user registrations
async function handleGetUserRegistrations(userId: string, req: VercelRequest, res: VercelResponse) {
  try {
    const registrations = await sql`
      SELECT r.*, e.title, e.date, e.time, e.location
      FROM event_registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ${userId}
      ORDER BY e.date DESC
    `;
    return res.status(200).json({ data: registrations, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Registrations - GET event registrations
async function handleGetEventRegistrations(eventId: string, req: VercelRequest, res: VercelResponse) {
  try {
    const registrations = await sql`
      SELECT r.id, r.event_id, r.user_id, r.status, r.notes, r.created_at,
        u.email, u.full_name, u.phone, u.department, u.student_level
      FROM event_registrations r
      JOIN user_profiles u ON r.user_id = u.user_id
      WHERE r.event_id = ${eventId}
      ORDER BY r.created_at DESC
    `;

    const mapped = registrations.map((r: any) => ({
      id: r.id,
      event_id: r.event_id,
      user_id: r.user_id,
      status: r.status,
      notes: r.notes,
      created_at: r.created_at,
      user_profiles: {
        email: r.email,
        full_name: r.full_name,
        phone: r.phone,
        department: r.department,
        student_level: r.student_level
      }
    }));

    return res.status(200).json({ data: mapped, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Auth - Sync Firebase user
async function handleSyncFirebaseUser(req: VercelRequest, res: VercelResponse) {
  try {
    const { firebase_uid, email, full_name, avatar_url } = req.body;
    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';

    const result = await sql`
      INSERT INTO user_profiles (user_id, email, full_name, avatar_url, role)
      VALUES (${firebase_uid}, ${email}, ${full_name || email.split('@')[0]}, ${avatar_url || null}, ${role})
      ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        role = EXCLUDED.role,
        last_login = NOW()
      RETURNING user_id, email, full_name, avatar_url, role
    `;

    return res.status(200).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

// Profile - Update
async function handleUpdateProfile(req: VercelRequest, res: VercelResponse) {
  try {
    const { user_id, full_name, phone, department, student_level } = req.body;
    if (!user_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing user_id' } });
    }

    const result = await sql`
      UPDATE user_profiles SET
        full_name = COALESCE(${full_name}, full_name),
        phone = COALESCE(${phone}, phone),
        department = COALESCE(${department}, department),
        student_level = COALESCE(${student_level}, student_level)
      WHERE user_id = ${user_id}
      RETURNING user_id, email, full_name, avatar_url, role, phone, department, student_level
    `;

    if (result.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'User not found' } });
    }

    return res.status(200).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}

