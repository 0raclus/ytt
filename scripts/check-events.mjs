#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_DATABASE_URL);

async function checkEvents() {
  console.log('🔍 Checking events tables...\n');
  
  const categories = await sql`SELECT * FROM event_categories`;
  console.log('📁 Categories:', categories.length);
  categories.forEach(c => console.log(`  - ${c.name} (${c.slug})`));
  
  console.log('');
  
  const events = await sql`SELECT * FROM events`;
  console.log('📅 Events:', events.length);
  events.forEach(e => console.log(`  - ${e.title} (${e.date})`));
  
  console.log('');
  
  const registrations = await sql`SELECT * FROM event_registrations`;
  console.log('✅ Registrations:', registrations.length);
}

checkEvents();

