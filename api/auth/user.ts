import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.VITE_DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        data: null,
        error: { message: 'Unauthorized' }
      });
    }

    const token = authHeader.substring(7);
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if token expired
    if (sessionData.exp < Date.now()) {
      return res.status(401).json({
        data: null,
        error: { message: 'Token expired' }
      });
    }

    if (req.method === 'GET') {
      // Get user profile
      const users = await sql`
        SELECT * FROM user_profiles WHERE user_id = ${sessionData.userId}
      `;

      if (users.length === 0) {
        return res.status(404).json({
          data: null,
          error: { message: 'User not found' }
        });
      }

      const user = users[0];

      return res.status(200).json({
        data: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio,
          department: user.department,
          student_level: user.student_level,
          preferences: user.preferences,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        error: null
      });
    }

    if (req.method === 'PUT') {
      // Update user profile
      const updates = req.body;
      
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updates.full_name !== undefined) {
        updateFields.push(`full_name = $${paramIndex++}`);
        values.push(updates.full_name);
      }
      if (updates.phone !== undefined) {
        updateFields.push(`phone = $${paramIndex++}`);
        values.push(updates.phone);
      }
      if (updates.bio !== undefined) {
        updateFields.push(`bio = $${paramIndex++}`);
        values.push(updates.bio);
      }
      if (updates.avatar_url !== undefined) {
        updateFields.push(`avatar_url = $${paramIndex++}`);
        values.push(updates.avatar_url);
      }
      if (updates.department !== undefined) {
        updateFields.push(`department = $${paramIndex++}`);
        values.push(updates.department);
      }
      if (updates.student_level !== undefined) {
        updateFields.push(`student_level = $${paramIndex++}`);
        values.push(updates.student_level);
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(sessionData.userId);

      const query = `
        UPDATE user_profiles 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramIndex}
        RETURNING *
      `;

      const result = await sql(query, values);
      const user = result[0];

      return res.status(200).json({
        data: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone: user.phone,
          bio: user.bio
        },
        error: null
      });
    }

    return res.status(405).json({ 
      data: null,
      error: { message: 'Method not allowed' } 
    });

  } catch (error: any) {
    console.error('User API error:', error);
    return res.status(500).json({ 
      data: null,
      error: { message: error.message || 'Bir hata oluştu' } 
    });
  }
}

