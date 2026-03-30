import { OAuth2Client } from "google-auth-library";
import { config } from "../config";

const client = new OAuth2Client(config.googleClientId);

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Empty token payload");
  return payload;
}
