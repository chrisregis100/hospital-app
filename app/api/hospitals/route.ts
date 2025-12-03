import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/hospitals
 * Récupère la liste des hôpitaux approuvés avec filtres optionnels
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");
    const specialtyId = searchParams.get("specialtyId");
    const search = searchParams.get("search");

    // Construire les filtres
    const where: any = {
      isApproved: true,
    };

    if (district) {
      where.district = district;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (specialtyId) {
      where.specialties = {
        some: {
          specialtyId,
        },
      };
    }

    // Récupérer les hôpitaux avec leurs spécialités
    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      hospitals: hospitals.map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        address: hospital.address,
        district: hospital.district,
        city: hospital.city,
        phoneNumber: hospital.phoneNumber,
        email: hospital.email,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        openingHours: hospital.openingHours,
        specialties: hospital.specialties.map((hs) => ({
          id: hs.specialty.id,
          name: hs.specialty.name,
          description: hs.specialty.description,
          iconName: hs.specialty.iconName,
          availableDoctors: hs.availableDoctors,
        })),
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des hôpitaux:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des hôpitaux" },
      { status: 500 }
    );
  }
}
