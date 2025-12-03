import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAppointmentRequestNotification } from "@/lib/sms";
import { formatBeninPhone } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/appointments
 * Créer une nouvelle demande de rendez-vous
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hospitalId,
      requestedDate,
      requestedSlot,
      reason,
      firstName,
      lastName,
      phoneNumber,
    } = body;

    // Validation des données
    if (
      !hospitalId ||
      !requestedDate ||
      !requestedSlot ||
      !reason ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const formattedPhone = formatBeninPhone(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Numéro de téléphone béninois invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est connecté
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = await verifyJWT(token);
          userId = payload.userId;
        } catch (err) {
          // Token invalide, on continue sans userId
        }
      }
    }

    // Si pas connecté, créer ou trouver l'utilisateur
    if (!userId) {
      let user = await prisma.user.findUnique({
        where: { phoneNumber: formattedPhone },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phoneNumber: formattedPhone,
            firstName: firstName || "",
            lastName: lastName || "",
            role: "PATIENT",
            isPhoneVerified: false,
          },
        });
      } else if (firstName && lastName) {
        // Mettre à jour le nom si fourni
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
          },
        });
      }

      userId = user.id;
    }

    // Vérifier que l'hôpital existe
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hôpital non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le nombre de RDV en attente de l'utilisateur
    const pendingAppointments = await prisma.appointment.count({
      where: {
        patientId: userId,
        status: "PENDING",
      },
    });

    const MAX_PENDING = parseInt(
      process.env.MAX_PENDING_APPOINTMENTS_PER_USER || "3"
    );
    if (pendingAppointments >= MAX_PENDING) {
      return NextResponse.json(
        {
          error: `Vous avez déjà ${MAX_PENDING} demandes de rendez-vous en attente`,
        },
        { status: 429 }
      );
    }

    // Créer le rendez-vous
    const appointment = await prisma.appointment.create({
      data: {
        patientId: userId,
        hospitalId,
        requestedDate: new Date(requestedDate),
        requestedSlot,
        reason,
        status: "PENDING",
      },
      include: {
        patient: true,
        hospital: true,
      },
    });

    // Envoyer une notification SMS au patient
    if (process.env.NODE_ENV === "production") {
      await sendAppointmentRequestNotification(formattedPhone, hospital.name);
    } else {
      console.log(
        `📧 SMS envoyé à ${formattedPhone}: Demande de RDV reçue pour ${hospital.name}`
      );
    }

    // Créer une notification dans la DB
    await prisma.notification.create({
      data: {
        userId,
        appointmentId: appointment.id,
        type: "SMS",
        title: "Demande de rendez-vous reçue",
        message: `Votre demande de rendez-vous à ${hospital.name} a été reçue. Vous serez notifié de la confirmation.`,
        isSent: true,
        sentAt: new Date(),
      },
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CREATE_APPOINTMENT",
        entityType: "Appointment",
        entityId: appointment.id,
        newData: {
          hospitalId,
          requestedDate,
          requestedSlot,
          reason,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du rendez-vous" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments
 * Récupérer les rendez-vous de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = await verifyJWT(token);

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: payload.userId,
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            district: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        requestedDate: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rendez-vous" },
      { status: 500 }
    );
  }
}
