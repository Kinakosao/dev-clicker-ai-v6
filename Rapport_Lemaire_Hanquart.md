# Rapport de Projet : Dev Clicker v2.0
**Auteurs : Lemaire & Hanquart**

## 1. Introduction
Ce projet consistait à reprendre une base de "Clicker Game" (Code Clicker) et à le transformer pour le rendre à la fois fonctionnel, esthétique et moderne. L'objectif était de s'éloigner des couleurs "flashy" et du style hacker classique pour proposer une interface utilisateur (UI) professionnelle et agréable.

## 2. Améliorations Visuelles
Nous avons opté pour une esthétique **Glassmorphism** et un thème sombre basé sur une palette de couleurs indigo et bleu ciel :
- **Couleurs :** Utilisation de variantes de `#0f172a` (Slate 900) pour le fond et `#38bdf8` (Sky 400) pour les accents.
- **Effets :** Utilisation massive de `backdrop-filter: blur()` pour donner un aspect de verre aux panneaux.
- **Typographie :** Utilisation des polices 'Inter' pour le texte général et 'Fira Code' pour les chiffres et les éléments liés au code, renforçant l'identité du jeu.
- **Fond Animé :** Remplacement de l'ancien fond statique par un **Canvas HTML5** générant des particules subtiles en mouvement.

## 3. Fonctionnalités Implémentées
Le projet est désormais un jeu complet et jouable :
- **Moteur de Jeu :** Calcul précis des lignes par seconde (LPS) et des lignes par clic (LPC).
- **Système d'Infrastructures :** 7 types de bâtiments achetables avec des coûts progressifs (croissance de 15% par achat).
- **Persistance :** Sauvegarde automatique dans le `localStorage` du navigateur pour ne pas perdre sa progression.
- **Système de Trophées :** 4 succès initiaux avec retour visuel et notifications.
- **Interface Interactive :** 
    - Système d'onglets fluide pour naviguer entre les bâtiments, les statistiques et les succès.
    - Particules de texte lors des clics pour un feedback immédiat.
    - News ticker dynamique avec des messages humoristiques sur le monde du développement.

## 4. Technologies Utilisées
- **HTML5 :** Structure sémantique et Canvas pour le rendu graphique.
- **CSS3 :** Flexbox, CSS Grid, Variables, et Animations avancées.
- **JavaScript (ES6+) :** Logique de jeu, gestion d'état, et manipulation du DOM.

## 5. Conclusion
Le projet répond désormais aux exigences de modernité et de fonctionnalité. Le design est épuré, les couleurs sont reposantes, et le gameplay offre une base solide pour d'éventuelles extensions futures (Prestige, Evénements aléatoires).
