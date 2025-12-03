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
import { Building2, Check, LogOut, MapPin, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  phoneNumber?: string;
  email?: string;
  isApproved: boolean;
  approvedAt?: string;
  createdAt: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    specialties: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchHospitals();
  }, [router]);

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/hospitals", {
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
          description: "Vous devez être super-admin pour accéder à cette page",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les hôpitaux",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (hospitalId: string) => {
    setActionLoading(hospitalId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/hospitals/${hospitalId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'approbation");
      }

      toast({
        title: "Hôpital approuvé",
        description: "L'hôpital est maintenant visible par les patients",
      });

      await fetchHospitals();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'approuver l'hôpital",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (hospitalId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cet hôpital ?")) {
      return;
    }

    setActionLoading(hospitalId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/hospitals/${hospitalId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors du rejet");
      }

      toast({
        title: "Hôpital rejeté",
        description: "L'hôpital a été retiré de la liste",
      });

      await fetchHospitals();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de rejeter l'hôpital",
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

  const pendingHospitals = hospitals.filter((h) => !h.isApproved);
  const approvedHospitals = hospitals.filter((h) => h.isApproved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Super-Admin
              </h1>
              <p className="text-sm text-gray-600">Gestion des hôpitaux</p>
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
                {pendingHospitals.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approuvés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {approvedHospitals.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">
                {hospitals.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Hospitals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hôpitaux en attente d'approbation</CardTitle>
            <CardDescription>
              Validez ou rejetez les nouveaux hôpitaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingHospitals.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun hôpital en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="border rounded-lg p-4 border-yellow-200 bg-yellow-50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">
                          {hospital.name}
                        </h3>

                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700">{hospital.address}</p>
                            <p className="text-gray-500">{hospital.district}</p>
                          </div>
                        </div>

                        {hospital.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a
                              href={`tel:${hospital.phoneNumber}`}
                              className="text-primary-600 hover:underline"
                            >
                              {hospital.phoneNumber}
                            </a>
                          </div>
                        )}

                        {hospital.email && (
                          <div className="text-sm text-gray-600">
                            Email : {hospital.email}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Créé le{" "}
                          {new Date(hospital.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          onClick={() => handleApprove(hospital.id)}
                          size="sm"
                          className="flex-1 lg:flex-none"
                          disabled={actionLoading === hospital.id}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          onClick={() => handleReject(hospital.id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 lg:flex-none text-red-600 hover:text-red-700"
                          disabled={actionLoading === hospital.id}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Hospitals */}
        <Card>
          <CardHeader>
            <CardTitle>Hôpitaux approuvés</CardTitle>
            <CardDescription>
              Liste des hôpitaux visibles par les patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedHospitals.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun hôpital approuvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="border rounded-lg p-4 border-green-200 bg-green-50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">
                          {hospital.name}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Approuvé
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{hospital.address}</p>
                          <p className="text-gray-500">{hospital.district}</p>
                        </div>
                      </div>

                      {hospital.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {hospital.phoneNumber}
                          </span>
                        </div>
                      )}

                      {hospital.approvedAt && (
                        <div className="text-xs text-gray-500">
                          Approuvé le{" "}
                          {new Date(hospital.approvedAt).toLocaleDateString(
                            "fr-FR"
                          )}
                          {hospital.approvedBy &&
                            ` par ${hospital.approvedBy.firstName} ${hospital.approvedBy.lastName}`}
                        </div>
                      )}
                    </div>
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
