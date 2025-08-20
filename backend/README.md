# BookMarks Backend

Ce projet consiste à créer une application simple et Une application web de gestion des signets qui permet aux utilisateurs d'enregistrer, d'organiser et de suivre leurs liens favoris. Elle contribue à améliorer la productivité en offrant un accès rapide, une catégorisation claire et des statistiques pertinentes pour mieux gérer les ressources en ligne. Développée avec Vue.js 3, Vite, Vue Router, Axios, Chart.js, Tailwind CSS et TypeScript, et déployée sur Vercel et Render.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- npm (v9 ou supérieur recommandé)
- Une base de données MongoDB (locale ou distante)

## Installation (Node.js ou Docker)

1. **Cloner le dépôt**

```bash
git clone https://github.com/Charlot-DEDJINOU/BookMark
cd backend
```

2. **Installer les dépendances (Node.js)**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du dossier `backend` en vous basant sur l'exemple ci-dessous :

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7200
ALLOWED_ORIGINS=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/bookmark
APP_PRODUCTION_URI=your-app-production-uri
```

> **Remarque :** Adaptez les valeurs selon votre environnement.


4. **Démarrer le serveur**

- En mode développement :
```bash
npm run dev
```
- En mode production :
```bash
npm run build
npm start
```

## Documentation API

Après démarrage, accédez à la documentation interactive :

- En développement : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- En production : `https://votre-domaine.com/api-docs`