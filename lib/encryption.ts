/**
 * Service de chiffrement pour les données sensibles
 * Utilise l'API Web Crypto (compatible navigateur et Node.js)
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const ALGORITHM = "AES-GCM";

/**
 * Convertit une clé string en CryptoKey
 */
async function getKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(
    ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)
  );
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Chiffre une chaîne de caractères
 * @param plaintext - Texte en clair
 * @returns Texte chiffré en base64
 */
export async function encrypt(plaintext: string): Promise<string> {
  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encoded
    );

    // Combiner IV et ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return Buffer.from(combined).toString("base64");
  } catch (error) {
    console.error("Erreur de chiffrement:", error);
    throw new Error("Échec du chiffrement");
  }
}

/**
 * Déchiffre une chaîne de caractères
 * @param ciphertext - Texte chiffré en base64
 * @returns Texte en clair
 */
export async function decrypt(ciphertext: string): Promise<string> {
  try {
    const key = await getKey();
    const combined = Buffer.from(ciphertext, "base64");

    // Extraire IV et ciphertext
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Erreur de déchiffrement:", error);
    throw new Error("Échec du déchiffrement");
  }
}

/**
 * Hash une chaîne de caractères (pour mots de passe, etc.)
 * @param data - Données à hasher
 * @returns Hash en hexadécimal
 */
export async function hash(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Vérifie un hash
 * @param data - Données originales
 * @param hashedData - Hash à vérifier
 * @returns true si le hash correspond
 */
export async function verifyHash(
  data: string,
  hashedData: string
): Promise<boolean> {
  const dataHash = await hash(data);
  return dataHash === hashedData;
}
