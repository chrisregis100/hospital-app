"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { MapPin, Search, Stethoscope } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.15] tracking-tight">
              Votre santé mérite <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                la meilleure attention
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Lokita simplifie l'accès aux soins au Bénin. Trouvez le bon spécialiste,
              prenez rendez-vous en 2 minutes et évitez les files d'attente.
            </p>

            {/* Search Module */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-3 rounded-2xl shadow-xl shadow-primary-900/5 border border-gray-100 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Spécialité (ex: Cardiologue)"
                    className="pl-10 h-12 border-transparent bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="pl-10 h-12 border-transparent bg-gray-50 focus:bg-white transition-colors text-gray-500">
                      <SelectValue placeholder="Quartier / Ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cotonou">Cotonou</SelectItem>
                      <SelectItem value="calavi">Abomey-Calavi</SelectItem>
                      <SelectItem value="godomey">Godomey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-12 px-8 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/20 transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </motion.div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <span>+2000 patients satisfaits</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10 border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <Image
                src="/images/hero-doctor.png"
                alt="Médecin souriant"
                width={600}
                height={700}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 right-6 z-20 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Consultations simplifiées</p>
                    <p className="text-sm text-gray-600">Plus de 20 spécialités disponibles</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
