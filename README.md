# 🐉 Loldle – Jeu RNG de monstres

Application mobile développée avec **Expo + React Native**, inspirée des mécaniques de jeux type *Loldle* mais adaptée à l’univers du jeu **Summoners Wars** 
Le joueur doit deviner un monstre, et chaque tentative est comparée pour donner des indices (étoiles, élément, archétype…).  

---

## 🚀 Stack technique

- **Expo** (React Native, Expo Router, EAS)  
- **TypeScript** pour plus de sécurité et lisibilité  
- **expo-router** avec `_layout.tsx` pour la navigation  
- **SQLite** intégré avec copie du fichier DB au lancement (`ensureDatabaseCopied`)  
- **Gestion RNG** : tirage pseudo-aléatoire avec possibilité de seed  
- **UI** : identité visuelle basée sur un duo **violet** et **jaune**

---

## 🎮 Fonctionnalités

- 🎲 Tirage aléatoire d’un monstre (avec possibilité de seed pour tests)

- 🔍 Comparaison intelligente : chaque tentative renvoie

   - nameMatch → Nom exact ou non

   - starsMatch → Même nombre d’étoiles

   - elementMatch → Même élément

   - archetypeMatch → Même archétype

   - LeaderSkill -> Attributs LeaderSkill

- 📑 Historique des tentatives avec affichage clair (ResultRow)

- 📊 Tri & filtres (par étoiles, par ordre alphabétique)

- 🗄️ SQLite pour stocker la base locale des monstres

## 📜 Licence

**Projet développé à titre personnel en collaboration avec Royle22 pour la base de données**
