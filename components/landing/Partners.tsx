"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export function Partners() {
  const partners = [
    "CNHU Cotonou",
    "Clinique Boni",
    "Hôpital de Zone Calavi",
    "Clinique Mahouna",
    "Polyclinique Saint-Jean",
  ];

  return (
    <section className="py-10 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">
          ILS NOUS FONT CONFIANCE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 font-bold text-xl text-gray-400 hover:text-primary-600 transition-colors cursor-default"
            >
              <Building2 className="w-6 h-6" />
              <span>{partner}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
