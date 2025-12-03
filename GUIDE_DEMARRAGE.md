# 🏥 Lokita v1 - MVP Complet

**Application de prise de rendez-vous médicaux pour le Bénin (Cotonou & Abomey-Calavi)**

## ✅ Fonctionnalités Implémentées

### 🔐 Authentification

- ✅ Login par OTP SMS (Celtiis API)
- ✅ Code à 6 chiffres, expiration 3 minutes
- ✅ JWT RS256 avec clés asymétriques
- ✅ Validation numéro béninois (+229XXXXXXXX)

### 🏥 Pour les Patients

- ✅ **Page d'accueil** : Présentation professionnelle de Lokita
- ✅ **Recherche d'hôpitaux** : Filtres par spécialité, quartier, nom
- ✅ **Prise de RDV** : Formulaire avec date souhaitée, tranche horaire (5 créneaux : 8-10h, 10-12h, 14-16h, 16-18h, 18-20h), motif
- ✅ **Page de confirmation** : Récapitulatif du RDV avec statut et prochaines étapes
- ✅ **Notifications SMS** :
  - Demande de RDV reçue
  - RDV confirmé avec date/heure exacte
  - Rappel J-1 à 18h (à implémenter via cron)
  - Rappel H-2h (à implémenter via cron)

### 👨‍⚕️ Dashboard Secrétaire

- ✅ Liste des demandes de RDV en attente
- ✅ Accepter : Fixer date et heure exactes
- ✅ Refuser : Annuler avec notification SMS
- ✅ Statistiques : En attente / Confirmés / Total
- ✅ Audit complet des actions

### 🩺 Dashboard Médecin

- ✅ Vue des RDV du jour uniquement
- ✅ Bouton "Patient arrivé" (CONFIRMED → ARRIVED)
- ✅ Bouton "Terminé" (ARRIVED → COMPLETED)
- ✅ Statistiques : Total / À venir / Présents / Terminés

### 🔧 Dashboard Super-Admin

- ✅ Liste des hôpitaux en attente d'approbation
- ✅ Approuver : Rendre l'hôpital visible aux patients
- ✅ Rejeter : Supprimer l'hôpital (avec vérification RDV actifs)
- ✅ Statistiques : En attente / Approuvés / Total
- ✅ Traçabilité : Qui a approuvé, quand

### 📱 PWA (Progressive Web App)

- ✅ Manifest.json avec icônes 72x72 à 512x512
- ✅ Service worker personnalisé avec stratégies de cache
- ✅ Offline-ready avec IndexedDB
- ✅ Installable sur Android/iOS

### 🛡️ Sécurité & Conformité

- ✅ Chiffrement AES-GCM pour données sensibles
- ✅ Audit logs de toutes les actions critiques
- ✅ Suivi du consentement RGPD
- ✅ Limitation tentatives OTP (max 3)

## 🗂️ Base de Données (Prisma + PostgreSQL)

### 9 Tables Principales

1. **User** : Patients, secrétaires, médecins, super-admin
2. **Hospital** : Hôpitaux avec validation manuelle
3. **Specialty** : Spécialités médicales
4. **HospitalSpecialty** : Liaison hôpital-spécialité
5. **Appointment** : Rendez-vous avec workflow de statut
6. **OtpCode** : Codes OTP avec expiration
7. **Notification** : Historique des notifications SMS/Push
8. **AuditLog** : Traçabilité des actions
9. **Consent** : Consentements RGPD

## 📁 Structure du Projet

```
hospital-app/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── auth/login/page.tsx               # Login OTP
│   ├── hospitals/page.tsx                # Liste hôpitaux
│   ├── appointments/
│   │   ├── new/page.tsx                  # Formulaire de prise de RDV
│   │   └── [id]/confirmation/page.tsx    # Confirmation RDV
│   ├── dashboard/
│   │   ├── secretary/page.tsx            # Dashboard secrétaire
│   │   ├── doctor/page.tsx               # Dashboard médecin
│   │   └── admin/page.tsx                # Dashboard super-admin
│   └── api/
│       ├── auth/                         # OTP send/verify
│       ├── appointments/                 # CRUD RDV
│       ├── hospitals/                    # Liste hôpitaux
│       ├── specialties/                  # Liste spécialités
│       ├── secretary/                    # Confirm/Reject RDV
│       ├── doctor/                       # Arrivé/Terminé RDV
│       └── admin/                        # Approve/Reject hôpitaux
├── prisma/
│   ├── schema.prisma                     # Schéma DB complet
│   └── seed.ts                           # 6 hôpitaux + 8 spécialités
├── lib/
│   ├── auth.ts                           # JWT RS256
│   ├── sms.ts                            # Celtiis API
│   ├── encryption.ts                     # AES-GCM
│   ├── offline-storage.ts                # IndexedDB
│   ├── push-notifications.ts             # Firebase FCM
│   └── utils.ts                          # Helpers
└── public/
    ├── manifest.json                     # PWA manifest
    └── sw-custom.js                      # Service worker
```

## 🚀 Démarrage Rapide

### 1. Configuration Environnement

Créez `.env` avec vos clés :

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lokita"

