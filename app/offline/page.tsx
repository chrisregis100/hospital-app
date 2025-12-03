import { Button } from "@/components/ui/button";
import { Home, WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <WifiOff className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Vous êtes hors-ligne
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Il semble que vous n'ayez pas de connexion Internet. Certaines
          fonctionnalités peuvent être limitées.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Vous pouvez toujours consulter :
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Votre historique de rendez-vous</li>
            <li>✓ Les informations des hôpitaux en cache</li>
          </ul>
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
