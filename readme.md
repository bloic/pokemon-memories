# Memory Game Pokémon

## Description

Ce projet est un jeu de Memory basé sur les Pokémon, développé avec Symfony 7. Le joueur doit retrouver les paires de cartes identiques. À chaque niveau réussi, la difficulté augmente avec plus de paires à trouver.

## Fonctionnalités

- Jeu de Memory avec des Pokémon comme images
- Système de niveaux progressifs (plus de cartes à chaque niveau)
- Score en temps réel
- Système de points avec récompenses et pénalités
- Timer avec bonus de temps
- Notification de victoire
- Bouton de réinitialisation pour recommencer au niveau 1
- Design responsive

## Prérequis

- PHP 8.2 ou supérieur
- Composer
- Symfony CLI 

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <git@github.com:bloic/pokemon-memories.git>
   cd memory-game-pokemon
   ```

2. Installez les dépendances :
   ```bash
   composer install
   ```

3. Lancez le serveur de développement :
   ```bash
   symfony server:start
   ```
   ou
   ```bash
   php -S localhost:8000 -t public
   ```

4. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:8000`

## Structure du projet

- `src/Controller/IndexController.php` : Contrôleur principal qui gère le jeu
- `templates/index/index.html.twig` : Template principal du jeu
- `assets/app.js` : Logique JavaScript du jeu
- `assets/styles/app.css` : Styles CSS du jeu

## Comment jouer

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur deux cartes pour tenter de former une paire
3. Si les cartes sont identiques, elles restent visibles et vous gagnez des points
4. Si les cartes sont différentes, elles se retournent et vous perdez des points
5. Trouvez toutes les paires pour passer au niveau suivant
6. Plus vous jouez vite, plus vous gagnez de points bonus
7. Utilisez le bouton "Recommencer au niveau 1" pour réinitialiser le jeu

## Règles du jeu

- Au niveau 1, vous commencez avec 2 paires (4 cartes)
- À chaque niveau, le nombre de paires augmente
- Les cartes sont mélangées à chaque niveau
- Système de points :
  - +10 points × niveau pour chaque paire trouvée
  - -5 points pour chaque erreur
  - Bonus de temps à la fin du niveau (jusqu'à 100 points)
  - Bonus de niveau (50 points × niveau)

## Technologies utilisées

- Symfony 7
- Twig (moteur de templates)
- JavaScript
- CSS
- API Pokémon (pokeapi.co)

## Personnalisation

Vous pouvez personnaliser le jeu en modifiant :

- Le nombre de cartes par niveau (dans `IndexController.php`)
- L'apparence des cartes (dans `app.css`)
- Le comportement du jeu (dans `app.js`)
- Le système de points et les bonus (dans `app.js`)

## Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez que toutes les dépendances sont installées
2. Videz le cache de Symfony : `php bin/console cache:clear`
3. Videz le cache de votre navigateur
4. Vérifiez la console de votre navigateur pour d'éventuelles erreurs JavaScript

## Remerciements

- L'API Pokémon (pokeapi.co) pour les données des Pokémon
---