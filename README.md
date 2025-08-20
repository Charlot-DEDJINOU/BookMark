# BookMarks

Ce projet consiste à créer une application simple et agréable qui permet de gérer ses favoris en ligne. L’utilisateur peut se connecter, organiser ses favoris, et consulter un tableau de bord qui résume ses statistiques de lecture.

## Installation et exécution locale (Node.js ou Docker)


### 1. Cloner le dépôt

```bash
git clone https://github.com/Charlot-DEDJINOU/Collaborative-Notes.git
cd Collaborative-Notes
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
npm run dev
```

## Déploiement

L’application est déjà déployée et accessible en ligne :

- **Frontend** : [https://collaborative-notes-xyz.vercel.app](https://collaborative-notes-xyz.vercel.app)
- **API/Swagger** : [https://collaborative-notes-oeoa.onrender.com/api-docs/](https://collaborative-notes-oeoa.onrender.com/api-docs/)


## Structure du projet

```
Bookmark/
  backend/    # API Express/Node.js
  frontend/   # Application React/Vite
```

Pour plus de détails sur chaque partie, consultez les fichiers `README.md` respectifs dans `backend/` et `frontend/`.
Des instructions spécifiques à Docker sont également présentes dans chaque sous-dossier.