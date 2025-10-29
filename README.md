# Saboteurs de l’Asphalte (SDA)

**Saboteurs de l’Asphalte** est un prototype de jeu de course arcade compétitive en 3D destiné à tourner dans un navigateur grâce à WebGL. Le cœur du jeu est une boucle simple : rejoignez un lobby, sélectionnez un circuit, courez sur trois tours et utilisez des pouvoirs pour saboter vos adversaires. Ce dépôt contient le code client (Three.js) et serveur (Colyseus/Node.js), l’intégration continue et les fichiers de déploiement pour Render.

## Structure du dépôt

```
├── client                 # Code TypeScript côté client (Three.js, HUD)
│   ├── src
│   │   ├── main.ts        # Point d’entrée du client
│   │   └── scene.ts       # Construction de la scène et logique de base
│   ├── public             # Fichiers statiques servis tels quels (icônes, index.html)
│   ├── tsconfig.json      # Configuration TypeScript
│   ├── vite.config.ts     # Configuration Vite pour construction/bundle
│   └── package.json       # Dépendances client
│
├── server                 # Code TypeScript côté serveur (Colyseus)
│   ├── src
│   │   ├── index.ts       # Point d’entrée du serveur Web et WebSocket
│   │   ├── rooms
│   │   │   └── RaceRoom.ts# Exemples de salle Colyseus
│   │   └── utils
│   │       └── physics.ts # Début de logique de physique côté serveur
│   ├── tsconfig.json
│   └── package.json
│
├── infra
│   └── render
│       ├── client-render.yaml    # Déploiement du client sur Render
│       └── server-render.yaml    # Déploiement du serveur sur Render
│
├── .github/workflows
│   ├── ci.yml            # Lint, build et tests
│   └── deploy.yml        # Déploiement automatique vers Render lorsque `main` est mis à jour
└── Dockerfiles
    ├── client.Dockerfile # Image pour servir le client statique
    └── server.Dockerfile # Image pour le serveur Node.js/Colyseus
```

## Installation et lancement local

### Client

1. Assurez‑vous d’avoir **Node.js ≥ 18** et **npm** installés.
2. Dans un terminal :

```bash
cd client
npm install
npm run dev
```

Le client démarre sur `http://localhost:5173`.

### Serveur

1. Dans un second terminal :

```bash
cd server
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:2567` et expose une API WebSocket avec Colyseus.

## Déploiement via Render

Les fichiers `infra/render/*.yaml` donnent un exemple minimal pour créer deux services sur Render : un **Static Site** (client) et un **Web Service** (serveur). Ils s’appuient sur les images construites par les Dockerfiles et doivent être reliés à votre dépôt GitHub avec les variables d’environnement suivantes :

- `DATABASE_URL` et `REDIS_URL` pour la base de données et Redis
- `JWT_SECRET` pour l’authentification
- `ROOM_TICK_RATE` et `SNAPSHOT_RATE` pour la simulation

L’intégration continue GitHub via le fichier `.github/workflows/deploy.yml` déclenchera automatiquement un déploiement sur Render lors des commits sur la branche `main`.

## Limites

Ce projet est un **prototype** et ne propose pour l’instant qu’une implémentation minimale :

- Le client affiche une piste simple et un véhicule contrôlable au clavier.
- Le serveur instancie une salle multijoueur où les positions des véhicules sont synchronisées entre joueurs.
- Les mécaniques avancées (pouvoirs, matchmaking, classement) sont laissées à implémenter.

Ce squelette sert de base pour étendre le jeu selon le cahier des charges détaillé.