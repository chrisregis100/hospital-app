"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Search, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Créez votre compte",
    description: "Inscrivez-vous simplement avec votre numéro de téléphone. Sécurisé et rapide.",
  },
  {
    icon: Search,
    title: "Trouvez votre médecin",
    description: "Recherchez par spécialité ou par hôpital. Consultez les disponibilités en temps réel.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmez le RDV",
    description: "Validez votre créneau. Vous recevrez instantanément une confirmation par SMS.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600">
            Prendre soin de vous n'a jamais été aussi simple
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100">
            <div className="absolute top-0 left-0 h-full bg-primary-100 w-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative inline-flex mb-8">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-primary-50 flex items-center justify-center shadow-sm group-hover:border-primary-100 transition-colors z-10">
                    <step.icon className="w-10 h-10 text-primary-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
