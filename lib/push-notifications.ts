/**
 * Service de notifications Web Push via Firebase Cloud Messaging
 * Client-side uniquement (navigateur)
 */

import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from "firebase/messaging";
import { firebaseConfig, vapidKey } from "./firebase-config";

let messaging: Messaging | null = null;

/**
 * Initialise Firebase Messaging
 */
export function initializeFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error);
    return null;
  }
}

/**
 * Demande la permission de notification et obtient le token FCM
 * @returns Token FCM ou null
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!("Notification" in window)) {
      console.warn("Ce navigateur ne supporte pas les notifications");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Permission de notification refusée");
      return null;
    }

    const msg = messaging || initializeFirebaseMessaging();
    if (!msg) return null;

    const token = await getToken(msg, { vapidKey });
    console.log("Token FCM obtenu:", token);
    return token;
  } catch (error) {
    console.error("Erreur lors de la demande de permission:", error);
    return null;
  }
}

/**
 * Écoute les messages en temps réel (foreground)
 * @param callback - Fonction appelée à la réception d'un message
 */
export function listenToMessages(callback: (payload: any) => void) {
  const msg = messaging || initializeFirebaseMessaging();
  if (!msg) return;

  onMessage(msg, (payload) => {
    console.log("Message reçu:", payload);
    callback(payload);

    // Afficher une notification locale si l'app est ouverte
    if (payload.notification) {
      new Notification(payload.notification.title || "Lokita", {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: payload.data?.appointmentId || "lokita-notification",
        requireInteraction: true,
      });
    }
  });
}

/**
 * Sauvegarde le token FCM dans la base de données
 * @param token - Token FCM
 * @param userId - ID de l'utilisateur
 */
export async function saveFCMToken(
  token: string,
  userId: string
): Promise<void> {
  try {
    await fetch("/api/notifications/register-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, userId }),
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du token FCM:", error);
  }
}
