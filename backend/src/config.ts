import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  geminiApiKey: required("GEMINI_API_KEY"),
  databaseUrl: required("DATABASE_URL"),
  gcsBucketName: required("GCS_BUCKET_NAME"),
  corsOrigin: process.env.CORS_ORIGIN ?? "*"
};