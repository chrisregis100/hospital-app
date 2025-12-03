"use client";

import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/patterns/circuit-board.svg')] bg-repeat" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo light />
            <p className="text-slate-400 leading-relaxed max-w-sm">
              La plateforme de santé numérique de référence au Bénin. 
              Nous connectons les patients aux meilleurs professionnels de santé 
              pour une prise en charge rapide et efficace.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-6">Plateforme</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/hospitals" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                    Trouver un hôpital
                  </Link>
                </li>
                <li>
                  <Link href="/specialties" className="hover:text-primary-400 transition-colors">
                    Spécialités
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="hover:text-primary-400 transition-colors">
                    Médecins
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacies" className="hover:text-primary-400 transition-colors">
                    Pharmacies de garde
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Entreprise</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/about" className="hover:text-primary-400 transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary-400 transition-colors">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary-400 transition-colors">
                    Blog Santé
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Newsletter</h3>
              <p className="text-xs text-slate-500 mb-4">
                Recevez nos conseils santé et actualités.
              </p>
              <div className="space-y-3">
                <Input 
                  placeholder="Votre email" 
                  className="bg-slate-900 border-slate-800 focus:border-primary-500 text-white placeholder:text-slate-600"
                />
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; 2025 Lokita Santé. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition-colors">CGU</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function CTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-primary-900 shadow-2xl shadow-primary-900/30">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="relative z-10 px-6 py-16 md:py-20 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Prêt à prendre votre santé en main ?
              </h2>
              <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                Rejoignez la communauté Lokita dès aujourd'hui. Accédez à un réseau de soins complet et gérez vos rendez-vous en toute simplicité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-primary-900 hover:bg-primary-50 text-lg h-14 px-8 rounded-xl font-bold shadow-lg transition-transform hover:scale-105">
                  <Link href="/auth/register">
                    Créer mon compte gratuit
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 text-lg h-14 px-8 rounded-xl font-semibold backdrop-blur-sm">
                  <Link href="/hospitals">
                    Découvrir les hôpitaux
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative hidden md:block">
              <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl rotate-6 flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-center text-white p-6">
                  <div className="text-5xl font-bold mb-2">24/7</div>
                  <div className="text-primary-100 font-medium">Disponibilité</div>
                  <div className="mt-4 w-12 h-1 bg-white/30 mx-auto rounded-full" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-white/5 rounded-3xl -rotate-3 border border-white/10 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
