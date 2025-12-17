'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
<parameter name="Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { isValidBeninPhone, formatBeninPhone } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Loader2,
} from "lucide-react";

const TIME_SLOTS = [
  { value: "MORNING_8_10", label: "08h - 10h", icon: "🌅" },
  { value: "MORNING_10_12", label: "10h - 12h", icon: "☀️" },
  { value: "AFTERNOON_14_16", label: "14h - 16h", icon: "🌤️" },
  { value: "AFTERNOON_16_18", label: "16h - 18h", icon: "🌆" },
  { value: "EVENING_18_20", label: "18h - 20h", icon: "🌙" },
];

function AppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Données du formulaire
  const [hospitalId, setHospitalId] = useState(searchParams.get("hospitalId") || "");
  const [hospitalName, setHospitalName] = useState(searchParams.get("hospitalName") || "");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (!hospitalId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un hôpital",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [hospitalId, router, toast]);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  const validateStep = () => {
    if (step === 1) {
      if (!preferredDate || !timeSlot) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner une date et un créneau horaire",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 2) {
      if (!reason.trim()) {
        toast({
          title: "Champ requis",
          description: "Veuillez indiquer le motif de votre consultation",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 3) {
      if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
        toast({
          title: "Champs requis",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return false;
      }
      if (!isValidBeninPhone(phoneNumber)) {
        toast({
          title: "Numéro invalide",
          description: "Veuillez entrer un numéro béninois valide (+229XXXXXXXX)",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          requestedDate: new Date(preferredDate).toISOString(),
          requestedSlot: timeSlot,
          reason,
          firstName,
          lastName,
          phoneNumber: formatBeninPhone(phoneNumber) || phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du rendez-vous");
      }

      toast({
        title: "Rendez-vous demandé !",
        description: "Vous allez recevoir un SMS de confirmation",
      });

      router.push(`/appointments/${data.id}/confirmation`);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer le rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Date & Heure", icon: Calendar },
    { number: 2, title: "Motif", icon: FileText },
    { number: 3, title: "Vos Informations", icon: User },
    { number: 4, title: "Confirmation", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouveau Rendez-vous
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-[#00A86B]" />
            {hospitalName}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Ligne de connexion */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#00A86B] transition-all duration-500 -z-10"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isActive ? 'bg-[#00A86B] text-white scale-110 shadow-lg' : ''}
                      ${isCompleted ? 'bg-[#00A86B] text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-white border-2 border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${isActive ? 'text-[#00A86B]' : 'text-gray-500'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-8">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <Label htmlFor="date" className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#00A86B]" />
                    Date préférée
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="mt-2 h-12 text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Sélectionnez une date entre demain et dans 3 mois
                  </p>
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#00A86B]" />
                    Créneau horaire
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setTimeSlot(slot.value)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${timeSlot === slot.value
                            ? 'border-[#00A86B] bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-[#00A86B]/50 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="text-2xl mr-2">{slot.icon}</span>
                        <span className="font-semibold">{slot.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Reason */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <Label htmlFor="reason" className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#00A86B]" />
                    Motif de la consultation
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Décrivez brièvement la raison de votre visite..."
                    className="mt-2 min-h-[150px] text-lg"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {reason.length}/500 caractères
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Personal Information */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-lg font-semibold mb-2">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-lg font-semibold mb-2">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Votre nom"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#00A86B]" />
                    Numéro de téléphone
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      +229
                    </span>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="XX XX XX XX"
                      className="h-12 text-lg pl-16"
                      maxLength={8}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Vous recevrez un SMS de confirmation
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#00A86B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Vérifiez vos informations
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Hôpital</p>
                      <p className="text-gray-900">{hospitalName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Date</p>
                      <p className="text-gray-900">
                        {new Date(preferredDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Créneau</p>
                      <p className="text-gray-900">
                        {TIME_SLOTS.find((s) => s.value === timeSlot)?.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Motif</p>
                      <p className="text-gray-900">{reason}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Patient</p>
                      <p className="text-gray-900">{firstName} {lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#00A86B] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Téléphone</p>
                      <p className="text-gray-900">+229 {phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || loading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-[#00A86B] hover:bg-[#008f5d] flex items-center gap-2"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#00A86B] hover:bg-[#008f5d] flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      Confirmer
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    }>
      <AppointmentForm />
    </Suspense>
  );
}
