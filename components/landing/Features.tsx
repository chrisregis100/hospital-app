"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, Clock, MapPin, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Réservation en ligne",
    description: "Choisissez votre date et votre créneau horaire préférés en quelques clics.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Bell,
    title: "Rappels automatiques",
    description: "Recevez des SMS la veille et 2h avant votre rendez-vous pour ne rien oublier.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: MapPin,
    title: "Géolocalisation",
    description: "Trouvez facilement les hôpitaux et cliniques les plus proches de chez vous.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Fini les files d'attente interminables. Arrivez à l'heure de votre rendez-vous.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos informations médicales sont chiffrées et protégées selon les normes.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Smartphone,
    title: "Mode hors-ligne",
    description: "Accédez à vos rendez-vous même sans connexion internet active.",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Tout pour simplifier votre santé
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Une suite d'outils conçus pour rendre l'expérience médicale plus humaine et efficace.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
