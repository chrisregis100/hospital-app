import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAppointmentConfirmation } from "@/lib/sms";
import { formatDateFr } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/secretary/appointments/[id]/confirm
 * Confirmer un rendez-vous avec date et heure exactes
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
    const body = await request.json();
    const { confirmedDate } = body;

    if (!confirmedDate) {
      return NextResponse.json(
        { error: "Date de confirmation requise" },
        { status: 400 }
      );
    }

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
        { error: "Vous ne pouvez pas confirmer ce rendez-vous" },
        { status: 403 }
      );
    }

    // Mettre à jour le rendez-vous
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        confirmedDate: new Date(confirmedDate),
        status: "CONFIRMED",
        confirmedBy: user.id,
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

    // Envoyer une notification SMS au patient
    const dateFormatted = formatDateFr(new Date(confirmedDate));
    if (process.env.NODE_ENV === "production") {
      await sendAppointmentConfirmation(
        fullAppointment!.patient.phoneNumber,
        fullAppointment!.hospital.name,
        dateFormatted
      );
    } else {
      console.log(
        `📧 SMS envoyé à ${
          fullAppointment!.patient.phoneNumber
        }: RDV confirmé à ${fullAppointment!.hospital.name} le ${dateFormatted}`
      );
    }

    // Créer notification
    await prisma.notification.create({
      data: {
        userId: updatedAppointment.patientId,
        appointmentId: updatedAppointment.id,
        type: "SMS",
        title: "Rendez-vous confirmé",
        message: `Votre rendez-vous à ${
          fullAppointment!.hospital.name
        } est confirmé pour le ${dateFormatted}`,
        isSent: true,
        sentAt: new Date(),
      },
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CONFIRM_APPOINTMENT",
        entityType: "Appointment",
        entityId: updatedAppointment.id,
        oldData: {
          status: appointment.status,
          confirmedDate: appointment.confirmedDate,
        },
        newData: {
          status: updatedAppointment.status,
          confirmedDate: updatedAppointment.confirmedDate,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Erreur lors de la confirmation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la confirmation" },
      { status: 500 }
    );
  }
}
