# AgriLink - Application de vente en ligne de produits agricoles

Ce projet est une application web de vente en ligne de produits agricoles, composée d'un frontend React/TypeScript et d'un backend Node.js/Express/MongoDB.

## Structure du projet

```
front1/
├── agrilink-backend/         # Dossier du backend
│   ├── config/              # Configuration de la base de données
│   ├── controllers/         # Contrôleurs pour les routes API
│   ├── middleware/          # Middlewares personnalisés
│   ├── models/              # Modèles Mongoose
│   ├── routes/              # Définition des routes API
│   ├── .env                 # Variables d'environnement
│   ├── package.json
│   └── server.js            # Point d'entrée du serveur
│
└── agrilink-front/          # Dossier du frontend
    ├── public/              # Fichiers statiques
    ├── src/
    │   ├── components/      # Composants React
    │   ├── contexts/        # Contextes React (comme l'authentification)
    │   ├── pages/           # Pages de l'application
    │   ├── services/        # Services pour les appels API
    │   ├── App.tsx          # Composant racine
    │   └── main.tsx         # Point d'entrée de l'application
    ├── package.json
    └── vite.config.ts       # Configuration Vite
```

## Configuration requise

- Node.js (version 14 ou supérieure)
- npm ou yarn
- MongoDB (localement ou via un service comme MongoDB Atlas)

## Installation et configuration

### Backend

1. Accédez au dossier du backend :
   ```bash
   cd agrilink-backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   - Créez un fichier `.env` à la racine du dossier backend
   - Ajoutez les variables suivantes :
     ```
     PORT=5000
     MONGODB_URI=votre_uri_mongodb
     JWT_SECRET=votre_secret_jwt
     ```

4. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
   Le serveur sera accessible à l'adresse : http://localhost:5000

### Frontend

1. Accédez au dossier du frontend :
   ```bash
   cd ../agrilink-front
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application en mode développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible à l'adresse : http://localhost:5173

## Fonctionnalités implémentées

### Authentification
- Inscription des utilisateurs (clients et producteurs)
- Connexion/déconnexion
- Gestion des sessions avec JWT

### Produits
- Liste des produits avec filtres
- Détails d'un produit
- Ajout/modification/suppression de produits (pour les producteurs)

### Panier
- Ajout/retrait de produits au panier
- Passage de commande

## Points d'API principaux

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Récupérer les informations de l'utilisateur connecté

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (producteur)
- `PUT /api/products/:id` - Mettre à jour un produit (producteur)
- `DELETE /api/products/:id` - Supprimer un produit (producteur)

## Sécurité

- Validation des entrées utilisateur
- Protection des routes avec authentification JWT
- Gestion des erreurs centralisée
- Protection contre les attaques XSS et CSRF

## Déploiement

### Backend
Le backend peut être déployé sur des plateformes comme :
- Heroku
- Railway
- Render
- Vercel (avec des fonctions serverless)

### Frontend
Le frontend peut être déployé sur :
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Licence

Ce projet est sous licence MIT.
