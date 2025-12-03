/**
 * Service IndexedDB pour le stockage local et le mode hors-ligne
 * Permet de consulter l'historique des RDV sans connexion
 */

import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "lokita-offline-db";
const DB_VERSION = 1;

interface AppointmentCache {
  id: string;
  hospitalName: string;
  hospitalAddress: string;
  requestedDate: string;
  confirmedDate?: string;
  reason: string;
  status: string;
  specialty?: string;
  cachedAt: number;
}

interface HospitalCache {
  id: string;
  name: string;
  address: string;
  district: string;
  phoneNumber: string;
  specialties: string[];
  cachedAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/**
 * Initialise la base de données IndexedDB
 */
async function getDB() {
  if (dbPromise) return dbPromise;

  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store pour les rendez-vous
      if (!db.objectStoreNames.contains("appointments")) {
        const appointmentStore = db.createObjectStore("appointments", {
          keyPath: "id",
        });
        appointmentStore.createIndex("status", "status");
        appointmentStore.createIndex("requestedDate", "requestedDate");
      }

      // Store pour les hôpitaux
      if (!db.objectStoreNames.contains("hospitals")) {
        const hospitalStore = db.createObjectStore("hospitals", {
          keyPath: "id",
        });
        hospitalStore.createIndex("district", "district");
      }

      // Store pour les métadonnées utilisateur
      if (!db.objectStoreNames.contains("user")) {
        db.createObjectStore("user", { keyPath: "id" });
      }
    },
  });

  return dbPromise;
}

/**
 * Sauvegarde les rendez-vous en cache
 * @param appointments - Liste des rendez-vous à cacher
 */
export async function cacheAppointments(appointments: any[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("appointments", "readwrite");

    for (const appointment of appointments) {
      const cached: AppointmentCache = {
        id: appointment.id,
        hospitalName: appointment.hospital?.name || "",
        hospitalAddress: appointment.hospital?.address || "",
        requestedDate: appointment.requestedDate,
        confirmedDate: appointment.confirmedDate,
        reason: appointment.reason,
        status: appointment.status,
        cachedAt: Date.now(),
      };
      await tx.store.put(cached);
    }

    await tx.done;
    console.log("✅ Rendez-vous mis en cache");
  } catch (error) {
    console.error("Erreur lors de la mise en cache des RDV:", error);
  }
}

/**
 * Récupère les rendez-vous depuis le cache
 * @returns Liste des rendez-vous en cache
 */
export async function getCachedAppointments(): Promise<AppointmentCache[]> {
  try {
    const db = await getDB();
    const appointments = await db.getAll("appointments");
    return appointments.sort(
      (a, b) =>
        new Date(b.requestedDate).getTime() -
        new Date(a.requestedDate).getTime()
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du cache:", error);
    return [];
  }
}

/**
 * Sauvegarde les hôpitaux en cache
 * @param hospitals - Liste des hôpitaux à cacher
 */
export async function cacheHospitals(hospitals: any[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("hospitals", "readwrite");

    for (const hospital of hospitals) {
      const cached: HospitalCache = {
        id: hospital.id,
        name: hospital.name,
        address: hospital.address,
        district: hospital.district,
        phoneNumber: hospital.phoneNumber,
        specialties:
          hospital.specialties?.map((s: any) => s.specialty?.name) || [],
        cachedAt: Date.now(),
      };
      await tx.store.put(cached);
    }

    await tx.done;
    console.log("✅ Hôpitaux mis en cache");
  } catch (error) {
    console.error("Erreur lors de la mise en cache des hôpitaux:", error);
  }
}

/**
 * Récupère les hôpitaux depuis le cache
 * @returns Liste des hôpitaux en cache
 */
export async function getCachedHospitals(): Promise<HospitalCache[]> {
  try {
    const db = await getDB();
    return await db.getAll("hospitals");
  } catch (error) {
    console.error("Erreur lors de la récupération du cache:", error);
    return [];
  }
}

/**
 * Sauvegarde les données utilisateur en cache
 * @param user - Données utilisateur
 */
export async function cacheUserData(user: any): Promise<void> {
  try {
    const db = await getDB();
    await db.put("user", { ...user, id: "current", cachedAt: Date.now() });
    console.log("✅ Données utilisateur mises en cache");
  } catch (error) {
    console.error("Erreur lors de la mise en cache utilisateur:", error);
  }
}

/**
 * Récupère les données utilisateur depuis le cache
 * @returns Données utilisateur ou null
 */
export async function getCachedUserData(): Promise<any | null> {
  try {
    const db = await getDB();
    return await db.get("user", "current");
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du cache utilisateur:",
      error
    );
    return null;
  }
}

/**
 * Vide tout le cache
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear("appointments");
    await db.clear("hospitals");
    await db.clear("user");
    console.log("✅ Cache vidé");
  } catch (error) {
    console.error("Erreur lors du vidage du cache:", error);
  }
}

/**
 * Vérifie si les données en cache sont récentes (< 24h)
 * @param cachedAt - Timestamp de mise en cache
 * @returns true si les données sont récentes
 */
export function isCacheFresh(cachedAt: number): boolean {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return Date.now() - cachedAt < ONE_DAY;
}

/**
 * Retourne le statut de la connexion
 * @returns true si en ligne
 */
export function isOnline(): boolean {
  return typeof window !== "undefined" && navigator.onLine;
}
