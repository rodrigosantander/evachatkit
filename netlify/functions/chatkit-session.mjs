// netlify/functions/chatkit-session.mjs
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handler(event) {
  // Preflight CORS
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
    const userId = body.userId || "eva-default-user";

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY no está configurada");
    }
    if (!process.env.CHATKIT_WORKFLOW_ID) {
      throw new Error("CHATKIT_WORKFLOW_ID no está configurada");
    }

    // 👇 Aquí es donde activamos los uploads en la sesión
    const session = await client.beta.chatkit.sessions.create({
      user: userId,
      workflow: { id: process.env.CHATKIT_WORKFLOW_ID },

      // IMPORTANTE: habilita subida de archivos para esta sesión
      chatkit_configuration: {
        file_upload: {
          enabled: true,
          max_file_size: 20, // MB por archivo
          max_files: 5,      // máximo archivos por mensaje
        },
      },
    });

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_secret: session.client_secret,
      }),
    };
  } catch (error) {
    console.error("Error creando ChatKit session:", error);

    const message =
      error?.response?.data?.error?.message ||
      error.message ||
      "Error creando ChatKit session";

    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: message }),
    };
  }
}
