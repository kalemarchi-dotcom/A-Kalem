# 🏛 Bet Kalem — Application de gestion

Bureau d'Architecture · Gestion Projets, Fichiers, Clients, Équipe & QR Codes

---

## 🚀 Déployer en ligne en 5 minutes (GRATUIT)

### Option A — Vercel (recommandé)

1. Créer un compte gratuit sur https://vercel.com
2. Aller sur https://github.com → créer un compte gratuit
3. Créer un nouveau dépôt "bet-kalem" (privé)
4. Uploader tous ces fichiers dans le dépôt
5. Sur Vercel → "Add New Project" → connecter le dépôt GitHub
6. Cliquer "Deploy" → votre app est en ligne !

Vous recevez un lien du type : **https://bet-kalem.vercel.app**

---

### Option B — Netlify (alternative)

1. Créer un compte sur https://netlify.com
2. Glisser-déposer le dossier **dist/** dans Netlify Drop
   (après avoir lancé `npm run build` localement)

---

## 📱 Installer comme application mobile (PWA)

Une fois le lien en ligne :

**Sur Android (Chrome) :**
1. Ouvrir le lien dans Chrome
2. Menu (⋮) → "Ajouter à l'écran d'accueil"
3. L'application apparaît comme une vraie app !

**Sur iPhone (Safari) :**
1. Ouvrir le lien dans Safari
2. Bouton Partager → "Sur l'écran d'accueil"
3. L'application s'installe comme une app native !

---

## 💻 Lancer en local (sur votre PC)

Prérequis : installer Node.js depuis https://nodejs.org

```bash
# 1. Ouvrir un terminal dans ce dossier
cd bet-kalem

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev

# 4. Ouvrir http://localhost:5173 dans le navigateur

# 5. Pour construire la version finale
npm run build
```

---

## 📁 Structure du projet

```
bet-kalem/
├── src/
│   ├── main.jsx        ← Point d'entrée React
│   └── App.jsx         ← Application complète Bet Kalem
├── public/
│   ├── manifest.json   ← Configuration PWA
│   ├── sw.js           ← Service Worker (mode hors-ligne)
│   └── icon.svg        ← Icône Bet Kalem
├── index.html          ← Page HTML principale
├── vite.config.js      ← Configuration Vite
├── vercel.json         ← Déploiement Vercel
├── netlify.toml        ← Déploiement Netlify
└── package.json        ← Dépendances
```

---

## ✨ Fonctionnalités

- 📊 **Tableau de bord** — Vue d'ensemble des projets et stats
- 📁 **Projets** — Gestion complète avec fichiers par catégorie
- 👥 **Clients** — Fiches clients avec QR code
- 🏗 **Équipe** — 9 membres (Gérant, Co-gérant, Architectes, Ingénieur, Réception)
- ⊡ **QR Codes** — Pour chaque projet, fichier et membre
- ⚙ **Paramètres** — Personnalisation logo, couleur, nom

---

## 👥 Équipe Bet Kalem

| Rôle | Nom |
|------|-----|
| Gérant | (votre nom) |
| Co-Gérant | Sid Ahmed |
| Architecte | Hanane |
| Architecte | Ahmed |
| Architecte | Aymen |
| Architecte | Azzedine |
| Architecte | Aymen (2ème) |
| Ingénieur GC | (à compléter) |
| Réception | Hanane |

---

© 2025 Bet Kalem — Bureau d'Architecture
