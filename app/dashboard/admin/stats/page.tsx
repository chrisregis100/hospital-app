"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Clock, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Statistiques Avancées
        </h1>
        <p className="text-gray-600">
          Analyse détaillée des performances de la plateforme
        </p>
      </div>

      {/* Monthly Appointments Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#00A86B]" />
            Rendez-vous par mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Graphique des rendez-vous mensuels</p>
              <p className="text-sm">
                (À implémenter avec recharts ou chart.js)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Hospitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00A86B]" />
              Hôpitaux les plus demandés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "CNHU",
                "Hôpital de Zone",
                "Clinique des Anges",
                "Polyclinique",
              ].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700">{name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00A86B]"
                        style={{ width: `${100 - i * 20}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {120 - i * 30}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#00A86B]" />
              Heures de pointe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "08h - 10h", count: 85 },
                { time: "10h - 12h", count: 120 },
                { time: "14h - 16h", count: 95 },
                { time: "16h - 18h", count: 70 },
              ].map((slot, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700">{slot.time}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(slot.count / 120) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {slot.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#00A86B]" />
            Croissance des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Graphique de croissance des utilisateurs</p>
              <p className="text-sm">(Courbe d'évolution mensuelle)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
