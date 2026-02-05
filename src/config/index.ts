import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  ups: {
    clientId: requireEnv("UPS_CLIENT_ID"),
    clientSecret: requireEnv("UPS_CLIENT_SECRET"),
    oauthUrl: requireEnv("UPS_OAUTH_URL"),
    rateUrl: requireEnv("UPS_RATE_URL")
  }
};
