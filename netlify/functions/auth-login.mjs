// netlify/functions/auth-login.mjs
import crypto from 'crypto';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Simple password hash function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.AUTH_SALT).digest('hex');
}

// Generate a simple JWT-like token
function generateToken() {
  const payload = {
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
    const { password } = body;

    if (!password) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Password required" }),
      };
    }

    // Check if environment variables are set
    if (!process.env.EVA_PASSWORD_HASH || !process.env.AUTH_SALT) {
      console.error("Missing environment variables: EVA_PASSWORD_HASH or AUTH_SALT");
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Verify password
    const hashedInput = hashPassword(password);
    
    if (hashedInput === process.env.EVA_PASSWORD_HASH) {
      const token = generateToken();
      const expires = Date.now() + (24 * 60 * 60 * 1000);
      
      console.log(`✅ EVA Login successful at ${new Date().toISOString()}`);
      
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          token: token,
          expires: expires
        }),
      };
    } else {
      console.log(`❌ EVA Login failed at ${new Date().toISOString()}`);
      
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid password" }),
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
