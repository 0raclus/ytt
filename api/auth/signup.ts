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
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        data: null,
        error: { message: 'Email ve şifre gereklidir' } 
      });
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM user_profiles WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        data: null,
        error: { message: 'Bu email zaten kullanılıyor' } 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await sql`
      INSERT INTO user_profiles (
        user_id,
        email,
        full_name,
        role,
        password_hash,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${email},
        ${full_name || email.split('@')[0]},
        'user',
        ${hashedPassword},
        NOW(),
        NOW()
      )
      RETURNING id, user_id, email, full_name, role, created_at
    `;

    const user = newUser[0];

    // Create session token (simple JWT alternative)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.user_id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    })).toString('base64');

    return res.status(200).json({
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
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
    console.error('Signup error:', error);
    return res.status(500).json({ 
      data: null,
      error: { message: error.message || 'Kayıt sırasında hata oluştu' } 
    });
  }
}

