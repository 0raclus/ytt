import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ${limit}`;
    return res.status(200).json({ data: posts, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
