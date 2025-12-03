# 🏥 Lokita v1 - MVP Bénin (Cotonou & Abomey-Calavi)

## 🎯 Description

Lokita est une application web progressive (PWA) de prise de rendez-vous médicaux au Bénin. Elle permet aux patients de réserver facilement des consultations dans les hôpitaux de Cotonou et Abomey-Calavi, tout en offrant aux professionnels de santé des outils de gestion efficaces.

## ✨ Fonctionnalités principales

### Pour les patients

- ✅ Authentification OTP par SMS (Celtiis API)
- 🏥 Recherche d'hôpitaux par spécialité et quartier
- 📅 Prise de rendez-vous en ligne avec choix de date et créneau horaire
- 🔔 Notifications SMS et Web Push automatiques (demande, confirmation, rappels J-1 et H-2)
- 📱 Application installable (PWA)
- 💾 Mode hors-ligne pour consulter l'historique des RDV
- 📊 Historique complet des rendez-vous

### Pour les secrétaires

- 📋 Dashboard de gestion des demandes de RDV
- ✅ Acceptation/refus avec choix de la date et heure exacte
- 🔔 Notifications automatiques aux patients

### Pour les médecins

- 🗓️ Vue des rendez-vous du jour
- ✔️ Boutons "Patient arrivé" / "Terminé"
- 📊 Suivi en temps réel

### Pour les super-admins

- 🏢 Validation manuelle des hôpitaux avant publication
- 📊 Journaux d'audit
- 👥 Gestion des utilisateurs

## 🛠️ Stack technique

### Frontend

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **PWA** (manifest.json + Service Worker)
- **IndexedDB** (mode hors-ligne via idb)
- **Firebase** (Web Push Notifications)

### Backend & Base de données

- **Prisma ORM**
- **PostgreSQL**
- **JWT RS256** (authentification sécurisée)
- **Celtiis SMS API** (OTP et notifications)

### Sécurité

- Chiffrement des données sensibles (AES-GCM)
- Journaux d'audit complets
- Consentement RGPD explicite
- Protection contre les attaques courantes

### Hébergement

- Frontend : **Vercel**
- Backend/DB : **Render** ou **Supabase**

## 📦 Installation

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- Compte Celtiis API (pour les SMS)
- Compte Firebase (pour les notifications push)

### Étapes

1. **Cloner le projet**

```bash
git clone https://github.com/votre-org/lokita-app.git
cd lokita-app
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Éditez le fichier `.env` et remplissez toutes les variables :

- `DATABASE_URL` : URL de votre base PostgreSQL
- `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` : Clés RS256 (voir génération ci-dessous)
- `CELTIIS_API_KEY` : Votre clé API Celtiis
- Clés Firebase pour les notifications push

**Générer les clés JWT RS256 :**

```bash
# Générer la clé privée
openssl genrsa -out private.pem 2048

# Générer la clé publique
openssl rsa -in private.pem -pubout -out public.pem

