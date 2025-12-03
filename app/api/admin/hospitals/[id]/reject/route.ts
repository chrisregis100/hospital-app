import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/admin/hospitals/[id]/reject
 * Rejeter/supprimer un hôpital
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

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Accès réservé aux super-admins" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Récupérer l'hôpital
    const hospital = await prisma.hospital.findUnique({
      where: { id },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hôpital non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des rendez-vous actifs
    const activeAppointments = await prisma.appointment.count({
      where: {
        hospitalId: id,
        status: {
          in: ["PENDING", "CONFIRMED", "ARRIVED"],
        },
      },
    });

    if (activeAppointments > 0) {
      return NextResponse.json(
        {
          error: `Impossible de rejeter cet hôpital : ${activeAppointments} rendez-vous actifs`,
        },
        { status: 400 }
      );
    }

    // Logger l'action avant suppression
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REJECT_HOSPITAL",
        entityType: "Hospital",
        entityId: hospital.id,
        oldData: {
          name: hospital.name,
          address: hospital.address,
          isApproved: hospital.isApproved,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // Supprimer l'hôpital
    await prisma.hospital.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du rejet:", error);
    return NextResponse.json(
      { error: "Erreur lors du rejet" },
      { status: 500 }
    );
  }
}
