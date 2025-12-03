/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from "jose";

const JWT_PRIVATE_KEY =
  process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, "\n") || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  phoneNumber: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Génère un token JWT RS256
 * @param payload - Données à encoder dans le token
 * @returns Token JWT
 */
export async function signJWT(payload: JWTPayload): Promise<string> {
  try {
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      Buffer.from(JWT_PRIVATE_KEY, "utf-8"),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["sign"]
    );

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(privateKey);

    return jwt;
  } catch (error) {
    console.error("Erreur lors de la génération du JWT:", error);
    throw new Error("Erreur de génération du token");
  }
}

/**
 * Vérifie et décode un token JWT
 * @param token - Token JWT à vérifier
 * @returns Payload décodé
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      Buffer.from(JWT_PUBLIC_KEY, "utf-8"),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["verify"]
    );

    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ["RS256"],
    });

    // Validate required fields and convert payload to our JWTPayload
    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof (payload as any).userId === "string" &&
      typeof (payload as any).phoneNumber === "string" &&
      typeof (payload as any).role === "string"
    ) {
      return {
        userId: (payload as any).userId,
        phoneNumber: (payload as any).phoneNumber,
        role: (payload as any).role,
        iat:
          typeof (payload as any).iat === "number"
            ? (payload as any).iat
            : undefined,
        exp:
          typeof (payload as any).exp === "number"
            ? (payload as any).exp
            : undefined,
      };
    }

    throw new Error("Token payload is missing required fields");
  } catch (error) {
    console.error("Erreur lors de la vérification du JWT:", error);
    throw new Error("Token invalide ou expiré");
  }
}

/**
 * Extrait le token du header Authorization
 * @param authHeader - Header Authorization
 * @returns Token ou null
 */
export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
