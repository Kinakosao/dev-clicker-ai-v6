# Spécification Technique : Nova - L'IA Co-Pilote Évolutive - Dev Clicker v6.2

Ce document détaille l'implémentation de Nova, une IA persistante qui accompagne le joueur, évolue en fonction de ses actions, et apporte des bonus de gameplay dynamiques.

## 1. Vision & Ambiance
- **Nom :** Nova (OS v1.2).
- **Esthétique :** Fenêtre HUD flottante sur la droite avec une police monospace bleue (#38bdf8) et des effets de pulsation.
- **Rôle :** Co-pilote proactif qui analyse les données de jeu en temps réel.

## 2. Système d'Évolution (Interaction-Based)
Nova possède 3 modules de compétences qui se débloquent en fonction du style de jeu :

### 2.1. Module Tactique (Le Planificateur)
- **Déblocage :** Utilisation réussie de la Bourse (5 transactions profitables).
- **Pouvoir :** Nova analyse les `TECH_NEWS` 10 secondes avant leur impact et affiche un avertissement de "PRÉDICTION" (Spike ou Crash imminent).
- **Bonus :** +5% de profit sur toutes les ventes d'actions.

### 2.2. Module Automation (Le Maître de l'Automatisation)
- **Déblocage :** Achat de 50 bâtiments au total.
- **Pouvoir :** Auto-Buying. Nova achète automatiquement le bâtiment le moins cher dès que le solde LDC est suffisant (désactivable via un switch).
- **Bonus :** +10% de production LPS (Lines Per Second) tous les 100 clics manuels.

### 2.3. Module Narratif (L'Architecte)
- **Déblocage :** 500 clics manuels effectués.
- **Pouvoir :** Quêtes Dynamiques. Nova génère des missions à haute récompense (ex: "Compilez 10M de lignes en 3 minutes") via Transformers.js.
- **Bonus :** Débloque l'onglet "AI Synergies" (upgrades de lore avancées).

## 3. Implémentation UI/UX
- **Nova HUD :** Un petit panneau discret au-dessus du panneau des statistiques.
- **Notifications :** Nova affiche des logs courts et proactifs (ex: "Attention, crash boursier imminent !") qui se distinguent de la console classique.
- **Progression :** Barres d'expérience visibles pour chaque module (Tactique, Automation, Narratif).

## 4. Logique Technique
- **State Extension :**
  ```javascript
  state.nova = {
    tacticalExp: 0,
    automationExp: 0,
    narrativeExp: 0,
    activePowers: [],
    isAutoBuy: false
  };
  ```
- **Market Analyzer :** Un hook dans la fonction `STOCK.update()` pour permettre à Nova d'intercepter les tendances avant l'affichage.
- **Auto-Buyer Logic :** Un `setInterval` qui scanne périodiquement les bâtiments achetables.

## 5. Stratégie de Validation
- Vérifier que l'Auto-Buyer ne vide pas les caisses de manière indésirable (ajustement des seuils).
- S'assurer que les prédictions boursières sont fiables par rapport au sentiment de l'IA.
- Tester la fluidité de l'interface lors des notifications simultanées de Nova et du système d'alerte Hacker.
