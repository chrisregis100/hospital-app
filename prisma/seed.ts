import { PrismaClient, TimeSlot, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

// Spécialités médicales courantes au Bénin
const specialties = [
  {
    name: "Médecine Générale",
    description: "Consultation générale",
    iconName: "Stethoscope",
  },
  { name: "Pédiatrie", description: "Soins pour enfants", iconName: "Baby" },
  {
    name: "Gynécologie",
    description: "Santé féminine",
    iconName: "HeartPulse",
  },
  { name: "Cardiologie", description: "Maladies du cœur", iconName: "Heart" },
  { name: "Dentisterie", description: "Soins dentaires", iconName: "Smile" },
  { name: "Ophtalmologie", description: "Soins des yeux", iconName: "Eye" },
  { name: "Dermatologie", description: "Problèmes de peau", iconName: "Scan" },
  { name: "Orthopédie", description: "Os et articulations", iconName: "Bone" },
];

// Hôpitaux à Cotonou et Abomey-Calavi
const hospitals = [
  {
    name: "Centre Hospitalier Universitaire de Cotonou",
    address: "Avenue Clozel",
    district: "Centre-ville",
    city: "Cotonou",
    phoneNumber: "+22921300155",
    email: "contact@chu-cotonou.bj",
    latitude: 6.3654,
    longitude: 2.4183,
    isApproved: true,
    openingHours: {
      lundi: "7h-19h",
      mardi: "7h-19h",
      mercredi: "7h-19h",
      jeudi: "7h-19h",
      vendredi: "7h-19h",
      samedi: "8h-13h",
      dimanche: "Fermé",
    },
    specialties: [
      "Médecine Générale",
      "Cardiologie",
      "Pédiatrie",
      "Gynécologie",
    ],
  },
  {
    name: "Clinique Univers",
    address: "Route de l'Aéroport",
    district: "Cadjehoun",
    city: "Cotonou",
    phoneNumber: "+22921383838",
    email: "info@cliniqueunivers.bj",
    latitude: 6.3573,
    longitude: 2.3894,
    isApproved: true,
    openingHours: {
      lundi: "8h-20h",
      mardi: "8h-20h",
      mercredi: "8h-20h",
      jeudi: "8h-20h",
      vendredi: "8h-20h",
      samedi: "8h-18h",
      dimanche: "9h-13h",
    },
    specialties: [
      "Médecine Générale",
      "Dentisterie",
      "Ophtalmologie",
      "Dermatologie",
    ],
  },
  {
    name: "Polyclinique Les Cocotiers",
    address: "Boulevard de la Marina",
    district: "Marina",
    city: "Cotonou",
    phoneNumber: "+22921312020",
    email: "contact@lescocotiers.bj",
    latitude: 6.3667,
    longitude: 2.4289,
    isApproved: true,
    openingHours: {
      lundi: "7h30-19h30",
      mardi: "7h30-19h30",
      mercredi: "7h30-19h30",
      jeudi: "7h30-19h30",
      vendredi: "7h30-19h30",
      samedi: "8h-14h",
      dimanche: "Urgences uniquement",
    },
    specialties: ["Médecine Générale", "Pédiatrie", "Orthopédie"],
  },
  {
    name: "Hôpital de Zone Abomey-Calavi",
    address: "Carrefour Godomey",
    district: "Godomey",
    city: "Abomey-Calavi",
    phoneNumber: "+22921360707",
    email: "hz.abomeycalavi@gouv.bj",
    latitude: 6.4449,
    longitude: 2.3558,
    isApproved: true,
    openingHours: {
      lundi: "7h-18h",
      mardi: "7h-18h",
      mercredi: "7h-18h",
      jeudi: "7h-18h",
      vendredi: "7h-18h",
      samedi: "8h-12h",
      dimanche: "Fermé",
    },
    specialties: ["Médecine Générale", "Pédiatrie", "Gynécologie"],
  },
  {
    name: "Centre Médical Saint-Luc",
    address: "Akpakpa Dodomè",
    district: "Akpakpa",
    city: "Cotonou",
    phoneNumber: "+22921335151",
    email: "saintluc@medical.bj",
    latitude: 6.3456,
    longitude: 2.4389,
    isApproved: true,
    openingHours: {
      lundi: "8h-18h",
      mardi: "8h-18h",
      mercredi: "8h-18h",
      jeudi: "8h-18h",
      vendredi: "8h-18h",
      samedi: "8h-13h",
      dimanche: "Fermé",
    },
    specialties: ["Médecine Générale", "Dentisterie", "Pédiatrie"],
  },
  {
    name: "Clinique Atlantique",
    address: "Rue 1539, Fidjrossè",
    district: "Fidjrossè",
    city: "Cotonou",
    phoneNumber: "+22921377777",
    email: "info@cliniqueatlantique.bj",
    latitude: 6.3745,
    longitude: 2.3967,
    isApproved: true,
    openingHours: {
      lundi: "7h-21h",
      mardi: "7h-21h",
      mercredi: "7h-21h",
      jeudi: "7h-21h",
      vendredi: "7h-21h",
      samedi: "7h-21h",
      dimanche: "8h-18h",
    },
    specialties: [
      "Médecine Générale",
      "Cardiologie",
      "Ophtalmologie",
      "Dermatologie",
    ],
  },
];

// Utilisateurs de test
const testUsers = [
  {
    phoneNumber: "+22961234567",
    firstName: "Jean",
    lastName: "Kossou",
    role: UserRole.PATIENT,
    isPhoneVerified: true,
    consentGiven: true,
    consentDate: new Date(),
  },
  {
    phoneNumber: "+22962345678",
    firstName: "Marie",
    lastName: "Adjahoui",
    role: UserRole.PATIENT,
    isPhoneVerified: true,
    consentGiven: true,
    consentDate: new Date(),
  },
  {
    phoneNumber: "+22963456789",
    firstName: "Claudine",
    lastName: "Dossou",
    role: UserRole.SECRETARY,
    isPhoneVerified: true,
    consentGiven: true,
    consentDate: new Date(),
  },
  {
    phoneNumber: "+22964567890",
    firstName: "Dr. Paul",
    lastName: "Azonhiho",
    role: UserRole.DOCTOR,
    isPhoneVerified: true,
    consentGiven: true,
    consentDate: new Date(),
  },
  {
    phoneNumber: "+22965678901",
    firstName: "Admin",
    lastName: "Lokita",
    role: UserRole.SUPER_ADMIN,
    isPhoneVerified: true,
    consentGiven: true,
    consentDate: new Date(),
  },
];

async function main() {
  console.log("🌱 Début du seeding de la base de données Lokita...");

  // Nettoyer la base de données
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.hospitalSpecialty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.specialty.deleteMany();

  // Créer les spécialités
  console.log("🏥 Création des spécialités médicales...");
  const createdSpecialties = await Promise.all(
    specialties.map((specialty) =>
      prisma.specialty.create({
        data: specialty,
      })
    )
  );
  console.log(`✅ ${createdSpecialties.length} spécialités créées`);

  // Créer les hôpitaux avec leurs spécialités
  console.log("🏥 Création des hôpitaux...");
  for (const hospital of hospitals) {
    const { specialties: hospitalSpecialties, ...hospitalData } = hospital;

    const createdHospital = await prisma.hospital.create({
      data: {
        ...hospitalData,
        approvedAt: new Date(),
        approvedBy: "system",
      },
    });

    // Associer les spécialités
    for (const specialtyName of hospitalSpecialties) {
      const specialty = createdSpecialties.find(
        (s) => s.name === specialtyName
      );
      if (specialty) {
        await prisma.hospitalSpecialty.create({
          data: {
            hospitalId: createdHospital.id,
            specialtyId: specialty.id,
            availableDoctors: Math.floor(Math.random() * 3) + 1,
          },
        });
      }
    }

    console.log(`  ✓ ${createdHospital.name}`);
  }

  // Créer les utilisateurs de test
  console.log("👥 Création des utilisateurs de test...");
  const createdUsers = [];
  const firstHospital = await prisma.hospital.findFirst();

  for (const user of testUsers) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        // Associer médecins et secrétaires au premier hôpital
        hospitalId:
          user.role === UserRole.SECRETARY || user.role === UserRole.DOCTOR
            ? firstHospital?.id
            : undefined,
      },
    });

    // Créer un consentement pour chaque utilisateur
    await prisma.consent.create({
      data: {
        userId: createdUser.id,
        dataProcessing: true,
        smsNotifications: true,
        pushNotifications: true,
      },
    });

    createdUsers.push(createdUser);
    console.log(
      `  ✓ ${createdUser.firstName} ${createdUser.lastName} (${createdUser.role})`
    );
  }

  // Créer quelques rendez-vous de test
  console.log("📅 Création de rendez-vous de test...");
  const patient = createdUsers.find((u) => u.role === UserRole.PATIENT);
  const allHospitals = await prisma.hospital.findMany();

  if (patient && allHospitals.length > 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        hospitalId: allHospitals[0].id,
        requestedDate: tomorrow,
        requestedSlot: TimeSlot.MORNING_10_12,
        reason: "Consultation générale - Maux de tête persistants",
        status: "PENDING",
      },
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        hospitalId: allHospitals[1].id,
        requestedDate: nextWeek,
        requestedSlot: TimeSlot.AFTERNOON_14_16,
        confirmedDate: nextWeek,
        reason: "Contrôle annuel",
        status: "CONFIRMED",
      },
    });

    console.log("  ✓ 2 rendez-vous créés");
  }

  // Créer un journal d'audit
  console.log("📝 Création de journaux d'audit...");
  const admin = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN);
  if (admin) {
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "SEED_DATABASE",
        entityType: "System",
        entityId: "seed",
        newData: {
          hospitals: hospitals.length,
          specialties: specialties.length,
          users: testUsers.length,
        },
        ipAddress: "127.0.0.1",
        userAgent: "Prisma Seed Script",
      },
    });
    console.log("  ✓ Journal d'audit créé");
  }

  console.log("\n✨ Seeding terminé avec succès !");
  console.log("\n📊 Résumé :");
  console.log(`  - ${createdSpecialties.length} spécialités médicales`);
  console.log(`  - ${hospitals.length} hôpitaux`);
  console.log(`  - ${createdUsers.length} utilisateurs de test`);
  console.log(`  - 2 rendez-vous de test`);
  console.log("\n🔐 Comptes de test :");
  console.log("  Patient: +22961234567");
  console.log("  Secrétaire: +22963456789");
  console.log("  Médecin: +22964567890");
  console.log("  Admin: +22965678901");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
