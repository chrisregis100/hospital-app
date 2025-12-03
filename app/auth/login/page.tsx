"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isValidBeninPhone } from "@/lib/utils";
import { ArrowLeft, Heart, Loader2, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(180);

  // Timer pour le compte à rebours OTP
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidBeninPhone(phoneNumber)) {
      toast({
        title: "Numéro invalide",
        description:
          "Veuillez entrer un numéro de téléphone béninois valide (+229XXXXXXXX)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }

      toast({
        title: "Code envoyé !",
        description: "Un code de vérification a été envoyé par SMS",
      });

      setStep("otp");
      setExpiresIn(data.expiresIn || 180);

      // Démarrer le compte à rebours
      const countdown = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimer(countdown);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Code invalide ou expiré");
      }

      // Sauvegarder le token et les données utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur Lokita",
      });

      // Nettoyer le timer
      if (timer) clearInterval(timer);

      // Rediriger selon le rôle
      switch (data.user.role) {
        case "PATIENT":
          router.push("/hospitals");
          break;
        case "SECRETARY":
          router.push("/dashboard/secretary");
          break;
        case "DOCTOR":
          router.push("/dashboard/doctor");
          break;
        case "SUPER_ADMIN":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-10 h-10 text-primary-500" fill="#00A86B" />
          <span className="text-3xl font-bold text-gray-900">Lokita</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              {step === "otp" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    if (timer) clearInterval(timer);
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="text-2xl">
                {step === "phone" ? "Connexion" : "Vérification"}
              </CardTitle>
            </div>
            <CardDescription>
              {step === "phone"
                ? "Entrez votre numéro de téléphone béninois"
                : "Entrez le code reçu par SMS"}
            </CardDescription>
          </CardHeader>

          {step === "phone" ? (
            <form onSubmit={handleSendOTP}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+229 XX XX XX XX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: +229 suivi de 8 chiffres
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Recevoir le code"
                  )}
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary-600 font-medium hover:underline"
                  >
                    S'inscrire
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code de vérification</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest"
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Code envoyé au {phoneNumber}
                  </p>
                </div>

                {expiresIn > 0 ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Code valide pendant{" "}
                      <span className="font-semibold text-primary-600">
                        {formatTime(expiresIn)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-destructive mb-2">Code expiré</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                      }}
                    >
                      Renvoyer un code
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || expiresIn === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-primary-600"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
