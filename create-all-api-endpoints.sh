#!/bin/bash

echo "🚀 Creating all Vercel API endpoints..."

# ============================================
# EVENTS ENDPOINTS
# ============================================

# /api/events/index.ts - GET, POST
cat > api/events/index.ts << 'EOF'
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
EOF

# /api/events/[id].ts - GET, PUT, DELETE
cat > api/events/[id].ts << 'EOF'
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
EOF

# /api/events/stats.ts
cat > api/events/stats.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { user_id } = req.query;
    const thisMonthEvents = await sql\`SELECT COUNT(*) as count FROM events WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'\`;
    const lastMonthEvents = await sql\`SELECT COUNT(*) as count FROM events WHERE date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND date < DATE_TRUNC('month', CURRENT_DATE)\`;
    const thisWeekRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)\`;
    const lastWeekRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND created_at < DATE_TRUNC('week', CURRENT_DATE)\`;
    const capacityStats = await sql\`SELECT SUM(capacity) as total_capacity, SUM(registered_count) as total_registered FROM events\`;
    
    let userRegisteredCount = 0;
    if (user_id) {
      const userRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE user_id = \${user_id as string}\`;
      userRegisteredCount = parseInt(userRegistrations[0]?.count || 0);
    }

    const thisMonth = parseInt(thisMonthEvents[0]?.count || 0);
    const lastMonth = parseInt(lastMonthEvents[0]?.count || 0);
    const newEventsThisMonth = thisMonth - lastMonth;
    const thisWeek = parseInt(thisWeekRegistrations[0]?.count || 0);
    const lastWeek = parseInt(lastWeekRegistrations[0]?.count || 0);
    const newRegistrationsThisWeek = thisWeek - lastWeek;
    const totalCapacity = parseInt(capacityStats[0]?.total_capacity || 0);
    const totalRegistered = parseInt(capacityStats[0]?.total_registered || 0);
    const fillRate = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

    return res.status(200).json({
      data: { thisMonthEvents: thisMonth, newEventsThisMonth, totalRegistrations: totalRegistered, newRegistrationsThisWeek, fillRate, userRegisteredCount },
      error: null
    });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
EOF

echo "✅ Created events endpoints"

# ============================================
# REGISTRATIONS ENDPOINTS
# ============================================

# /api/registrations/index.ts - POST
cat > api/registrations/index.ts << 'EOF'
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
EOF

# /api/registrations/[id].ts - DELETE
cat > api/registrations/[id].ts << 'EOF'
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
EOF

# /api/registrations/check.ts
cat > api/registrations/check.ts << 'EOF'
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
EOF

# /api/registrations/user/[userId].ts
cat > api/registrations/user/[userId].ts << 'EOF'
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
EOF

# /api/registrations/event/[eventId].ts
cat > api/registrations/event/[eventId].ts << 'EOF'
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
EOF

echo "✅ Created registrations endpoints"

# ============================================
# AUTH ENDPOINTS
# ============================================

# /api/auth/sync-firebase-user.ts
cat > api/auth/sync-firebase-user.ts << 'EOF'
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
EOF

# /api/profile/update.ts
mkdir -p api/profile
cat > api/profile/update.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, full_name, phone, department, student_level } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await sql\`
      UPDATE user_profiles SET
        full_name = \${full_name},
        phone = \${phone || null},
        department = \${department || null},
        student_level = \${student_level || null},
        updated_at = NOW()
      WHERE email = \${email}
      RETURNING *
    \`;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ data: result[0], error: null });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
EOF

echo "✅ Created auth endpoints"
echo ""
echo "🎉 All API endpoints created successfully!"
echo ""
echo "📁 Created files:"
echo "  - api/_lib/db.ts"
echo "  - api/categories.ts"
echo "  - api/users.ts"
echo "  - api/plants.ts"
echo "  - api/blog.ts"
echo "  - api/events/index.ts"
echo "  - api/events/[id].ts"
echo "  - api/events/stats.ts"
echo "  - api/registrations/index.ts"
echo "  - api/registrations/[id].ts"
echo "  - api/registrations/check.ts"
echo "  - api/registrations/user/[userId].ts"
echo "  - api/registrations/event/[eventId].ts"
echo "  - api/auth/sync-firebase-user.ts"
echo "  - api/profile/update.ts"
echo ""
echo "✅ Ready for Vercel deployment!"

