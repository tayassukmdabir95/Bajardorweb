
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "@/lib/mongodb";

const socialProviders = {};

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const trustedOrigins = [
  "http://localhost:3000",
   "https://bajardorweb.netlify.app.netlify.app"
];

// Add your production domain from the BETTER_AUTH_URL environment variable.
if (process.env.BETTER_AUTH_URL) {
  trustedOrigins.push(process.env.BETTER_AUTH_URL);
}

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  ...(Object.keys(socialProviders).length > 0
    ? { socialProviders }
    : {}),
});
