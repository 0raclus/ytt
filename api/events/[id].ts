import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../src/lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const event = await db.getEvent(id as string);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      return res.status(200).json(event);
    }

    if (req.method === 'PUT') {
      const event = await db.updateEvent(id as string, req.body);
      return res.status(200).json(event);
    }

    if (req.method === 'DELETE') {
      await db.deleteEvent(id as string);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Event API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

