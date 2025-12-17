"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  Calendar,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export function Sidebar({
  userRole = "SUPER_ADMIN",
  userName = "Admin",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Vue d'ensemble",
      href: "/dashboard/admin",
      active: pathname === "/dashboard/admin",
    },
    {
      icon: Building2,
      label: "Hôpitaux",
      href: "/dashboard/admin/hospitals",
      active: pathname === "/dashboard/admin/hospitals",
    },
    {
      icon: Users,
      label: "Utilisateurs",
      href: "/dashboard/admin/users",
      active: pathname === "/dashboard/admin/users",
    },
    {
      icon: Calendar,
      label: "Rendez-vous",
      href: "/dashboard/admin/appointments",
      active: pathname === "/dashboard/admin/appointments",
    },
    {
      icon: BarChart3,
      label: "Statistiques",
      href: "/dashboard/admin/stats",
      active: pathname === "/dashboard/admin/stats",
    },
    {
      icon: Shield,
      label: "Permissions",
      href: "/dashboard/admin/permissions",
      active: pathname === "/dashboard/admin/permissions",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#00A86B]" fill="#00A86B" />
              <div>
                <span className="text-xl font-bold text-gray-900">Lokita</span>
                <p className="text-xs text-gray-500">Administration</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00A86B] flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-600">
                  {userRole === "SUPER_ADMIN" ? "Super Admin" : userRole}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      item.active
                        ? "bg-[#00A86B] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
