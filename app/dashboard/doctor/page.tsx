"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDateFr } from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  LogOut,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  confirmedDate: string;
  reason: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      const response = await fetch("/api/doctor/appointments/today", {
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
          description: "Vous devez être médecin pour accéder à cette page",
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

  const handleMarkArrived = async (appointmentId: string) => {
    setActionLoading(appointmentId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/doctor/appointments/${appointmentId}/arrived`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Patient arrivé",
        description: "Le statut a été mis à jour",
      });

      await fetchAppointments();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkCompleted = async (appointmentId: string) => {
    setActionLoading(appointmentId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/doctor/appointments/${appointmentId}/completed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Consultation terminée",
        description: "Le rendez-vous a été marqué comme terminé",
      });

      await fetchAppointments();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
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

  const confirmedAppointments = appointments.filter(
    (a) => a.status === "CONFIRMED"
  );
  const arrivedAppointments = appointments.filter(
    (a) => a.status === "ARRIVED"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "COMPLETED"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Médecin
              </h1>
              <p className="text-sm text-gray-600">
                Rendez-vous du {formatDateFr(new Date(), "long")}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total aujourd&apos;hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">
                {appointments.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                À venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {confirmedAppointments.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Patients présents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {arrivedAppointments.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Terminés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {completedAppointments.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
            <CardDescription>
              Gérez vos consultations de la journée
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucun rendez-vous aujourd&apos;hui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const confirmedDate = new Date(appointment.confirmedDate);
                  const isArrived = appointment.status === "ARRIVED";
                  const isCompleted = appointment.status === "COMPLETED";

                  return (
                    <div
                      key={appointment.id}
                      className={`border rounded-lg p-4 ${
                        isCompleted
                          ? "border-green-200 bg-green-50"
                          : isArrived
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-lg">
                              {formatDateFr(confirmedDate, "time")}
                            </span>
                            {isCompleted && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Terminé
                              </span>
                            )}
                            {isArrived && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Patient présent
                              </span>
                            )}
                          </div>

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

                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                            <span className="text-sm text-gray-700">
                              {appointment.reason}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {!isCompleted && (
                          <div className="flex lg:flex-col gap-2">
                            {!isArrived && (
                              <Button
                                onClick={() =>
                                  handleMarkArrived(appointment.id)
                                }
                                size="sm"
                                variant="outline"
                                className="flex-1 lg:flex-none"
                                disabled={actionLoading === appointment.id}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Patient arrivé
                              </Button>
                            )}
                            {isArrived && (
                              <Button
                                onClick={() =>
                                  handleMarkCompleted(appointment.id)
                                }
                                size="sm"
                                className="flex-1 lg:flex-none"
                                disabled={actionLoading === appointment.id}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Terminé
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
