# BookMars Frontend

Ce projet consiste à créer une application simple et agréable qui permet de gérer ses favoris en ligne. L’utilisateur peut se connecter, organiser ses favoris, et consulter un tableau de bord qui résume ses statistiques de lecture.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- npm (v9 ou supérieur recommandé)
- Un backend opérationnel (voir dossier `backend`)

## Installation (Node.js ou Docker)

1. **Cloner le dépôt**

```bash
git clone https://github.com/Charlot-DEDJINOU/BookMark
cd frontend
```

2. **Installer les dépendances (Node.js)**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du dossier `frontend` si besoin, par exemple :

```env
VITE_API_URI_BASE=http://localhost:3000
```

> **Remarque :** Adaptez l'URL selon l'adresse de votre backend.


4. **Démarrer l'application**
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:5173](http://localhost:5173) par défaut.


## Scripts utiles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Génère la version de production
- `npm run preview` : Prévisualise la build de production

## Configuration Vite

Les paramètres de Vite sont dans `vite.config.ts`.