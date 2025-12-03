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
import { useToast } from "@/components/ui/use-toast";
import { timeSlotToText } from "@/lib/utils";
import { TimeSlot } from "@prisma/client";
import {
  Calendar,
  Check,
  Clock,
  FileText,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  requestedDate: string;
  requestedSlot: TimeSlot;
  confirmedDate?: string;
  reason: string;
  status: string;
  createdAt: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export default function SecretaryDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [confirmedDate, setConfirmedDate] = useState("");
  const [confirmedTime, setConfirmedTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchAppointments();
  }, [router]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/secretary/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (response.status === 403) {
        toast({
          title: "Accès refusé",
          description: "Vous devez être secrétaire pour accéder à cette page",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedAppointment || !confirmedDate || !confirmedTime) {
      toast({
        title: "Données manquantes",
        description: "Veuillez sélectionner une date et une heure",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const confirmedDateTime = new Date(
        `${confirmedDate}T${confirmedTime}:00`
      );

      const response = await fetch(
        `/api/secretary/appointments/${selectedAppointment.id}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            confirmedDate: confirmedDateTime.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la confirmation");
      }

      toast({
        title: "Rendez-vous confirmé",
        description: "Le patient a reçu un SMS de confirmation",
      });

      // Réinitialiser
      setSelectedAppointment(null);
      setConfirmedDate("");
      setConfirmedTime("");

      // Recharger la liste
      await fetchAppointments();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de confirmer le rendez-vous",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (appointmentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser ce rendez-vous ?")) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/secretary/appointments/${appointmentId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors du refus");
      }

      toast({
        title: "Rendez-vous refusé",
        description: "Le patient a été notifié",
      });

      // Recharger la liste
      await fetchAppointments();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de refuser le rendez-vous",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(
    (a) => a.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Secrétaire
              </h1>
              <p className="text-sm text-gray-600">
                Gestion des demandes de rendez-vous
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {pendingAppointments.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confirmés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "CONFIRMED").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">
                {appointments.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes en attente</CardTitle>
            <CardDescription>
              Acceptez ou refusez les demandes de rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune demande en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`border rounded-lg p-4 ${
                      selectedAppointment?.id === appointment.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">
                            {appointment.patient.firstName}{" "}
                            {appointment.patient.lastName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {appointment.patient.phoneNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(appointment.requestedDate)}</span>
                          <span className="text-gray-400">•</span>
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {timeSlotToText(appointment.requestedSlot)}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span className="text-gray-700">
                            {appointment.reason}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          onClick={() => setSelectedAppointment(appointment)}
                          size="sm"
                          variant={
                            selectedAppointment?.id === appointment.id
                              ? "default"
                              : "outline"
                          }
                          className="flex-1 lg:flex-none"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accepter
                        </Button>
                        <Button
                          onClick={() => handleReject(appointment.id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 lg:flex-none text-red-600 hover:text-red-700"
                          disabled={actionLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Refuser
                        </Button>
                      </div>
                    </div>

                    {/* Confirmation Form */}
                    {selectedAppointment?.id === appointment.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <h4 className="font-semibold text-sm">
                          Fixer la date et l'heure exactes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="confirmedDate">Date</Label>
                            <Input
                              id="confirmedDate"
                              type="date"
                              value={confirmedDate}
                              onChange={(e) => setConfirmedDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmedTime">Heure</Label>
                            <Input
                              id="confirmedTime"
                              type="time"
                              value={confirmedTime}
                              onChange={(e) => setConfirmedTime(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleAccept}
                          disabled={
                            !confirmedDate || !confirmedTime || actionLoading
                          }
                          className="w-full"
                        >
                          {actionLoading
                            ? "Confirmation..."
                            : "Confirmer le rendez-vous"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
