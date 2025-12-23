// generate-user-hashes.js
// Script to generate password hashes for individual users
// Usage: node generate-user-hashes.js

import crypto from 'crypto';

// CONFIGURATION - Edit this section
const AUTH_SALT = "your-auth-salt-here"; // Use the same salt from generate-password-hash.js
const USERS = [
  { username: 'admin', password: 'AdminEVA2024!', name: 'Administrator', role: 'admin' },
  { username: 'user1', password: 'User1EVA2024!', name: 'Usuario 1', role: 'user' },
  { username: 'user2', password: 'User2EVA2024!', name: 'Usuario 2', role: 'user' },
  // Add more users here...
  // { username: 'user3', password: 'User3EVA2024!', name: 'Usuario 3', role: 'user' },
];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + AUTH_SALT).digest('hex');
}

console.log('='.repeat(80));
console.log('EVA SCRIPT - USER DATABASE GENERATOR');
console.log('='.repeat(80));
console.log('');

// Generate user database object
const userDatabase = {};
const userCredentials = [];

USERS.forEach(user => {
  const hash = hashPassword(user.password);
  userDatabase[user.username] = {
    passwordHash: hash,
    name: user.name,
    active: true,
    role: user.role
  };
  
  userCredentials.push({
    username: user.username,
    password: user.password,
    name: user.name,
    role: user.role
  });
});

console.log('COPY THIS TO auth-user-login.mjs (replace USERS_DB):');
console.log('='.repeat(50));
console.log('const USERS_DB = ' + JSON.stringify(userDatabase, null, 2) + ';');
console.log('');

console.log('USER CREDENTIALS TO SHARE:');
console.log('='.repeat(50));
userCredentials.forEach(user => {
  console.log(`${user.name} (${user.role})`);
  console.log(`  Usuario: ${user.username}`);
  console.log(`  Contraseña: ${user.password}`);
  console.log('');
});

console.log('='.repeat(80));
console.log('INSTRUCTIONS:');
console.log('1. Copy the USERS_DB object above into auth-user-login.mjs');
console.log('2. Share the credentials with your users');
console.log('3. Users can access via /user-login.html');
console.log('4. Add more users by editing this script and re-running it');
console.log('='.repeat(80));
