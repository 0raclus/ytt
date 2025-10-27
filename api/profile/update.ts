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
