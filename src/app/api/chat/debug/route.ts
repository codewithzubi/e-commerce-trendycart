import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const apiKey = process.env.GROQ_API_KEY;

  const isConfigured = apiKey && !apiKey.includes("your-groq") && apiKey.startsWith("gsk_");

  return NextResponse.json({
    groqConfigured: isConfigured,
    apiKeyStarts: apiKey ? `${apiKey.substring(0, 10)}...` : "Not set",
    isAuthenticated: !!session?.user,
    message: isConfigured
      ? "✅ Groq API key is configured!"
      : "❌ Groq API key is missing or invalid. Please add a real key to .env file.",
    howToFix: !isConfigured
      ? "1. Go to https://console.groq.com/keys\n2. Copy your API key\n3. Open .env file\n4. Replace GROQ_API_KEY with your actual key\n5. Restart the dev server"
      : "Your chatbot should work now!",
  });
}
