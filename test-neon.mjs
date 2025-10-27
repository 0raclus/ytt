import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_DvAa7CF2IGpu@ep-hidden-breeze-agkweyze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

console.log('🔍 Testing Neon connection...\n');

try {
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_profiles' ORDER BY ordinal_position`;
  
  console.log('✅ Columns in user_profiles:');
  cols.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`));
  
  const hasPassword = cols.find(c => c.column_name === 'password_hash');
  if (hasPassword) {
    console.log('\n✅ password_hash column EXISTS!');
  } else {
    console.log('\n❌ password_hash column MISSING!');
    console.log('\n🔧 Run this SQL in Neon console:');
    console.log('ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;');
  }
} catch (err) {
  console.error('❌ Error:', err.message);
}
