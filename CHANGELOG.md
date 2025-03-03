# CHANGELOG

## 0.1.0 [#21](https://github.com/betagouv/aides-simulateur-front/pull/21)

* Ajout de fonctionnalité.
* Détail :
  * Applique un layout dédié aux pages exposées par `iframe` (sans header, footer ni padding)

### 0.0.2 [#13](https://github.com/betagouv/aides-simulateur-front/pull/13)

* Évolution technique.
* Détail : 
  * Ajoute la configuration de déploiement `Procfile` utilisée par Scalingo
  * Explicite la version de node dans `package.json` évitant une erreur Scalingo

## [#12](https://github.com/betagouv/aides-simulateur-front/pull/12)

> _Note : Version non mise à jour par omission._

* Ajout de fonctionnalité.
* Détail :
  * Ajoute [sass-embedded](https://www.npmjs.com/package/sass-embedded) aux dépendences du projet
  * Débute l'implémentation de la page d'accueil
  * Permet l'utilisation des pictogrammes DSFR depuis plusieurs sources
  * Crée un template pour les pages de simulation

### 0.0.1 [#1](https://github.com/betagouv/aides-simulateur-front/pull/1)

* Évolutions techniques.
* Détail :
  * Initialisation de l'application sur base [VueDsfr](https://vue-ds.fr) et Nuxt.js
  * Initialisation de la configuraiton pour une interface marque blanche : 
    * En-tête et footer : `client/app.config.ts`
    * Contenu de page injecté en Markdown : `content/pages/*`
  * Initialisation de la documentation du dépôt : README.md, CHANGELOG.md
  * Configuration des dépendances (dont npm et pnpm)
  * Configurations de l'environnement de développement : `eslint.config.js`
  * Configuration de l'éditeur de développement : `.editorconfig`, `.vscode/`
