"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Abstract Medical Cross / Heart Fusion */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 20 0 20 0C20 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
            fill={light ? "white" : "#00A86B"}
            fillOpacity={light ? "0.2" : "0.15"}
          />
          <path
            d="M20 8C22.2 8 24 9.8 24 12V16H28C30.2 16 32 17.8 32 20C32 22.2 30.2 24 28 24H24V28C24 30.2 22.2 32 20 32C17.8 32 16 30.2 16 28V24H12C9.8 24 8 22.2 8 20C8 17.8 9.8 16 12 16H16V12C16 9.8 17.8 8 20 8Z"
            fill={light ? "white" : "#00A86B"}
          />
          <path
            d="M20 12V28M12 20H28"
            stroke={light ? "#00A86B" : "white"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          "text-2xl font-bold tracking-tight",
          light ? "text-white" : "text-gray-900"
        )}
      >
        Lokita
        <span className={cn("text-primary-500", light && "text-primary-300")}>.</span>
      </span>
    </div>
  );
}
