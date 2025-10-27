import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import * as bcrypt from 'bcryptjs';

const sql = neon(process.env.VITE_DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        data: null,
        error: { message: 'Email ve şifre gereklidir' } 
      });
    }

    // Find user
    const users = await sql`
      SELECT * FROM user_profiles WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ 
        data: null,
        error: { message: 'Email veya şifre hatalı' } 
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash || '');

    if (!isValidPassword) {
      return res.status(401).json({ 
        data: null,
        error: { message: 'Email veya şifre hatalı' } 
      });
    }

    // Update last login
    await sql`
      UPDATE user_profiles 
      SET last_login = NOW() 
      WHERE id = ${user.id}
    `;

    // Create session token
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.user_id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    })).toString('base64');

    return res.status(200).json({
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio
        },
        session: {
          access_token: sessionToken,
          user: {
            id: user.user_id,
            email: user.email
          }
        }
      },
      error: null
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      data: null,
      error: { message: error.message || 'Giriş sırasında hata oluştu' } 
    });
  }
}

