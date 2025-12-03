import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/doctor/appointments/[id]/completed
 * Marquer une consultation comme terminée
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

    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Accès réservé aux médecins" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Récupérer le rendez-vous
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que c'est l'hôpital du médecin
    if (appointment.hospitalId !== user.hospitalId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas modifier ce rendez-vous" },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        completedBy: user.id,
      },
      include: {
        patient: true,
      },
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "COMPLETE_APPOINTMENT",
        entityType: "Appointment",
        entityId: updatedAppointment.id,
        oldData: {
          status: appointment.status,
        },
        newData: {
          status: updatedAppointment.status,
          completedAt: updatedAppointment.completedAt,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
