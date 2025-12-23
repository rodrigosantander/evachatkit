// generate-password-hash.js
// Run this script with Node.js to generate your password hash and salt
// Usage: node generate-password-hash.js

import crypto from 'crypto';

// CHANGE THESE VALUES:
const password = "EVA2026!B0nzO?Ro"; // Change this to your desired password
const salt = crypto.randomBytes(32).toString('hex'); // This generates a random salt

// Generate the hash
const hash = crypto.createHash('sha256').update(password + salt).digest('hex');

console.log('='.repeat(60));
console.log('EVA SCRIPT - PASSWORD CONFIGURATION');
console.log('='.repeat(60));
console.log('');
console.log('Add these environment variables to your Netlify dashboard:');
console.log('');
console.log('EVA_PASSWORD_HASH:', hash);
console.log('AUTH_SALT:', salt);
console.log('');
console.log('='.repeat(60));
console.log('INSTRUCTIONS:');
console.log('1. Go to your Netlify dashboard');
console.log('2. Navigate to Site settings > Environment variables');
console.log('3. Add the two variables above');
console.log('4. Redeploy your site');
console.log('5. Share this password with your 80 users:', password);
console.log('='.repeat(60));
console.log('');
console.log('SECURITY NOTE: Delete this file after use to keep your password secure!');
