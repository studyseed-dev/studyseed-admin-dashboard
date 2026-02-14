import { jwtVerify, SignJWT } from "jose";

export const secret = new TextEncoder().encode(JSON.stringify(process.env.JWT_SECRET));

export async function verifyAuthToken(token: string) {
  const verifiedToken = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return verifiedToken;
}

export async function signAuthToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}
