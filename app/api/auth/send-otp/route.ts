import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/sms";
import { formatBeninPhone, generateOTP, getOTPExpiration } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/send-otp
 * Envoie un code OTP par SMS au numéro de téléphone
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Validation du numéro de téléphone
    const formattedPhone = formatBeninPhone(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Numéro de téléphone béninois invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe, sinon le créer
    let user = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone },
    });

    if (!user) {
      // Créer un nouvel utilisateur temporaire
      user = await prisma.user.create({
        data: {
          phoneNumber: formattedPhone,
          firstName: "",
          lastName: "",
          role: "PATIENT",
          isPhoneVerified: false,
        },
      });
    }

    // Générer le code OTP
    const otpCode = generateOTP(6);
    const expiresAt = getOTPExpiration(3); // 3 minutes

    // Invalider tous les anciens codes OTP non utilisés
    await prisma.otpCode.updateMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // Créer le nouveau code OTP
    await prisma.otpCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    // Envoyer le SMS
    if (process.env.NODE_ENV === "production") {
      const smsResult = await sendOTP(formattedPhone, otpCode);
      if (!smsResult.success) {
        console.error("Erreur envoi SMS:", smsResult.error);
        // En production, on pourrait vouloir retourner une erreur
        // Pour le MVP, on continue même si l'envoi échoue
      }
    } else {
      // En développement, afficher le code dans les logs
      console.log(`🔐 Code OTP pour ${formattedPhone}: ${otpCode}`);
    }

    // Logger l'action
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SEND_OTP",
        entityType: "OtpCode",
        entityId: user.id,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Code de vérification envoyé par SMS",
      expiresIn: 180, // 3 minutes en secondes
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'OTP:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code" },
      { status: 500 }
    );
  }
}
