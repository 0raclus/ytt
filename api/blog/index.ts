import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../src/lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { limit } = req.query;
      const posts = await db.getBlogPosts(limit ? parseInt(limit as string) : undefined);
      return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
      const post = await db.createBlogPost(req.body);
      return res.status(201).json(post);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Blog API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

