import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: required("DATABASE_URL"),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  // optional — only needed for image uploads
  gcsBucketName: process.env.GCS_BUCKET_NAME ?? "",
};