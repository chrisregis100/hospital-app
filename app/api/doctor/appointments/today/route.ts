import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/doctor/appointments/today
 * Récupérer les rendez-vous du jour pour le médecin
 */
export async function GET(request: NextRequest) {
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

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 401 }
      );
    }

    // Vérifier le rôle
    if (user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Accès réservé aux médecins" },
        { status: 403 }
      );
    }

    // Vérifier l'hôpital
    if (!user.hospitalId) {
      return NextResponse.json(
        { error: "Aucun hôpital associé" },
        { status: 400 }
      );
    }

    // Calculer le début et la fin de la journée
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Récupérer les rendez-vous du jour
    const appointments = await prisma.appointment.findMany({
      where: {
        hospitalId: user.hospitalId,
        confirmedDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ["CONFIRMED", "ARRIVED", "COMPLETED"],
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        confirmedDate: "asc",
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
