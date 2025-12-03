import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/specialties
 * Récupère la liste de toutes les spécialités
 */
export async function GET(request: NextRequest) {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      specialties,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des spécialités:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des spécialités" },
      { status: 500 }
    );
  }
}
