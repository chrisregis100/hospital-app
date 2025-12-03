# Plan de Refonte Landing Page Lokita

Ce plan détaille les étapes strictes pour la refonte de la landing page afin d'atteindre un niveau de qualité "Premium" et "Wow".

## 1. Préparation & Configuration
- [x] Installer `framer-motion` pour les animations.
- [x] Créer le dossier `components/landing` pour organiser les composants de la page d'accueil.

## 2. Création des Assets
- [x] Générer une image Hero moderne et rassurante (médecin/patient ou illustration 3D abstract medical).

## 3. Développement des Composants (Design System & UI)

### A. Navigation & Header
- [x] Refondre la `Navbar` : Sticky, effet glassmorphism, CTA bien visible.

### B. Hero Section (Le "Wow" Effect)
- [x] Intégrer l'image générée.
- [x] Créer le module de recherche intégré (Input Spécialité + Input Quartier + Bouton Rechercher) directement dans le Hero.
- [x] Ajouter des animations d'entrée (Fade in/Slide up) sur les textes et la barre de recherche.

### C. Preuve Sociale (Confiance)
- [x] Créer une section `Partners` : "Ils nous font confiance" avec des logos (placeholders stylisés) en niveaux de gris qui s'animent au survol.

### D. Fonctionnalités (Design "Glass")
- [x] Refondre les cartes de fonctionnalités.
- [x] Utiliser un fond blanc avec légère transparence et ombre portée douce (Glassmorphism light).
- [x] Ajouter des micro-interactions au survol (léger scale, changement de couleur d'icône).

### E. Section "Comment ça marche"
- [x] Améliorer la lisibilité des étapes.
- [x] Ajouter une ligne connectrice animée entre les étapes si possible, ou renforcer la hiérarchie visuelle.

### F. Call to Action (CTA) Final & Footer
- [x] Design impactant pour le dernier bloc d'appel à l'action.
- [x] Footer propre et structuré.

## 4. Assemblage & Optimisation
- [x] Assembler tous les composants dans `app/page.tsx`.
- [x] Vérifier la réactivité mobile (Mobile First).
- [x] S'assurer que les contrastes sont bons et que le vert `#00A86B` est utilisé élégamment.
