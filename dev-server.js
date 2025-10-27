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

app.listen(PORT, () => {
  console.log(`🚀 Dev API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
});

