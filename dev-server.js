// Simple dev server for API routes
import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const sql = neon(process.env.VITE_DATABASE_URL);

// Auth endpoints
app.post('/api/auth/sync-firebase-user', async (req, res) => {
  try {
    const { firebase_uid, email, full_name, avatar_url } = req.body;

    console.log('🔄 Syncing Firebase user:', { firebase_uid, email });

    const existingUser = await sql`SELECT * FROM user_profiles WHERE email = ${email} LIMIT 1`;

    if (existingUser.length > 0) {
      console.log('✅ User exists, returning profile');
      const user = existingUser[0];
      return res.json({
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
        phone: user.phone,
        bio: user.bio,
        department: user.department,
        student_level: user.student_level,
      });
    }

    console.log('➕ Creating new user profile');
    const newUser = await sql`
      INSERT INTO user_profiles (
        user_id, email, full_name, role, avatar_url, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${email}, ${full_name || email.split('@')[0]}, 'user', ${avatar_url}, NOW(), NOW()
      )
      RETURNING *
    `;

    const user = newUser[0];
    console.log('✅ User created:', user.email);

    res.json({
      id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      department: user.department,
      student_level: user.student_level,
    });
  } catch (error) {
    console.error('❌ Sync Firebase user error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', { email: req.body.email, has_password: !!req.body.password, full_name: req.body.full_name });

    const { email, password, full_name } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        data: null,
        error: { message: 'Email ve şifre gereklidir' }
      });
    }

    console.log('🔍 Checking if email exists...');
    const existingUser = await sql`SELECT id FROM user_profiles WHERE email = ${email}`;
    if (existingUser.length > 0) {
      console.log('❌ Email already exists');
      return res.status(400).json({
        data: null,
        error: { message: 'Bu email zaten kullanılıyor' }
      });
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('💾 Inserting new user...');
    const newUser = await sql`
      INSERT INTO user_profiles (
        user_id, email, full_name, role, password_hash, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${email}, ${full_name || email.split('@')[0]}, 'user', ${hashedPassword}, NOW(), NOW()
      )
      RETURNING id, user_id, email, full_name, role, created_at
    `;

    console.log('✅ User created:', newUser[0].email);

    const user = newUser[0];
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.user_id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64');

    res.json({
      data: {
        user: { id: user.user_id, email: user.email, full_name: user.full_name, role: user.role },
        session: { access_token: sessionToken, user: { id: user.user_id, email: user.email } }
      },
      error: null
    });
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await sql`SELECT * FROM user_profiles WHERE email = ${email}`;
    if (users.length === 0) {
      return res.status(401).json({ data: null, error: { message: 'Email veya şifre hatalı' } });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash || '');

    if (!isValidPassword) {
      return res.status(401).json({ data: null, error: { message: 'Email veya şifre hatalı' } });
    }

    await sql`UPDATE user_profiles SET last_login = NOW() WHERE id = ${user.id}`;

    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.user_id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64');

    res.json({
      data: {
        user: { id: user.user_id, email: user.email, full_name: user.full_name, role: user.role },
        session: { access_token: sessionToken, user: { id: user.user_id, email: user.email } }
      },
      error: null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ data: { session: null }, error: null });
    }

    const token = authHeader.substring(7);
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());

    if (sessionData.exp < Date.now()) {
      return res.json({ data: { session: null }, error: null });
    }

    const users = await sql`SELECT * FROM user_profiles WHERE user_id = ${sessionData.userId}`;
    if (users.length === 0) {
      return res.json({ data: { session: null }, error: null });
    }

    const user = users[0];
    res.json({
      data: {
        session: {
          access_token: token,
          user: { id: user.user_id, email: user.email, full_name: user.full_name, role: user.role }
        }
      },
      error: null
    });
  } catch (error) {
    res.json({ data: { session: null }, error: null });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ data: null, error: null });
});