# Copier le contenu dans .env (remplacer les sauts de ligne par \n)
```

4. **Initialiser la base de données**

```bash
npx prisma db push
npx prisma generate
```

5. **Peupler la base avec les données de test**

```bash
npm run db:seed
```

Cela créera :

- 6 hôpitaux à Cotonou et Abomey-Calavi
- 8 spécialités médicales
- 5 utilisateurs de test (patient, secrétaire, médecin, admin)
- 2 rendez-vous de démonstration

6. **Lancer en développement**

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🧪 Comptes de test

Après le seeding, utilisez ces numéros pour vous connecter :

| Rôle        | Numéro de téléphone | Description       |
| ----------- | ------------------- | ----------------- |
| Patient     | +22961234567        | Jean Kossou       |
| Secrétaire  | +22963456789        | Claudine Dossou   |
| Médecin     | +22964567890        | Dr. Paul Azonhiho |
| Super Admin | +22965678901        | Admin Lokita      |

**Note** : En développement, les OTP ne sont pas réellement envoyés. Vérifiez les logs de la console.

## 🚀 Déploiement

### Vercel (Frontend)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel
3. Déployez automatiquement à chaque push sur `main`

```bash
vercel --prod
```

### Render ou Supabase (Base de données)

**Option 1 : Render**

1. Créez une nouvelle base PostgreSQL sur Render
2. Copiez l'URL de connexion dans `DATABASE_URL`
3. Exécutez `npx prisma db push` en local ou via un job

**Option 2 : Supabase**

1. Créez un nouveau projet Supabase
2. Utilisez l'URL PostgreSQL fournie
3. Activez la protection RLS si nécessaire

## 📁 Structure du projet

```
hospital-app/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Layout principal
│   ├── auth/                # Pages d'authentification
│   ├── hospitals/           # Liste et détails des hôpitaux
│   ├── appointments/        # Gestion des RDV
│   ├── dashboard/           # Dashboards (secrétaire, médecin, admin)
│   └── api/                 # API Routes
├── components/              # Composants React réutilisables
│   └── ui/                  # Composants shadcn/ui
├── features/                # Modules métier
│   ├── auth/                # Authentification OTP
│   ├── hospitals/           # Gestion hôpitaux
│   ├── appointments/        # Gestion RDV
│   └── notifications/       # Système de notifications
├── lib/                     # Utilitaires et services
│   ├── prisma.ts           # Client Prisma
│   ├── auth.ts             # JWT RS256
│   ├── encryption.ts       # Chiffrement AES-GCM
│   ├── sms.ts              # Celtiis API
│   ├── push-notifications.ts # Firebase
│   ├── offline-storage.ts  # IndexedDB
│   └── utils.ts            # Helpers généraux
├── prisma/
│   ├── schema.prisma       # Schéma de la base de données
│   └── seed.ts             # Script de peuplement
├── public/
│   ├── manifest.json       # Manifest PWA
│   ├── sw-custom.js        # Service Worker
│   └── icons/              # Icônes PWA
└── package.json
```

## 🔐 Sécurité

- **Authentification** : JWT RS256 avec clés asymétriques
- **OTP** : Codes à 6 chiffres, expiration 3 minutes, max 3 tentatives
- **Données sensibles** : Chiffrement AES-GCM 256 bits
- **HTTPS** : Obligatoire en production
- **Audit logs** : Traçabilité complète des actions
- **RGPD** : Consentement explicite requis

## 📱 PWA et mode hors-ligne

L'application est une PWA complète :

- **Installable** sur mobile et desktop
- **Mode hors-ligne** pour consulter l'historique des RDV
- **Icônes** optimisées (72x72 à 512x512)
- **Service Worker** avec stratégies de cache intelligentes
- **Notifications push** en arrière-plan

## 🌍 Optimisations mobile

- **Mobile-first** : Interface optimisée pour Android bas de gamme
- **Temps de chargement** : < 3s même en 3G
- **Bundle size** : Minifié et optimisé
- **Images** : Lazy loading + formats modernes (WebP, AVIF)
- **Fonts** : Subset optimisé

## 📊 Schéma de base de données

9 tables principales :

- `users` : Utilisateurs (patients, médecins, secrétaires, admins)
- `hospitals` : Hôpitaux validés
- `specialties` : Spécialités médicales
- `hospital_specialties` : Liaison hôpital-spécialité
- `appointments` : Rendez-vous
- `otp_codes` : Codes OTP pour authentification
- `notifications` : Historique des notifications
- `audit_logs` : Journaux d'audit
- `consents` : Consentements RGPD

## 🎯 Roadmap v1.0 (avant le 31 janvier 2026)

- [x] Configuration projet et stack technique
- [x] Schéma Prisma et seed
- [x] Landing page professionnelle
- [ ] Authentification OTP complète
- [ ] Liste et recherche d'hôpitaux
- [ ] Formulaire de prise de RDV
- [ ] Dashboard secrétaire
- [ ] Dashboard médecin
- [ ] Système de notifications (SMS + Push)
- [ ] Mode hors-ligne et PWA
- [ ] Dashboard super-admin
- [ ] Tests et optimisations
- [ ] Déploiement production

## 📧 Contact

- Email : contact@lokita.bj
- Site web : https://lokita.app
- Support : support@lokita.bj

---

**Made with ❤️ in Bénin 🇧🇯**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
