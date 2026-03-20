# Spécification Technique : Évolution Dev Clicker v6.0 - "The AI Singularity"

Ce document détaille le plan d'amélioration du projet Dev Clicker, intégrant l'IA (Hugging Face), des mécaniques de gameplay avancées et un polissage UI/UX complet.

## 1. Objectifs
1. **Intégration IA (Priorité 1) :** Transformer l'expérience narrative et économique via Transformers.js.
2. **Mécaniques de Gameplay (Priorité 2) :** Finaliser le système de Prestige (Singularité), l'Attaque Hacker et les Missions.
3. **Polissage Cyberdeck (Priorité 3) :** Améliorer l'immersion visuelle et sonore.

## 2. Architecture Technique

### 2.1. Noyau IA (Transformers.js)
- **Modèles :**
  - Text-Generation (ex: `Xenova/phi-1_5_quantized` ou `onnx-community/Llama-3.2-1B-Instruct-q4f16`) pour la console et les contrats.
  - Sentiment Analysis (ex: `Xenova/distilbert-base-uncased-finetuned-sst-2-english`) pour l'influence boursière.
- **Gestion :** Chargement asynchrone avec barre de progression UI. Mise en cache locale (IndexedDB) pour éviter les rechargements.

### 2.2. State Management
- Extension de l'objet `state` actuel pour inclure :
  - `aiEnabled`: boolean
  - `hackerIntegrity`: number (0-100)
  - `activeContracts`: array
  - `prestigeCount`: number (multiplicateur permanent)

## 3. Détail des Fonctionnalités

### 3.1. Le Noyau IA (Priorité 1)
- **Console Narrative :** L'IA génère des "logs" basés sur le dernier bâtiment acheté ou un seuil de lignes atteint.
- **Bourse IA :** Une news tech (ex: "Nouvelle faille de sécurité majeure") est générée, analysée par le modèle de sentiment, et impacte le cours de l'action `$STOCK`.
- **Générateur de Missions :** Des objectifs de clics ou de LPS avec des noms de missions cyberpunk générés par l'IA.

### 3.2. La Singularité & Gameplay (Priorité 2)
- **Prestige :** Animation CSS "Fullscreen Glitch". Reset des `lines` et `upgrades`. Ajout d'un bonus permanent de +10% de production par niveau de Singularité.
- **Attaque Hacker :** Alerte visuelle (rouge clignotant). Apparition d'un "code intrus" à cliquer ou de touches spécifiques à presser pour repousser l'attaque. Échec = Perte temporaire de 20% de production.
- **Contrats :** Interface dans l'onglet "Missions". Objectifs chronométrés.

### 3.3. Polissage UI/UX (Priorité 3)
- **Keyboard SVG :** Animation des touches `<path>` lors du `mousedown` / `keydown`.
- **Audio Procédural :** Modification du `playbackRate` ou de la fréquence de l'oscillateur dans `sound.js` proportionnellement au LPS.
- **Système de Particules :** Ajout de "Floating Combat Text" (ex: "+150", "CRIT!") avec des dégradés néon.

## 4. Stratégie de Test & Validation
- **Validation IA :** Vérifier que les modèles se chargent sans bloquer le thread principal (utilisation de Web Workers si possible).
- **Validation Gameplay :** Tester la persistance du multiplicateur de prestige après reset.
- **Validation UI :** Assurer la fluidité (60 FPS) même lors des attaques de hackers avec particules actives.

## 5. Déploiement
- Mise à jour progressive des fichiers : `script.js`, `style.css`, `index.html`, `sound.js`.
- Ajout d'une dépendance CDN pour Transformers.js dans `index.html`.
