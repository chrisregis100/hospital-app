import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/appointments/[id]
 * Récupérer un rendez-vous spécifique
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Récupérer le rendez-vous
    const appointment = await prisma.appointment.findUnique({
      where: { id },
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
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier l'autorisation (seulement si connecté)
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = await verifyJWT(token);

          // Seul le patient, un secrétaire/médecin de l'hôpital, ou un admin peuvent voir le RDV
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
          });

          if (!user) {
            return NextResponse.json(
              { error: "Utilisateur non trouvé" },
              { status: 401 }
            );
          }

          const isAuthorized =
            user.id === appointment.patientId ||
            user.role === "SUPER_ADMIN" ||
            (user.hospitalId === appointment.hospitalId &&
              (user.role === "SECRETARY" || user.role === "DOCTOR"));

          if (!isAuthorized) {
            return NextResponse.json(
              { error: "Non autorisé à voir ce rendez-vous" },
              { status: 403 }
            );
          }
        } catch (err) {
          // Token invalide, on retourne quand même le RDV (pour les cas sans auth)
        }
      }
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du rendez-vous" },
      { status: 500 }
    );
  }
}
