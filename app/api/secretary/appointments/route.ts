import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/secretary/appointments
 * Récupérer les rendez-vous de l'hôpital du secrétaire
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
    if (user.role !== "SECRETARY") {
      return NextResponse.json(
        { error: "Accès réservé aux secrétaires" },
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

    // Récupérer les rendez-vous de l'hôpital
    const appointments = await prisma.appointment.findMany({
      where: {
        hospitalId: user.hospitalId,
        status: {
          in: ["PENDING", "CONFIRMED"],
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
        createdAt: "desc",
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
