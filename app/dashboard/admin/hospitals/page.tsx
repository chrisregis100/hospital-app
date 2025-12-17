"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  CheckCircle2,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phoneNumber?: string;
  email?: string;
  isApproved: boolean;
  createdAt: string;
  _count?: {
    specialties: number;
  };
}

export default function HospitalsManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    city: "Cotonou",
    phoneNumber: "",
    email: "",
    openingHours: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erreur de chargement");

      const data = await response.json();
      setHospitals(data);
    } catch (error) {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erreur d'approbation");

      toast({
        title: "Succès",
        description: "Hôpital approuvé avec succès",
      });
      fetchHospitals();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'hôpital",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (hospitalId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cet hôpital ?")) return;

    setActionLoading(hospitalId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/hospitals/${hospitalId}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erreur de rejet");

      toast({
        title: "Succès",
        description: "Hôpital rejeté",
      });
      fetchHospitals();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'hôpital",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (hospitalId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cet hôpital ? Cette action est irréversible."
      )
    )
      return;

    setActionLoading(hospitalId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/hospitals/${hospitalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erreur de suppression");

      toast({
        title: "Succès",
        description: "Hôpital supprimé",
      });
      fetchHospitals();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'hôpital",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const url = editingHospital
        ? `/api/admin/hospitals/${editingHospital.id}`
        : "/api/admin/hospitals";

      const response = await fetch(url, {
        method: editingHospital ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur de sauvegarde");

      toast({
        title: "Succès",
        description: editingHospital ? "Hôpital modifié" : "Hôpital créé",
      });

      setShowAddModal(false);
      setEditingHospital(null);
      setFormData({
        name: "",
        address: "",
        district: "",
        city: "Cotonou",
        phoneNumber: "",
        email: "",
        openingHours: "",
      });
      fetchHospitals();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'hôpital",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address,
      district: hospital.district,
      city: hospital.city,
      phoneNumber: hospital.phoneNumber || "",
      email: hospital.email || "",
      openingHours: "",
    });
    setShowAddModal(true);
  };

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingHospitals = filteredHospitals.filter((h) => !h.isApproved);
  const approvedHospitals = filteredHospitals.filter((h) => h.isApproved);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Hôpitaux
          </h1>
          <p className="text-gray-600">
            {hospitals.length} hôpital{hospitals.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingHospital(null);
            setFormData({
              name: "",
              address: "",
              district: "",
              city: "Cotonou",
              phoneNumber: "",
              email: "",
              openingHours: "",
            });
            setShowAddModal(true);
          }}
          className="bg-[#00A86B] hover:bg-[#008f5d]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un hôpital
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un hôpital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pending Approvals */}
      {pendingHospitals.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              Hôpitaux en attente d'approbation ({pendingHospitals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingHospitals.map((hospital) => (
                <Card key={hospital.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {hospital.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {hospital.address}, {hospital.district}
                          </div>
                          {hospital.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {hospital.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(hospital.id)}
                          disabled={actionLoading === hospital.id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          onClick={() => handleReject(hospital.id)}
                          disabled={actionLoading === hospital.id}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Hospitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#00A86B]" />
            Hôpitaux approuvés ({approvedHospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {approvedHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 flex-1">
                      {hospital.name}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {hospital.address}, {hospital.district}
                      </span>
                    </div>
                    {hospital.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {hospital.phoneNumber}
                      </div>
                    )}
                    {hospital.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {hospital.email}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditModal(hospital)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDelete(hospital.id)}
                      disabled={actionLoading === hospital.id}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {approvedHospitals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun hôpital approuvé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingHospital ? "Modifier l'hôpital" : "Ajouter un hôpital"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l'hôpital *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">Quartier *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hours">Horaires d'ouverture</Label>
                  <Textarea
                    id="hours"
                    value={formData.openingHours}
                    onChange={(e) =>
                      setFormData({ ...formData, openingHours: e.target.value })
                    }
                    placeholder="Lundi - Vendredi: 08h - 18h&#10;Samedi: 08h - 13h"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingHospital(null);
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#00A86B] hover:bg-[#008f5d]"
                  >
                    {editingHospital ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
