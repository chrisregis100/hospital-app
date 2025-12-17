'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  hospitals: {
    total: number;
    approved: number;
    pending: number;
  };
  users: {
    total: number;
    patients: number;
    doctors: number;
    secretaries: number;
  };
  appointments: {
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'hospital' | 'user';
  message: string;
  time: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Simuler des données (en attendant la vraie API)
      // TODO: Remplacer par de vraies requêtes API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        hospitals: {
          total: 12,
          approved: 10,
          pending: 2,
        },
        users: {
          total: 245,
          patients: 200,
          doctors: 30,
          secretaries: 15,
        },
        appointments: {
          total: 1250,
          today: 18,
          pending: 25,
          confirmed: 35,
          completed: 1150,
          cancelled: 40,
        },
      });

      setRecentActivities([
        {
          id: '1',
          type: 'appointment',
          message: 'Nouveau RDV à CNHU - Dr. Kouassi',
          time: 'Il y a 5 minutes',
        },
        {
          id: '2',
          type: 'hospital',
          message: 'Clinique des Anges demande validation',
          time: 'Il y a 15 minutes',
        },
        {
          id: '3',
          type: 'user',
          message: 'Nouveau médecin inscrit - Dr. Mensah',
          time: 'Il y a 1 heure',
        },
        {
          id: '4',
          type: 'appointment',
          message: 'RDV confirmé pour demain - Hôpital de Zone',
          time: 'Il y a 2 heures',
        },
      ]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de la plateforme Lokita
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Hôpitaux"
          value={stats.hospitals.total}
          icon={Building2}
          description={`${stats.hospitals.approved} approuvés, ${stats.hospitals.pending} en attente`}
          trend={{ value: '+2', isPositive: true }}
        />
        <StatsCard
          title="Utilisateurs"
          value={stats.users.total}
          icon={Users}
          description={`${stats.users.patients} patients, ${stats.users.doctors} médecins`}
          trend={{ value: '+15%', isPositive: true }}
        />
        <StatsCard
          title="RDV aujourd'hui"
          value={stats.appointments.today}
          icon={Calendar}
          description={`${stats.appointments.pending} en attente`}
          trend={{ value: '+3', isPositive: true }}
        />
        <StatsCard
          title="Total RDV"
          value={stats.appointments.total}
          icon={TrendingUp}
          description={`${stats.appointments.completed} terminés`}
          trend={{ value: '+8%', isPositive: true }}
        />
      </div>

      {/* Charts and Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#00A86B]" />
              État des rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">En attente</p>
                    <p className="text-sm text-gray-600">Nécessitent une confirmation</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.appointments.pending}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Confirmés</p>
                    <p className="text-sm text-gray-600">Prêts pour consultation</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.appointments.confirmed}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Terminés</p>
                    <p className="text-sm text-gray-600">Consultations effectuées</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.appointments.completed}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Annulés</p>
                    <p className="text-sm text-gray-600">RDV non honorés</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {stats.appointments.cancelled}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild className="w-full bg-[#00A86B] hover:bg-[#008f5d]">
                <Link href="/dashboard/admin/appointments">
                  Voir tous les rendez-vous
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#00A86B]" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${activity.type === 'appointment' ? 'bg-blue-500' : ''}
                    ${activity.type === 'hospital' ? 'bg-green-500' : ''}
                    ${activity.type === 'user' ? 'bg-purple-500' : ''}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 justify-start border-2 hover:border-[#00A86B] hover:bg-green-50"
            >
              <Link href="/dashboard/admin/hospitals">
                <Building2 className="h-5 w-5 mr-3 text-[#00A86B]" />
                <div className="text-left">
                  <p className="font-semibold">Gérer les hôpitaux</p>
                  <p className="text-xs text-gray-500">Ajouter, modifier, valider</p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto py-4 justify-start border-2 hover:border-[#00A86B] hover:bg-green-50"
            >
              <Link href="/dashboard/admin/users">
                <Users className="h-5 w-5 mr-3 text-[#00A86B]" />
                <div className="text-left">
                  <p className="font-semibold">Gérer les utilisateurs</p>
                  <p className="text-xs text-gray-500">Accès et permissions</p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto py-4 justify-start border-2 hover:border-[#00A86B] hover:bg-green-50"
            >
              <Link href="/dashboard/admin/stats">
                <TrendingUp className="h-5 w-5 mr-3 text-[#00A86B]" />
                <div className="text-left">
                  <p className="font-semibold">Statistiques avancées</p>
                  <p className="text-xs text-gray-500">Graphes et analyses</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
