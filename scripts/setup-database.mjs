#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ VITE_DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Read schema file
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('📝 Executing full schema...\n');

    try {
      // Execute the entire schema as one statement
      await sql`${sql.unsafe(schema)}`;
      console.log('✅ Schema executed successfully\n');
    } catch (error) {
      // Some errors are expected (like "already exists")
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log('⚠️  Some objects already exist (this is normal)\n');
      } else {
        console.error('❌ Error:', error.message, '\n');
      }
    }

    console.log('🎉 Database setup completed!\n');
    
    // Verify tables
    console.log('🔍 Verifying tables...\n');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log('📊 Tables in database:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    console.log('\n✅ Database is ready!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

