import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/secretary/appointments/[id]/reject
 * Refuser une demande de rendez-vous
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = await verifyJWT(token);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.role !== "SECRETARY") {
      return NextResponse.json(
        { error: "Accès réservé aux secrétaires" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Récupérer le rendez-vous
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        hospital: true,
        patient: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que c'est l'hôpital du secrétaire
    if (appointment.hospitalId !== user.hospitalId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas refuser ce rendez-vous" },
        { status: 403 }
      );
    }

    // Mettre à jour le rendez-vous
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelledBy: user.id,
      },
    });

    // Récupérer les données complètes
    const fullAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        hospital: true,
        patient: true,
      },
    });

    // Envoyer SMS au patient
    const message = `Lokita: Votre demande de RDV à ${
      fullAppointment!.hospital.name
    } n'a pas pu être acceptée. Veuillez nous contacter.`;
    if (process.env.NODE_ENV === "production") {
      await sendSMS({
        to: fullAppointment!.patient.phoneNumber,
        message,
      });
    } else {
      console.log(
        `📧 SMS envoyé à ${fullAppointment!.patient.phoneNumber}: ${message}`
      );
    }

    // Créer notification
    await prisma.notification.create({
      data: {
        userId: updatedAppointment.patientId,
        appointmentId: updatedAppointment.id,
        type: "SMS",
        title: "Demande de rendez-vous refusée",
        message,
        isSent: true,
        sentAt: new Date(),
      },
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REJECT_APPOINTMENT",
        entityType: "Appointment",
        entityId: updatedAppointment.id,
        oldData: {
          status: appointment.status,
        },
        newData: {
          status: updatedAppointment.status,
          cancelledAt: updatedAppointment.cancelledAt,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return NextResponse.json(
      { error: "Erreur lors du refus" },
      { status: 500 }
    );
  }
}