// Events endpoints
app.get('/api/events', async (req, res) => {
  try {
    const events = await sql`SELECT * FROM events ORDER BY date ASC`;
    res.json({ data: events, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const events = await sql`SELECT * FROM events WHERE id = ${req.params.id}`;
    res.json({ data: events[0] || null, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Plants endpoints
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await sql`SELECT * FROM plants ORDER BY name ASC`;
    res.json({ data: plants, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Blog endpoints
app.get('/api/blog', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ${limit}`;
    res.json({ data: posts, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Profile update endpoint
app.put('/api/profile/update', async (req, res) => {
  try {
    const { email, full_name, phone, department, student_level } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('🔄 Updating profile for:', email);

    const result = await sql`
      UPDATE user_profiles
      SET
        full_name = ${full_name},
        phone = ${phone || null},
        department = ${department || null},
        student_level = ${student_level || null},
        updated_at = NOW()
      WHERE email = ${email}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];
    console.log('✅ Profile updated:', user.email);

    res.json({
      id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      department: user.department,
      student_level: user.student_level,
    });
  } catch (error) {
    console.error('❌ Profile update error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EVENTS ENDPOINTS
// ============================================

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { category, status, upcoming } = req.query;

    let query = sql`
      SELECT
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE 1=1
    `;

    if (category) {
      query = sql`${query} AND c.slug = ${category}`;
    }

    if (status) {
      query = sql`${query} AND e.status = ${status}`;
    }

    if (upcoming === 'true') {
      query = sql`${query} AND e.date >= CURRENT_DATE`;
    }

    query = sql`${query} ORDER BY e.date ASC, e.time ASC`;

    const events = await query;

    res.json({ data: events, error: null });
  } catch (error) {
    console.error('❌ Get events error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const events = await sql`
      SELECT
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.id = ${id}
    `;

    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }

    res.json({ data: events[0], error: null });
  } catch (error) {
    console.error('❌ Get event error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Create event (admin only)
app.post('/api/events', async (req, res) => {
  try {
    const {
      title, description, date, time, location, capacity,
      category, requirements, image_url, instructor, duration, difficulty, user_id
    } = req.body;

    if (!title || !description || !date || !time || !location || !capacity || !category) {
      return res.status(400).json({ data: null, error: { message: 'Missing required fields' } });
    }

    // Get category ID
    const categories = await sql`SELECT id FROM event_categories WHERE slug = ${category}`;
    if (categories.length === 0) {
      return res.status(400).json({ data: null, error: { message: 'Invalid category' } });
    }

    const categoryId = categories[0].id;

    const newEvent = await sql`
      INSERT INTO events (
        title, description, date, time, location, capacity,
        category_id, requirements, image_url, instructor, duration, difficulty, created_by
      ) VALUES (
        ${title}, ${description}, ${date}, ${time}, ${location}, ${capacity},
        ${categoryId}, ${requirements || []}, ${image_url}, ${instructor}, ${duration}, ${difficulty}, ${user_id}
      )
      RETURNING *
    `;

    res.json({ data: newEvent[0], error: null });
  } catch (error) {
    console.error('❌ Create event error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Update event (admin only)
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, date, time, location, capacity,
      category, requirements, image_url, instructor, duration, difficulty, status
    } = req.body;

    let categoryId = null;
    if (category) {
      const categories = await sql`SELECT id FROM event_categories WHERE slug = ${category}`;
      if (categories.length > 0) {
        categoryId = categories[0].id;
      }
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

    res.json({ data: updated[0], error: null });
  } catch (error) {
    console.error('❌ Update event error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Delete event (admin only)
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await sql`DELETE FROM events WHERE id = ${id} RETURNING id`;

    if (deleted.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }

    res.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error('❌ Delete event error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// ============================================
// EVENT REGISTRATIONS ENDPOINTS
// ============================================

// Get user's registrations
app.get('/api/registrations/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations = await sql`
      SELECT
        r.*,
        e.title, e.date, e.time, e.location, e.image_url,
        c.name as category_name, c.slug as category_slug
      FROM event_registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE r.user_id = ${userId} AND r.status = 'confirmed'
      ORDER BY e.date ASC
    `;

    res.json({ data: registrations, error: null });
  } catch (error) {
    console.error('❌ Get registrations error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Register for event
app.post('/api/registrations', async (req, res) => {
  try {
    const { event_id, user_id, notes } = req.body;

    if (!event_id || !user_id) {
      return res.status(400).json({ data: null, error: { message: 'Missing event_id or user_id' } });
    }

    // Check if event exists and has capacity
    const events = await sql`SELECT * FROM events WHERE id = ${event_id}`;
    if (events.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Event not found' } });
    }

    const event = events[0];
    if (event.registered_count >= event.capacity) {
      return res.status(400).json({ data: null, error: { message: 'Event is full' } });
    }

    // Check if already registered
    const existing = await sql`
      SELECT * FROM event_registrations
      WHERE event_id = ${event_id} AND user_id = ${user_id}
    `;

    if (existing.length > 0) {
      return res.status(400).json({ data: null, error: { message: 'Already registered for this event' } });
    }

    // Create registration
    const registration = await sql`
      INSERT INTO event_registrations (event_id, user_id, notes, status)
      VALUES (${event_id}, ${user_id}, ${notes || null}, 'confirmed')
      RETURNING *
    `;

    // Update event registered_count
    await sql`
      UPDATE events
      SET registered_count = registered_count + 1,
          status = CASE
            WHEN registered_count + 1 >= capacity THEN 'full'
            ELSE status
          END
      WHERE id = ${event_id}
    `;

    res.json({ data: registration[0], error: null });
  } catch (error) {
    console.error('❌ Register for event error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Cancel registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get registration to find event_id
    const registrations = await sql`SELECT * FROM event_registrations WHERE id = ${id}`;
    if (registrations.length === 0) {
      return res.status(404).json({ data: null, error: { message: 'Registration not found' } });
    }

    const registration = registrations[0];

    // Delete registration
    await sql`DELETE FROM event_registrations WHERE id = ${id}`;

    // Update event registered_count
    await sql`
      UPDATE events
      SET registered_count = GREATEST(registered_count - 1, 0),
          status = CASE
            WHEN status = 'full' AND registered_count - 1 < capacity THEN 'active'
            ELSE status
          END
      WHERE id = ${registration.event_id}
    `;

    res.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error('❌ Cancel registration error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

// Get event categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await sql`SELECT * FROM event_categories ORDER BY name`;
    res.json({ data: categories, error: null });
  } catch (error) {
    console.error('❌ Get categories error:', error.message);
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Dev API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
});

