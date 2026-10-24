import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

export async function GET(request) {
  await connectToDatabase();
  return handlers.GET(request);
}

export async function POST(request) {
  await connectToDatabase();
  return handlers.POST(request);
}