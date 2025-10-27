#!/usr/bin/env node
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function makeAdmin() {
  console.log('\n👑 YTT Platform - Make User Admin\n');
  
  const email = await question('Enter email address to make admin: ');
  const secret = await question('Enter admin secret key: ');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/make-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, secret }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Success! User is now admin:');
      console.log('   Email:', data.data.email);
      console.log('   Name:', data.data.full_name);
      console.log('   Role:', data.data.role);
      console.log('\n🎉 You can now access the admin panel!\n');
    } else {
      console.error('\n❌ Error:', data.error);
      console.log('\nTips:');
      console.log('- Make sure the user exists (login with Google first)');
      console.log('- Check the secret key in .env file (ADMIN_SECRET)');
      console.log('- Make sure dev server is running on port 3001\n');
    }
  } catch (error) {
    console.error('\n❌ Network error:', error.message);
    console.log('\nMake sure dev server is running: npm run dev:api\n');
  }
  
  rl.close();
}

makeAdmin();

