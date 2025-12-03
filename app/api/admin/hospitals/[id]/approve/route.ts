import { extractTokenFromHeader, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/admin/hospitals/[id]/approve
 * Approuver un hôpital
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

    // Mettre à jour l'hôpital
    const updatedHospital = await prisma.hospital.update({
      where: { id },
      data: {
        isApproved: true,
        approvedBy: user.id,
        approvedAt: new Date(),
      },
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "APPROVE_HOSPITAL",
        entityType: "Hospital",
        entityId: updatedHospital.id,
        oldData: {
          isApproved: hospital.isApproved,
        },
        newData: {
          isApproved: updatedHospital.isApproved,
          approvedAt: updatedHospital.approvedAt,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(updatedHospital);
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'approbation" },
      { status: 500 }
    );
  }
}
