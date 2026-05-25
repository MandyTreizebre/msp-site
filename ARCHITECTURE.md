# Architecture — Site MSP Varennes-sur-Allier


## Structure dossiers

```
msp-site/
├── app/
│   ├── page.jsx                          ← Page d'accueil
│   ├── professionnels/[slug]/page.jsx    ← Page d'une spécialisation
│   ├── gardes/page.jsx                   ← Page urgences & gardes (à créer)
│   ├── admin/                            ← Back-office (à créer)
│   └── api/
│       ├── specialisations/route.js
│       ├── professionals/[slug]/route.js
│       └── news/route.js
├── components/
│   └── homepage/
│       ├── FirstSection.jsx
│       ├── ZoneMapSection.jsx
│       ├── SpecialisationsSection.jsx
│       ├── NewsSection.jsx
│       └── ProfessionalCard.jsx
├── server/
│   ├── db.js                             ← Connexion PostgreSQL
│   └── DAL/
│       ├── SpecialisationsDAL.js
│       ├── ProfessionalsDAL.js
│       ├── NewsDAL.js
│       └── AvailabilityDAL.js            ← À créer
├── utils/
│   └── groupByDay.js                     ← Groupe les horaires hebdo par jour
└── styles/
    └── *.css
```

---

## Base de données

### `specialisations`
Liste des spécialisations médicales proposées par la MSP (médecins, pharmacies, infirmiers…).
Chaque spécialisation a un `slug` utilisé pour le routing (`/professionnels/medecins`).

### `professionals`
Chaque professionnel de santé. Lié à une spécialisation via `specialisation_id`.
Contient nom, téléphone, adresse.

### `weekly_hours`
Horaires hebdomadaires récurrents d'un professionnel.
Un professionnel peut avoir plusieurs lignes (ex : 08:00–12:00 et 14:00–18:00 le lundi).

| Colonne | Type | Description |
|---|---|---|
| `weekday` | integer | 1 = lundi … 7 = dimanche |
| `start_time` | time | Heure d'ouverture |
| `end_time` | time | Heure de fermeture |

### `exception_days`
Exceptions ponctuelles à l'emploi du temps habituel d'un professionnel.
Plusieurs lignes possibles par professionnel par date (ex : remplaçant la journée + garde le soir).

| Type | Description |
|---|---|
| `close` | Fermeture exceptionnelle — pas de créneau |
| `replace` | Horaires différents ce jour-là — créneaux dans `exception_slots` |
| `guard` | Garde en dehors des horaires habituels — créneau dans `exception_slots` |
| `replacement` | Absent, remplacé par un confrère — infos dans `replacements` |

### `exception_slots`
Créneaux horaires liés à une exception (`replace`, `guard`, `replacement`).
Vide pour une exception de type `close`.

### `replacements`
Informations du remplaçant quand `exception_days.type = 'replacement'`.
Le remplaçant peut être extérieur à la MSP (nom + téléphone suffit, pas de FK vers `professionals`).

---

## DAL (Data Access Layer)

### `SpecialisationsDAL`
- `getSpecialisations()` → retourne toutes les spécialisations pour la section homepage

### `ProfessionalsDAL`
- `getBySpecialisationSlug(slug)` → retourne les professionnels d'une spécialisation avec leurs `weekly_hours` agrégées en JSON via `json_agg`

### `NewsDAL`
- `getNews()` → retourne les actualités pour la section homepage

### `AvailabilityDAL` *(à créer)*
- `getAvailableToday()` → retourne uniquement les médecins et pharmacies ouverts ou de garde aujourd'hui, avec leur statut calculé à l'heure H

---

## Routes API

| Route | DAL appelé | Utilisé par |
|---|---|---|
| `GET /api/specialisations` | `SpecialisationsDAL.getSpecialisations()` | `SpecialisationsSection.jsx` |
| `GET /api/professionals/[slug]` | `ProfessionalsDAL.getBySpecialisationSlug(slug)` | `app/professionnels/[slug]/page.jsx` |
| `GET /api/news` | `NewsDAL.getNews()` | `NewsSection.jsx` |
| `GET /api/availability` | `AvailabilityDAL.getAvailableToday()` | `app/gardes/page.jsx` *(à créer)* |

---

## Composants

### `FirstSection.jsx`
Hero de la page d'accueil. Titre H1 + 3 cards d'accès rapide (équipe, urgences, contact).
Composant statique — pas de données.

### `ZoneMapSection.jsx`
Carte de la zone géographique de la MSP.

### `SpecialisationsSection.jsx`
Grille de cards cliquables, une par spécialisation.
Fetch `/api/specialisations`. Redirige vers `/professionnels/[slug]`.

### `NewsSection.jsx`
Grille d'actualités santé.
Fetch `/api/news`. Affiche titre, extrait, image, date et lien.

### `ProfessionalCard.jsx`
Card d'un professionnel avec ses horaires groupés.
Utilise `groupByDay()` pour afficher les créneaux (ex : "Lun–Ven · 08:00 à 19:45").

---

## Utilitaires

### `groupByDay.js`
Prend un tableau `weekly_hours` et regroupe les créneaux par jour de la semaine.

**Entrée :**
```js
[
  { weekday: 1, start: '08:00', end: '12:00' },
  { weekday: 1, start: '14:00', end: '18:00' },
  { weekday: 2, start: '08:00', end: '12:00' },
]
```

**Sortie :**
```js
[
  { weekday: 1, ranges: ['08:00 à 12:00', '14:00 à 18:00'] },
  { weekday: 2, ranges: ['08:00 à 12:00'] },
]
```

---

## Règles métier — Page urgences/gardes

Seuls les **médecins et pharmacies** apparaissent sur cette page.
Seuls les professionnels **ouverts ou de garde aujourd'hui** sont affichés.

**Priorité de calcul à l'heure H :**

1. `close` → "Fermé aujourd'hui" (et on s'arrête là)
2. Créneau `replace` ou horaire normal **en cours** → "Ouvert jusqu'à Xh"
3. Créneau `replace` ou horaire normal **à venir** → "Ouvre aujourd'hui à Xh"
4. `guard` à venir → "De garde ce soir de Xh à Xh"
5. `replacement` en cours ou à venir → "Remplacé par Dr X — 06 00 00 00 00"
6. Sinon → le professionnel n'apparaît pas

Un professionnel peut avoir plusieurs exceptions le même jour (ex : remplaçant la journée + garde le soir) → plusieurs lignes dans `exception_days`.

---

## Todo

- [ ] `AvailabilityDAL.js` — logique de calcul temps réel
- [ ] `app/gardes/page.jsx` — page urgences & gardes
- [ ] `app/admin/` — back-office de gestion des horaires
- [ ] Authentification NextAuth.js (accès admin uniquement)
- [ ] Refactorisation en Server Components (pour supprimer useEffect/axios sur les composants statiques)
- [ ] Responsive mobile