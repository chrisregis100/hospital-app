import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/hospitals
 * Récupérer tous les hôpitaux (pour super-admin)
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
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Accès réservé aux super-admins" },
        { status: 403 }
      );
    }

    // Récupérer tous les hôpitaux
    const hospitals = await prisma.hospital.findMany({
      include: {
        approvedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            specialties: true,
          },
        },
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("Erreur lors de la récupération des hôpitaux:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des hôpitaux" },
      { status: 500 }
    );
  }
}
