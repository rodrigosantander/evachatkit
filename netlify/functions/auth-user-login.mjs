// netlify/functions/auth-user-login.mjs
import crypto from 'crypto';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// User database - In production, this could be moved to a file or external service
const USERS_DB = {
  // Format: username: { passwordHash: 'hash', name: 'Display Name', active: true }
  'admin': { 
    passwordHash: 'admin_hash_here', 
    name: 'Administrator', 
    active: true,
    role: 'admin'
  },
  'user1': { 
    passwordHash: 'user1_hash_here', 
    name: 'Usuario 1', 
    active: true,
    role: 'user'
  },
  // Add more users as needed...
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.AUTH_SALT).digest('hex');
}

function generateToken(username, userData) {
  const payload = {
    username: username,
    name: userData.name,
    role: userData.role,
    auth: true,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Username and password required" }),
      };
    }

    // Check if environment variables are set
    if (!process.env.AUTH_SALT) {
      console.error("Missing environment variable: AUTH_SALT");
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Check if user exists
    const userData = USERS_DB[username.toLowerCase()];
    if (!userData) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    // Check if user is active
    if (!userData.active) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Account disabled" }),
      };
    }

    // Verify password
    const hashedInput = hashPassword(password);
    
    if (hashedInput === userData.passwordHash) {
      const token = generateToken(username, userData);
      const expires = Date.now() + (24 * 60 * 60 * 1000);
      
      // Log successful login (for admin tracking)
      console.log(`✅ Login successful: ${username} (${userData.name}) at ${new Date().toISOString()}`);
      
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          token: token,
          expires: expires,
          user: {
            username: username,
            name: userData.name,
            role: userData.role
          }
        }),
      };
    } else {
      // Log failed login attempt
      console.log(`❌ Login failed: ${username} at ${new Date().toISOString()}`);
      
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
