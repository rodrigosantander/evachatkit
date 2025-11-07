// netlify/functions/chatkit-session.mjs
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  // CORS para llamadas desde navegador / CloudPage
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
    // Logs de debug (solo se ven en Netlify, no en el response)
    console.log("Has OPENAI_API_KEY?", !!process.env.OPENAI_API_KEY);
    console.log("CHATKIT_WORKFLOW_ID:", process.env.CHATKIT_WORKFLOW_ID);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    if (!process.env.CHATKIT_WORKFLOW_ID) {
      throw new Error("CHATKIT_WORKFLOW_ID is not set");
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const userId = body.userId || "anonymous";

    // 👇 Esta es la parte clave: workflow: { id: ... }
    const session = await client.beta.chatkit.sessions.create({
      user: userId,
      workflow: {
        id: process.env.CHATKIT_WORKFLOW_ID,
      },
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
      body: JSON.stringify({
        error: "Error creating ChatKit session",
        detail: err.message ?? "Unknown error",
      }),
    };
  }
}
