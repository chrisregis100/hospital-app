"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  specialties?: string[];
}

export function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("/api/hospitals?limit=6");
        const data = await response.json();
        setHospitals(data.hospitals || []);
      } catch (error) {
        console.error("Erreur lors du chargement des hôpitaux:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Hôpitaux Partenaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos établissements de santé et prenez rendez-vous en
              quelques clics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Hôpitaux Partenaires
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos établissements de santé et prenez rendez-vous en
            quelques clics
          </p>
        </div>

        {/* Hospital Grid */}
        {hospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {hospitals.slice(0, 6).map((hospital, index) => (
              <Card
                key={hospital.id}
                className={`group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary-500 overflow-hidden cursor-pointer ${
                  index % 3 === 0 ? "mt-0" : index % 3 === 1 ? "mt-8" : "mt-4"
                }`}
              >
                <Link
                  href={`/appointments/new?hospitalId=${
                    hospital.id
                  }&hospitalName=${encodeURIComponent(hospital.name)}`}
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-primary-600/5 group-hover:bg-primary-600/10 transition-colors" />
                    <Building2 className="h-20 w-20 text-primary-600/40 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {hospital.name}
                    </h3>

                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary-600" />
                      <p className="text-sm line-clamp-2">
                        {hospital.district}, {hospital.city}
                      </p>
                    </div>

                    {hospital.specialties &&
                      hospital.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hospital.specialties
                            .slice(0, 3)
                            .map((specialty, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          {hospital.specialties.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              +{hospital.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                    <Button
                      className="w-full bg-primary-600 hover:bg-primary-700 group-hover:shadow-lg transition-all"
                      asChild
                    >
                      <span>
                        Prendre RDV
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Aucun hôpital disponible pour le moment
            </p>
          </div>
        )}

        {/* See More Button */}
        {hospitals.length > 0 && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all text-lg px-8"
              asChild
            >
              <Link href="/hospitals">
                Voir tous les hôpitaux
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
