// netlify/functions/chatkit-session.mjs
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  // Basic CORS handling for calls from CloudPages / other origins
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const userId = body.userId || null; // optional, you can pass ContactKey later

    const session = await client.beta.chatkit.sessions.create({
      workflow_id: process.env.CHATKIT_WORKFLOW_ID,
      // optional context
      user: userId || undefined,
      // metadata: { source: "SFMC_CloudPage" } // example
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        client_secret: session.client_secret,
      }),
    };
  } catch (err) {
    console.error("ChatKit session error:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Error creating ChatKit session" }),
    };
  }
}
