# CHANGELOG

## [#12](https://github.com/betagouv/aides-simulateur-front/pull/12)

> _Note : Version non mise à jour par omission._

* Ajout de fonctionnalité.
* Détail :
  * Ajout de [sass-embedded](https://www.npmjs.com/package/sass-embedded) aux dépendences du projet
  * Début d'implémentation de la page d'accueil
  * Permet l'utilisation des pictogrammes DSFR depuis plusieurs sources
  * Création d'un template pour les pages de simulation

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
