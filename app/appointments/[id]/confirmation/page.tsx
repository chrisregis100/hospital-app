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
import { timeSlotToText } from "@/lib/utils";
import { TimeSlot } from "@prisma/client";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  requestedDate: string;
  requestedSlot: TimeSlot;
  confirmedDate?: string;
  reason: string;
  status: string;
  createdAt: string;
  hospital: {
    id: string;
    name: string;
    address: string;
    district: string;
    phoneNumber?: string;
  };
  patient: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export default function AppointmentConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appointmentId) {
      router.push("/hospitals");
      return;
    }

    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/appointments/${appointmentId}`, {
          headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Rendez-vous non trouvé");
          } else {
            setError("Erreur lors du chargement du rendez-vous");
          }
          return;
        }

        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement du rendez-vous");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>
              {error || "Rendez-vous introuvable"}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/hospitals")}
              className="w-full"
            >
              Retour aux hôpitaux
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const requestedDateObj = new Date(appointment.requestedDate);
  const formattedRequestedDate = requestedDateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demande envoyée !
          </h1>
          <p className="text-gray-600">
            Votre demande de rendez-vous a été enregistrée avec succès
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">
                En attente de confirmation
              </CardTitle>
            </div>
            <CardDescription>
              L'hôpital va examiner votre demande et vous confirmera la date et
              l'heure exactes par SMS.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Appointment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Détails de votre demande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hospital */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  {appointment.hospital.name}
                </p>
                <p className="text-sm text-gray-600">
                  {appointment.hospital.address}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.hospital.district}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  Date et heure souhaitées
                </p>
                <p className="text-sm text-gray-600">
                  {formattedRequestedDate}
                </p>
                <p className="text-sm text-gray-600">
                  {timeSlotToText(appointment.requestedSlot)}
                </p>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Patient</p>
                <p className="text-sm text-gray-600">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {appointment.patient.phoneNumber}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">
                  Motif de consultation
                </p>
                <p className="text-sm text-gray-600">{appointment.reason}</p>
              </div>
            </div>

            {/* Hospital Phone */}
            {appointment.hospital.phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Contact hôpital</p>
                  <a
                    href={`tel:${appointment.hospital.phoneNumber}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {appointment.hospital.phoneNumber}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <p className="text-sm text-gray-700 pt-0.5">
                  <strong>Vérification SMS :</strong> Vous avez reçu un SMS de
                  confirmation de demande
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <p className="text-sm text-gray-700 pt-0.5">
                  <strong>Validation secrétariat :</strong> L'hôpital examine
                  votre demande et fixe la date/heure définitive
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <p className="text-sm text-gray-700 pt-0.5">
                  <strong>SMS de confirmation :</strong> Vous recevrez un SMS
                  avec la date et l'heure confirmées
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <p className="text-sm text-gray-700 pt-0.5">
                  <strong>Rappels automatiques :</strong> SMS la veille à 18h et
                  le jour même 2h avant
                </p>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/hospitals")}
            variant="outline"
            className="flex-1"
          >
            Retour aux hôpitaux
          </Button>
          <Button onClick={() => router.push("/")} className="flex-1">
            Retour à l'accueil
          </Button>
        </div>

        {/* Reference Number */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Numéro de référence :{" "}
            <span className="font-mono">
              {appointment.id.slice(0, 8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
