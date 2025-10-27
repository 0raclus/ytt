import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.VITE_DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({
        data: { session: null },
        error: null
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token expired
      if (sessionData.exp < Date.now()) {
        return res.status(200).json({
          data: { session: null },
          error: null
        });
      }

      // Get user from database
      const users = await sql`
        SELECT * FROM user_profiles WHERE user_id = ${sessionData.userId}
      `;

      if (users.length === 0) {
        return res.status(200).json({
          data: { session: null },
          error: null
        });
      }

      const user = users[0];

      return res.status(200).json({
        data: {
          session: {
            access_token: token,
            user: {
              id: user.user_id,
              email: user.email,
              full_name: user.full_name,
              role: user.role
            }
          }
        },
        error: null
      });

    } catch (e) {
      return res.status(200).json({
        data: { session: null },
        error: null
      });
    }

  } catch (error: any) {
    console.error('Session error:', error);
    return res.status(500).json({ 
      data: null,
      error: { message: error.message || 'Session kontrolü sırasında hata oluştu' } 
    });
  }
}

