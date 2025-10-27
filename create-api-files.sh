#!/bin/bash

# Create all Vercel API endpoints

# Categories
cat > api/categories.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const categories = await sql`SELECT * FROM event_categories ORDER BY name`;
    return res.status(200).json({ data: categories, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
EOF

# Users
cat > api/users.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const users = await sql`
      SELECT user_id as id, email, full_name, role, created_at, last_login
      FROM user_profiles
      ORDER BY created_at DESC
    `;
    return res.status(200).json({ data: users, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
EOF

# Plants
cat > api/plants.ts << 'EOF'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, setCorsHeaders } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ data: null, error: { message: 'Method not allowed' } });

  try {
    const plants = await sql`SELECT * FROM plants ORDER BY name ASC`;
    return res.status(200).json({ data: plants, error: null });
  } catch (error: any) {
    return res.status(500).json({ data: null, error: { message: error.message } });
  }
}
EOF

# Blog
cat > api/blog.ts << 'EOF'
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
EOF

echo "✅ Created basic API files"

