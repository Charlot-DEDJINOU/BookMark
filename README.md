# BookMark

Une application web de gestion des signets qui permet aux utilisateurs d'enregistrer, d'organiser et de suivre leurs liens favoris. Elle contribue à améliorer la productivité en offrant un accès rapide, une catégorisation claire et des statistiques pertinentes pour mieux gérer les ressources en ligne. Développée avec Vue.js 3, Vite, Vue Router, Axios, Chart.js, Tailwind CSS et TypeScript, et déployée sur Vercel et Render.

## Fonctionnalités

* **Page d’accueil** minimaliste et responsive avant connexion.
* **Authentification** (login via `/auth/login` avec token Bearer, gestion du stockage local et guards de routes).
* **Dashboard** avec statistiques :

  * Total de favoris
  * Favoris lus / non lus
  * Tags populaires
  * Visualisation via un graphique interactif (Chart.js).
* **Gestion des favoris** :

  * Lister
  * Créer
  * Modifier
  * Supprimer
  * Marquer comme lus/non lus
* **UI/UX** responsive, claire et moderne.
* **Déploiement** réalisé sur Vercel.

## Technologies utilisées

* **[Vue.js 3](https://vuejs.org/)** (Composition API)
* **[Vite](https://vitejs.dev/)** (bundler)
* **[Vue Router](https://router.vuejs.org/)** (navigation et guards)
* **[Axios](https://axios-http.com/)** (requêtes HTTP + intercepteurs)
* **[Chart.js](https://www.chartjs.org/)** (graphiques et statistiques)
* **[Tailwind CSS](https://tailwindcss.com/)** (stylisation et responsive design)
* **TypeScript** (typage statique et robustesse du code)
* **Vercel** (hébergement et déploiement continu)

## Liens importants

- **Application hébergée (frontend)** : [https://book-mark-two-kappa.vercel.app](https://book-mark-two-kappa.vercel.app)
- **Documentation de l’API (Swagger)** : [https://bookmarks-qn06.onrender.com/api-docs](https://bookmarks-qn06.onrender.com/api-docs)
- **Dépôt Git public** : [https://github.com/Charlot-DEDJINOU/BookMark](https://github.com/Charlot-DEDJINOU/BookMark)

## Installation et exécution locale

### 1. Cloner le dépôt

```bash
git https://github.com/Charlot-DEDJINOU/BookMark
cd BookMark
```

### 2. Lancer le projet en local (Node.js)

Backend :
```bash
cd backend
npm install
```
Configurer le fichier `.env` (voir `backend/README.md`).
```bash
npm run dev
```
Frontend (dans un autre terminal) :
```bash
cd frontend
npm install
```
Configurer le fichier `.env` (voir `frontend/README.md`).
```bash
npm run dev
```

## Déploiement

L’application est déjà déployée et accessible en ligne :

- **Frontend** : [https://book-mark-two-kappa.vercel.app](https://book-mark-two-kappa.vercel.app)
- **API/Swagger** : [https://bookmarks-qn06.onrender.com/api-docs](https://bookmarks-qn06.onrender.com/api-docs)

## Structure du projet

```
Bookmark/
  backend/    # API Express/Node.js
  frontend/   # Application Vue/Vite
```

Pour plus de détails sur chaque partie, consultez les fichiers `README.md` respectifs dans `backend/` et `frontend/`.

## Contribution

Les contributions sont les bienvenues ! Merci de consulter le dépôt GitHub pour proposer des améliorations ou signaler des bugs.