# JWT (Générez avec: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem)
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nVOTRE_CLE\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nVOTRE_CLE\n-----END PUBLIC KEY-----"

# Celtiis SMS API
CELTIIS_API_KEY="votre_api_key"
CELTIIS_API_URL="https://api.celtiis.com/v1"
CELTIIS_SENDER_NAME="Lokita"

# Firebase (pour web push)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_VAPID_KEY="..."

# Encryption
ENCRYPTION_KEY="votre_cle_32_caracteres_minimum"

# Config
MAX_PENDING_APPOINTMENTS_PER_USER="3"
NODE_ENV="development"
```

### 2. Initialisation Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables (sans migration, en dev)
npx prisma db push

# Insérer les données de test (6 hôpitaux, 8 spécialités, 5 utilisateurs)
npx prisma db seed
```

### 3. Lancement Application

```bash
# Développement
npm run dev
# Accessible sur http://localhost:3000 (ou 3001 si port occupé)

# Production
npm run build
npm start
```

### 4. Comptes de Test (après seed)

**Super-Admin :**

- Téléphone : +22990000001
- OTP : Génération en temps réel

**Secrétaire (CNHU) :**

- Téléphone : +22990000002

**Médecin (CNHU) :**

- Téléphone : +22990000003

**Patients :**

- +22990000004
- +22990000005

## 📌 Points d'Attention

### ⚠️ Avant Mise en Production

1. **Générer les icônes PNG** :

   ```bash
   # Voir /public/icons/GENERATE_ICONS.md
   # Convertir icon-512x512.svg en PNG de toutes tailles
   ```

2. **Corriger erreurs TypeScript** :

   - `prisma generate` doit être relancé après modification du schéma
   - Les champs `confirmedBy`, `completedBy`, `cancelledBy` et `approvedByUser` nécessitent une régénération du client Prisma

3. **Générer les clés JWT RS256** :

   ```bash
   openssl genrsa -out private.pem 2048
   openssl rsa -in private.pem -pubout -out public.pem
   # Copier le contenu dans .env
   ```

4. **Implémenter les rappels automatiques** :

   - Créer un cron job pour J-1 à 18h
   - Créer un cron job pour H-2h
   - Utiliser Vercel Cron ou un service externe

5. **Tests SMS en production** :
   - Vérifier que `NODE_ENV=production` active vraiment l'envoi SMS
   - Tester avec de vrais numéros béninois
   - Surveiller les quotas Celtiis API

## 🌐 Déploiement

### Vercel (Recommandé)

```bash
# Connecter au repo Git
vercel

# Configurer les variables d'environnement dans le dashboard Vercel
# Ajouter DATABASE_URL, JWT_*, CELTIIS_*, FIREBASE_*, ENCRYPTION_KEY
```

### Base de Données PostgreSQL

- **Supabase** (Gratuit jusqu'à 500MB)
- **Render** (PostgreSQL gratuit)
- **Neon** (Serverless PostgreSQL)

## 📊 Workflow Complet d'un RDV

1. **Patient** : Recherche hôpital → Sélectionne → Remplit formulaire → Envoie demande
2. **Système** : Crée RDV (status=PENDING) → SMS "Demande reçue"
3. **Secrétaire** : Voit la demande → Fixe date/heure exacte → Confirme
4. **Système** : Update RDV (status=CONFIRMED) → SMS "RDV confirmé le..."
5. **Système (J-1 18h)** : SMS "Rappel - RDV demain à..."
6. **Système (H-2h)** : SMS "Rappel - RDV dans 2h"
7. **Médecin (jour J)** : Voit le patient dans la liste → Clique "Patient arrivé"
8. **Système** : Update (status=ARRIVED)
9. **Médecin** : Termine consultation → Clique "Terminé"
10. **Système** : Update (status=COMPLETED) → Fin du cycle

## 🎨 Personnalisation

### Couleur primaire (vert santé)

- Modifier dans `tailwind.config.ts` : `primary: { 500: '#00A86B' }`

### Logo

- Remplacer `/public/icons/icon-512x512.svg`
- Régénérer les PNG

### Textes

- Tout est en français
- Modifier directement dans les composants

## 📦 Technologies Utilisées

- **Framework** : Next.js 15.1.0 (App Router, React 19)
- **Langage** : TypeScript 5.6.3
- **UI** : Tailwind CSS 3.4.15 + shadcn/ui
- **Base de données** : Prisma 5.22.0 + PostgreSQL
- **Auth** : JWT (jose), OTP SMS
- **SMS** : Celtiis API (Bénin)
- **Push** : Firebase Cloud Messaging
- **PWA** : next-pwa 5.6.0
- **Stockage offline** : IndexedDB (idb 8.0.0)
- **Icônes** : lucide-react

## 📞 Support

Pour toute question ou bug :

1. Vérifier les logs dans la console navigateur et terminal
2. Vérifier les erreurs TypeScript : `npm run build`
3. Vérifier la base de données : `npx prisma studio`

---

**🎉 Lokita v1 est prêt pour le lancement au Bénin !**

_MVP développé avec ❤️ pour révolutionner l'accès aux soins médicaux à Cotonou et Abomey-Calavi._
