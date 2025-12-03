"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const TIME_SLOTS = [
  { value: "MORNING_8_10", label: "8h00 - 10h00" },
  { value: "MORNING_10_12", label: "10h00 - 12h00" },
  { value: "AFTERNOON_14_16", label: "14h00 - 16h00" },
  { value: "AFTERNOON_16_18", label: "16h00 - 18h00" },
  { value: "EVENING_18_20", label: "18h00 - 20h00" },
];

function NewAppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hospitalId = searchParams.get("hospital");

  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    requestedDate: "",
    requestedSlot: "",
    reason: "",
    firstName: "",
    lastName: "",
    phoneNumber: "+229",
  });

  useEffect(() => {
    if (hospitalId) {
      loadHospital();
    }

    // Charger les données utilisateur si connecté
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "+229",
      }));
    }
  }, [hospitalId]);

  const loadHospital = async () => {
    try {
      const res = await fetch(`/api/hospitals?id=${hospitalId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHospital(data[0]);
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'hôpital");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          hospitalId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la création du rendez-vous"
        );
      }

      // Succès - rediriger vers la page de confirmation
      router.push(`/appointments/${data.id}/confirmation`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Hôpital non trouvé</p>
          <Link href="/hospitals">
            <Button>Retour aux hôpitaux</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculer la date minimale (demain)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Calculer la date maximale (3 mois)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-500" fill="#00A86B" />
              <span className="text-2xl font-bold text-gray-900">Lokita</span>
            </Link>
            <Link href="/hospitals">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        {/* Info hôpital */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prendre rendez-vous
          </h1>
          <p className="text-lg text-gray-600">{hospital.name}</p>
          <p className="text-sm text-gray-500">{hospital.address}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails du rendez-vous</CardTitle>
            <CardDescription>
              Remplissez le formulaire pour demander un rendez-vous. L'hôpital
              confirmera la date et l'heure exactes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date souhaitée */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date souhaitée
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={minDate}
                  max={maxDateStr}
                  value={formData.requestedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedDate: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Choisissez une date entre demain et 3 mois
                </p>
              </div>

              {/* Créneau horaire */}
              <div className="space-y-2">
                <Label htmlFor="slot">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Tranche horaire préférée
                </Label>
                <Select
                  value={formData.requestedSlot}
                  onValueChange={(value) =>
                    setFormData({ ...formData, requestedSlot: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un créneau" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motif */}
              <div className="space-y-2">
                <Label htmlFor="reason">Motif de consultation</Label>
                <Textarea
                  id="reason"
                  placeholder="Décrivez brièvement la raison de votre consultation..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>

              {/* Informations personnelles */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Vos informations</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer la demande"
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Vous recevrez une confirmation par SMS une fois que l'hôpital
                aura validé votre rendez-vous
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <NewAppointmentForm />
    </Suspense>
  );
}
