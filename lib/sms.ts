/**
 * Service d'envoi de SMS via Celtiis API (Bénin)
 * Documentation: https://www.celtiis.com/api
 */

const CELTIIS_API_KEY = process.env.CELTIIS_API_KEY || "";
const CELTIIS_API_URL =
  process.env.CELTIIS_API_URL || "https://api.celtiis.com/v1";
const CELTIIS_SENDER_NAME = process.env.CELTIIS_SENDER_NAME || "Lokita";

export interface SMSOptions {
  to: string; // Numéro au format +229XXXXXXXX
  message: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoie un SMS via l'API Celtiis
 * @param options - Options d'envoi
 * @returns Résultat de l'envoi
 */
export async function sendSMS(options: SMSOptions): Promise<SMSResponse> {
  try {
    // Validation du numéro béninois
    if (!options.to.startsWith("+229") || options.to.length !== 12) {
      return {
        success: false,
        error: "Numéro de téléphone béninois invalide",
      };
    }

    // Limitation de la taille du message (160 caractères pour un SMS standard)
    if (options.message.length > 160) {
      console.warn("Message SMS tronqué à 160 caractères");
      options.message = options.message.substring(0, 157) + "...";
    }

    const response = await fetch(`${CELTIIS_API_URL}/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CELTIIS_API_KEY}`,
      },
      body: JSON.stringify({
        sender: CELTIIS_SENDER_NAME,
        recipient: options.to,
        message: options.message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur Celtiis API:", error);
      return {
        success: false,
        error: error.message || "Erreur lors de l'envoi du SMS",
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error);
    return {
      success: false,
      error: "Erreur de connexion à Celtiis",
    };
  }
}

/**
 * Envoie un code OTP par SMS
 * @param phoneNumber - Numéro de téléphone
 * @param code - Code OTP
 * @returns Résultat de l'envoi
 */
export async function sendOTP(
  phoneNumber: string,
  code: string
): Promise<SMSResponse> {
  const message = `Lokita: Votre code de vérification est ${code}. Valide pendant 3 minutes.`;
  return sendSMS({ to: phoneNumber, message });
}

/**
 * Envoie une notification de demande de RDV reçue
 * @param phoneNumber - Numéro du patient
 * @param hospitalName - Nom de l'hôpital
 * @returns Résultat de l'envoi
 */
export async function sendAppointmentRequestNotification(
  phoneNumber: string,
  hospitalName: string
): Promise<SMSResponse> {
  const message = `Lokita: Votre demande de RDV à ${hospitalName} a été reçue. Vous serez notifié de la confirmation.`;
  return sendSMS({ to: phoneNumber, message });
}

/**
 * Envoie une notification de confirmation de RDV
 * @param phoneNumber - Numéro du patient
 * @param hospitalName - Nom de l'hôpital
 * @param date - Date et heure du RDV
 * @returns Résultat de l'envoi
 */
export async function sendAppointmentConfirmation(
  phoneNumber: string,
  hospitalName: string,
  date: string
): Promise<SMSResponse> {
  const message = `Lokita: RDV confirmé à ${hospitalName} le ${date}. Soyez ponctuel(le) !`;
  return sendSMS({ to: phoneNumber, message });
}

/**
 * Envoie un rappel de RDV J-1
 * @param phoneNumber - Numéro du patient
 * @param hospitalName - Nom de l'hôpital
 * @param date - Date et heure du RDV
 * @returns Résultat de l'envoi
 */
export async function sendDayBeforeReminder(
  phoneNumber: string,
  hospitalName: string,
  date: string
): Promise<SMSResponse> {
  const message = `Lokita: Rappel - Vous avez RDV demain à ${hospitalName} à ${date}.`;
  return sendSMS({ to: phoneNumber, message });
}

/**
 * Envoie un rappel de RDV H-2h
 * @param phoneNumber - Numéro du patient
 * @param hospitalName - Nom de l'hôpital
 * @param time - Heure du RDV
 * @returns Résultat de l'envoi
 */
export async function sendSameDayReminder(
  phoneNumber: string,
  hospitalName: string,
  time: string
): Promise<SMSResponse> {
  const message = `Lokita: Rappel - RDV dans 2h à ${hospitalName} (${time}). N'oubliez pas !`;
  return sendSMS({ to: phoneNumber, message });
}
