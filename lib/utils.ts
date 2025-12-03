import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatte un numéro de téléphone béninois
 * @param phone - Numéro de téléphone
 * @returns Numéro formaté ou null si invalide
 */
export function formatBeninPhone(phone: string): string | null {
  // Retirer tous les espaces, tirets, parenthèses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Vérifier le format béninois : +229 suivi de 8 chiffres
  const beninPhoneRegex = /^\+?229[0-9]{8}$/;

  if (!beninPhoneRegex.test(cleaned)) {
    return null;
  }

  // Assurer le format +229XXXXXXXX
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * Valide un numéro de téléphone béninois
 * @param phone - Numéro de téléphone
 * @returns true si valide
 */
export function isValidBeninPhone(phone: string): boolean {
  return formatBeninPhone(phone) !== null;
}

/**
 * Formatte une date en français
 * @param date - Date à formatter
 * @param format - Format de sortie
 * @returns Date formatée
 */
export function formatDateFr(
  date: Date,
  format: "short" | "long" | "time" = "short"
): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: format === "long" ? "long" : "2-digit",
    year: "numeric",
  };

  if (format === "time") {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

/**
 * Génère un code OTP à 6 chiffres
 * @returns Code OTP
 */
export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Calcule l'expiration d'un OTP
 * @param minutes - Nombre de minutes avant expiration
 * @returns Date d'expiration
 */
export function getOTPExpiration(minutes: number = 3): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutes);
  return expiration;
}

/**
 * Nettoie une chaîne de caractères pour la recherche
 * @param str - Chaîne à nettoyer
 * @returns Chaîne nettoyée
 */
export function sanitizeSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Retirer les accents
    .trim();
}

/**
 * Masque partiellement un numéro de téléphone
 * @param phone - Numéro de téléphone
 * @returns Numéro masqué (ex: +229****5678)
 */
export function maskPhoneNumber(phone: string): string {
  if (phone.length < 8) return phone;
  const visible = phone.slice(-4);
  const prefix = phone.startsWith("+229") ? "+229" : "";
  return `${prefix}****${visible}`;
}

/**
 * Convertit un TimeSlot en texte français
 * @param slot - TimeSlot enum
 * @returns Texte formaté
 */
export function timeSlotToText(slot: string): string {
  const slots: Record<string, string> = {
    MORNING_8_10: "8h00 - 10h00",
    MORNING_10_12: "10h00 - 12h00",
    AFTERNOON_14_16: "14h00 - 16h00",
    AFTERNOON_16_18: "16h00 - 18h00",
    EVENING_18_20: "18h00 - 20h00",
  };
  return slots[slot] || slot;
}

/**
 * Vérifie si une date est passée
 * @param date - Date à vérifier
 * @returns true si la date est passée
 */
export function isPastDate(date: Date): boolean {
  return new Date(date) < new Date();
}

/**
 * Calcule le nombre de jours entre deux dates
 * @param date1 - Première date
 * @param date2 - Deuxième date
 * @returns Nombre de jours
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Limite la taille d'une chaîne
 * @param str - Chaîne à limiter
 * @param maxLength - Longueur maximale
 * @returns Chaîne limitée avec ellipse
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
