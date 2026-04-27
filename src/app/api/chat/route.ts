import { auth } from "@/lib/auth";
import { convertToCoreMessages, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools, systemPrompt } from "./tools";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

function getFriendlyChatError(error: unknown) {
  const extractMessage = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.message || value.name || "Unknown error";
    if (value && typeof value === "object") {
      const maybeMessage = (value as { message?: unknown }).message;
      if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
      const maybeCause = (value as { cause?: unknown }).cause;
      if (maybeCause) return extractMessage(maybeCause);
    }
    return "Unable to reach the AI service right now.";
  };

  const message = extractMessage(error);
  const lowered = message.toLowerCase();

  if (lowered.includes("api key") || lowered.includes("authorization")) {
    return "Groq rejected the request. Check your GROQ_API_KEY in `.env` and restart the dev server.";
  }

  if (lowered.includes("rate limit")) {
    return "Groq rate limit reached. Please wait a moment and try again.";
  }

  if (lowered.includes("fetch") || lowered.includes("network")) {
    return "The request could not reach Groq. Check your internet connection and try again.";
  }

  return message;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    const apiKey = process.env.GROQ_API_KEY;
    const isConfigured = apiKey && !apiKey.includes("your-groq") && apiKey.startsWith("gsk_");

    if (!isConfigured) {
      return Response.json(
        {
          error: "Groq API key not configured",
          message:
            "Please add a valid GROQ_API_KEY to your .env file and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const prompt = `${systemPrompt}\n\nCurrent user ID: ${
      userId || "not logged in"
    }. If the user is not logged in, let them know they need to login to use cart/wishlist/order features. They can browse products without logging in.`;

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      temperature: 0.7,
      system: prompt,
      messages: await convertToCoreMessages(messages),
      tools,
      maxSteps: 5,
    });

    return result.toDataStreamResponse({
      getErrorMessage: getFriendlyChatError,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Chat request failed",
        message: getFriendlyChatError(error),
      },
      { status: 500 }
    );
  }
}
