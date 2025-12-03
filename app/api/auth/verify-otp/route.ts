import { signJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBeninPhone } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/verify-otp
 * Vérifie le code OTP et retourne un JWT
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = body;

    // Validation des données
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: "Numéro de téléphone et code requis" },
        { status: 400 }
      );
    }

    const formattedPhone = formatBeninPhone(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Trouver le code OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: code.trim(),
        isUsed: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      // Incrémenter les tentatives échouées
      await prisma.otpCode.updateMany({
        where: {
          userId: user.id,
          code: code.trim(),
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 401 }
      );
    }

    // Vérifier le nombre de tentatives
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return NextResponse.json(
        { error: "Nombre maximum de tentatives atteint" },
        { status: 429 }
      );
    }

    // Marquer le code comme utilisé
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // Marquer le téléphone comme vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
      },
    });

    // Générer le JWT
    const token = await signJWT({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "User",
        entityId: user.id,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // Retourner les données utilisateur et le token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
