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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
  iconName: string | null;
  availableDoctors: number;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phoneNumber: string;
  email: string | null;
  specialties: Specialty[];
}

export default function HospitalsPage() {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

  useEffect(() => {
    fetchHospitals();
    fetchSpecialties();
  }, [selectedDistrict, selectedSpecialty]);

  const fetchHospitals = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDistrict !== "all")
        params.append("district", selectedDistrict);
      if (selectedSpecialty !== "all")
        params.append("specialtyId", selectedSpecialty);

      const response = await fetch(`/api/hospitals?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setHospitals(data.hospitals);
      }
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

  const fetchSpecialties = async () => {
    try {
      const response = await fetch("/api/specialties");
      const data = await response.json();

      if (data.success) {
        setAllSpecialties(data.specialties);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des spécialités:", error);
    }
  };

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const districts = [
    "Centre-ville",
    "Cadjehoun",
    "Marina",
    "Godomey",
    "Akpakpa",
    "Fidjrossè",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-500" fill="#00A86B" />
              <span className="text-2xl font-bold text-gray-900">Lokita</span>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Mon compte</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Trouvez votre hôpital
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Découvrez les hôpitaux partenaires à Cotonou et Abomey-Calavi
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un hôpital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* District Filter */}
            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quartier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les quartiers</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Specialty Filter */}
            <Select
              value={selectedSpecialty}
              onValueChange={setSelectedSpecialty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les spécialités</SelectItem>
                {allSpecialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Chargement des hôpitaux...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun hôpital trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {filteredHospitals.length}
                  </span>{" "}
                  hôpital{filteredHospitals.length > 1 ? "s" : ""} trouvé
                  {filteredHospitals.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hospital) => (
                  <Card
                    key={hospital.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        <span className="line-clamp-2">{hospital.name}</span>
                        <Building2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      </CardTitle>
                      <CardDescription className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {hospital.address}, {hospital.district}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{hospital.phoneNumber}</span>
                      </div>

                      {/* Specialties */}
                      {hospital.specialties.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Spécialités disponibles :
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {hospital.specialties
                              .slice(0, 3)
                              .map((specialty) => (
                                <span
                                  key={specialty.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                                >
                                  {specialty.name}
                                </span>
                              ))}
                            {hospital.specialties.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                +{hospital.specialties.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <Link
                        href={`/appointments/new?hospitalId=${
                          hospital.id
                        }&hospitalName=${encodeURIComponent(hospital.name)}`}
                        className="block"
                      >
                        <Button className="w-full group">
                          Prendre rendez-vous
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm">&copy; 2025 Lokita. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
