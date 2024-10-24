# Mood Tracker - Strapi & Vue.js Application

## Description
Ce projet est une application de suivi des humeurs (Mood Tracker) permettant aux utilisateurs de consigner leurs humeurs hebdomadaires et de visualiser ces données à travers des graphiques. Le backend est géré par Strapi, un CMS headless, tandis que le frontend est développé en Vue.js pour l'affichage dynamique des données utilisateur.

## Table of Contents
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du Projet](#structure-du-projet)
- [Contact](#contact)

## Technologies
- **Frontend**: Vue.js 3, Chart.js, Axios
- **Backend**: Strapi (Headless CMS)
- **Base de données**: SQLite (par défaut avec Strapi, modifiable)
- **Authentification**: JWT via le plugin Users & Permissions de Strapi

## Prérequis
Avant de commencer, assurez-vous d'avoir les outils suivants installés :
- **Node.js** (version 14 ou plus récente) : [Télécharger Node.js](https://nodejs.org/)
- **npm** ou **yarn** : Inclus avec Node.js
- **Strapi CLI** : Installé globalement avec npm (`npm install strapi@latest -g`)

# Installation

## 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/mood-tracker.git
cd mood-tracker

## 2. Backend

- **Allez dans le dossier backend**: cd backend
- **Installez les dépendances**: npm install
- **Démarrez le serveur Strapi**: npm run develop

## 3. Backend

- **Allez dans le dossier frontend**: cd frontend
- **Installez les dépendances**: npm install
- **Démarrez le serveur Strapi**: npm run dev

- **Le frontend sera accessible à** http://localhost:8080.


# Configuration

## 1. Backend - Strapi

- **Base de données** : Le projet utilise SQLite par défaut, mais vous pouvez configurer une autre base de données dans le fichier config/database.js.
- **Permissions API** : Assurez-vous que les permissions pour les rôles (public, authenticated) sont bien configurées dans l'interface d'administration Strapi (via /admin).
- **Gestion des rôles** : Utilisez le plugin Users & Permissions pour définir les rôles et gérer l'authentification utilisateur.

## Frontend - Vue.js

- **JWT Auth** : Les utilisateurs se connectent à l'aide de JWT, qui est stocké dans localStorage. Ce jeton est utilisé pour effectuer des requêtes authentifiées vers l'API.
- **API** : Les appels API sont effectués avec Axios, configuré pour pointer vers l'instance Strapi dans src/services/api.js.

# Structure du projet

## 1. Backend - Strapi
backend/
├── api/
│   ├── mood/         # Collection des Moods
│   ├── team/         # Collection des Teams
│   └── ...
├── config/           # Fichiers de configuration (BD, serveur)
├── extensions/       # Extensions personnalisées (ex : utilisateurs)
└── ...

## 1. Frontend - Vuejs
frontend/
├── public/           # Fichiers publics (index.html, favicon, etc.)
├── src/
│   ├── assets/       # Fichiers statiques (images, styles)
│   ├── components/   # Composants Vue.js
│   ├── services/     # Services pour les appels API
│   ├── views/        # Vues principales de l'application
│   └── App.vue       # Composant racine
└── ...

# Contact
Si vous avez des questions ou besoin d'assistance, veuillez contacter :

- **Email** : mayeul.escouboue@gmail.com
- **GitHub** : Lien vers le dépôt GitHub