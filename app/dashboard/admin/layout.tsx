"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Récupérer les infos de l'utilisateur
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(
            `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Admin"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des infos utilisateur:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A86B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={userName} />
      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
