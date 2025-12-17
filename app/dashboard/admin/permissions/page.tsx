"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Lock, Shield } from "lucide-react";

export default function PermissionsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Permissions
        </h1>
        <p className="text-gray-600">
          Contrôle des accès et des droits utilisateurs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Super Admin</h3>
            <p className="text-sm text-gray-600">
              Accès complet à toutes les fonctionnalités
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Médecin</h3>
            <p className="text-sm text-gray-600">
              Gestion des rendez-vous de son hôpital
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Key className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Secrétaire</h3>
            <p className="text-sm text-gray-600">
              Confirmation et gestion administrative
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matrice des permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Page en construction - Configuration détaillée des permissions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
