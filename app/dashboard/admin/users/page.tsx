"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  Search,
  Shield,
  Stethoscope,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  role: string;
  isPhoneVerified: boolean;
  createdAt: string;
  hospital?: {
    name: string;
  };
}

export default function UsersManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      // TODO: Créer l'API endpoint
      // Simuler des données pour l'instant
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers([
        {
          id: "1",
          firstName: "Jean",
          lastName: "Kouassi",
          phoneNumber: "+22997123456",
          email: "jean.kouassi@example.com",
          role: "DOCTOR",
          isPhoneVerified: true,
          createdAt: new Date().toISOString(),
          hospital: { name: "CNHU" },
        },
        {
          id: "2",
          firstName: "Marie",
          lastName: "Mensah",
          phoneNumber: "+22997654321",
          role: "SECRETARY",
          isPhoneVerified: true,
          createdAt: new Date().toISOString(),
          hospital: { name: "Hôpital de Zone" },
        },
        {
          id: "3",
          firstName: "Pierre",
          lastName: "Agbodjan",
          phoneNumber: "+22997111222",
          role: "PATIENT",
          isPhoneVerified: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return Shield;
      case "DOCTOR":
        return Stethoscope;
      case "SECRETARY":
        return UserCog;
      default:
        return User;
    }
  };

  const getRoleName = (role: string) => {
    const names: Record<string, string> = {
      SUPER_ADMIN: "Super Admin",
      DOCTOR: "Médecin",
      SECRETARY: "Secrétaire",
      PATIENT: "Patient",
    };
    return names[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      DOCTOR: "bg-blue-100 text-blue-800 border-blue-200",
      SECRETARY: "bg-green-100 text-green-800 border-green-200",
      PATIENT: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm);

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "SUPER_ADMIN").length,
    doctors: users.filter((u) => u.role === "DOCTOR").length,
    secretaries: users.filter((u) => u.role === "SECRETARY").length,
    patients: users.filter((u) => u.role === "PATIENT").length,
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">
          {users.length} utilisateur{users.length > 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {userStats.total}
            </p>
            <p className="text-xs text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {userStats.admins}
            </p>
            <p className="text-xs text-gray-600">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {userStats.doctors}
            </p>
            <p className="text-xs text-gray-600">Médecins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCog className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {userStats.secretaries}
            </p>
            <p className="text-xs text-gray-600">Secrétaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {userStats.patients}
            </p>
            <p className="text-xs text-gray-600">Patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "SUPER_ADMIN", "DOCTOR", "SECRETARY", "PATIENT"].map(
                (role) => (
                  <Button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    className={
                      selectedRole === role
                        ? "bg-[#00A86B] hover:bg-[#008f5d]"
                        : ""
                    }
                  >
                    {role === "all" ? "Tous" : getRoleName(role)}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <Card
                  key={user.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-[#00A86B] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.isPhoneVerified && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phoneNumber}
                          </div>
                          {user.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          )}
                          {user.hospital && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">•</span>
                              {user.hospital.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div
                        className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${getRoleColor(
                          user.role
                        )}`}
                      >
                        <RoleIcon className="h-4 w-4" />
                        {getRoleName(user.role)}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                        {user.role !== "SUPER_ADMIN" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
