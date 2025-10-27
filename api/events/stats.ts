import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from '../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const { user_id } = req.query;
    const thisMonthEvents = await sql\`SELECT COUNT(*) as count FROM events WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'\`;
    const lastMonthEvents = await sql\`SELECT COUNT(*) as count FROM events WHERE date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND date < DATE_TRUNC('month', CURRENT_DATE)\`;
    const thisWeekRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)\`;
    const lastWeekRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND created_at < DATE_TRUNC('week', CURRENT_DATE)\`;
    const capacityStats = await sql\`SELECT SUM(capacity) as total_capacity, SUM(registered_count) as total_registered FROM events\`;
    
    let userRegisteredCount = 0;
    if (user_id) {
      const userRegistrations = await sql\`SELECT COUNT(*) as count FROM event_registrations WHERE user_id = \${user_id as string}\`;
      userRegisteredCount = parseInt(userRegistrations[0]?.count || 0);
    }

    const thisMonth = parseInt(thisMonthEvents[0]?.count || 0);
    const lastMonth = parseInt(lastMonthEvents[0]?.count || 0);
    const newEventsThisMonth = thisMonth - lastMonth;
    const thisWeek = parseInt(thisWeekRegistrations[0]?.count || 0);
    const lastWeek = parseInt(lastWeekRegistrations[0]?.count || 0);
    const newRegistrationsThisWeek = thisWeek - lastWeek;
    const totalCapacity = parseInt(capacityStats[0]?.total_capacity || 0);
    const totalRegistered = parseInt(capacityStats[0]?.total_registered || 0);
    const fillRate = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

    return res.status(200).json({
      data: { thisMonthEvents: thisMonth, newEventsThisMonth, totalRegistrations: totalRegistered, newRegistrationsThisWeek, fillRate, userRegisteredCount },
      error: null
    });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
