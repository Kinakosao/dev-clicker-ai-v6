# Spécification Technique : The Shadow Den (Cyber-Casino) - Dev Clicker v6.1

Ce document détaille l'implémentation du "Shadow Den", une extension de gameplay de type casino clandestin intégrée au projet Dev Clicker.

## 1. Vision & Ambiance
- **Nom :** The Shadow Den (Le Repaire de l'Ombre).
- **Esthétique :** "Glitch-Wave". Fond noir `#0a0a0a`, bordures néon rose `#ff00ff` clignotantes, effet scanline CRT, et police terminale rétro.
- **Hôte :** "Shadow", un avatar en ASCII silhouette animé qui "glitch" lors des interactions.

## 2. Intégration UI/UX
- **Accès :** Nouvel onglet "DEN" dans le panneau de gauche (débloqué à 1M de lignes totales).
- **Interface :**
  - Fenêtre de chat avec Shadow (Hugging Face / Transformers.js).
  - Zone de jeux (Bit-Crash, Hex-Slots).
  - Compteur de "Unstable Bits" (UB), la monnaie du casino.

## 3. Mécaniques de Gameplay

### 3.1. Économie du Casino
- **Unstable Bits (UB) :** 
  - Gagnés aléatoirement (chance de 1%) lors des clics manuels sur le clavier.
  - Échangeables contre des LDC (Lines of Code) via un terminal de conversion.
- **Le Dealer (Shadow) :**
  - Utilise `transformers.js` (modèle de génération de texte) pour commenter les résultats.
  - Ton : Cynique, provocateur, typique du cyberpunk.

### 3.2. Mini-Jeux
1. **Bit-Crash :**
   - Un multiplicateur monte de x1.0 vers un maximum théorique.
   - Le joueur doit cliquer sur "CASH OUT" avant le crash (aléatoire).
   - Gain = Mise * Multiplicateur actuel. Crash = Perte de la mise.
2. **Hex-Slots (0-F) :**
   - 3 rouleaux de caractères hexadécimaux.
   - Combinaisons :
     - 2 identiques = x2 mise.
     - 3 identiques = x10 mise.
     - "F-F-F" = Jackpot + Bonus "System Overload" (x10 LPS pendant 30s).

## 4. Implémentation Technique

### 4.1. Composants CSS
- Utilisation de `@keyframes` pour les effets de glitch et de scanlines.
- Filtres CSS (`hue-rotate`, `brightness`) pour simuler le flickering CRT.

### 4.2. Logique JavaScript
- **Casino Engine :** Un nouveau module `casino.js` pour gérer l'état des UB et la logique des jeux.
- **AI Integration :** Extension de `ai.js` pour inclure des prompts spécifiques à Shadow.
- **State Persistence :** Sauvegarde des UB dans le `localStorage` (objet `state.casino`).

## 5. Stratégie de Validation
- Vérifier que le gain de UB n'est pas trop frustrant (équilibrage du taux de drop).
- S'assurer que les animations de glitch ne dégradent pas les performances (60 FPS).
- Valider le temps de réponse de l'IA pour les commentaires (asynchronisme).
