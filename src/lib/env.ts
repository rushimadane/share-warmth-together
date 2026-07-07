import { z } from "zod";

/**
 * Validates the Firebase environment variables at startup so a missing/typo'd
 * key fails loudly here instead of as a cryptic runtime error deep in the app.
 */
const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, "VITE_FIREBASE_API_KEY is required"),
  VITE_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, "VITE_FIREBASE_AUTH_DOMAIN is required"),
  VITE_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, "VITE_FIREBASE_PROJECT_ID is required"),
  VITE_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "VITE_FIREBASE_STORAGE_BUCKET is required"),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "VITE_FIREBASE_MESSAGING_SENDER_ID is required"),
  VITE_FIREBASE_APP_ID: z.string().min(1, "VITE_FIREBASE_APP_ID is required"),
  // Analytics is optional — the app works without it.
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid Firebase environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error(
    "Missing or invalid Firebase environment variables. Check your .env file."
  );
}

export const env = parsed.data;
