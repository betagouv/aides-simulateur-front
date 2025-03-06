# CHANGELOG
## 0.5.0 [#28](https://github.com/betagouv/aides-simulateur-front/pull/28)
* Ajout de fonctionnalité
* Détail :
  * Ajoute la gestion de pages de contenus `simulateurs` avec nuxt-content
  * Ajoute la gestion de pages de contenus `aides` avec nuxt-content
  * Ajoute la gestion de pages de contenus `notions` avec nuxt-content
  * Création d'une arborescence plate pour les pages de contenus décorrélées d'une simulation :
  - `aides/index.vue` pour la liste des aides
  - `aides/[aide_id].vue` pour une aide particulière
  - `notions/index.vue` pour la liste des notions
  - `notions/[notion_id].vue` pour une notion particulière
  * Création d'une arborescence profonde pour les pages relevant d'une simulation utilisateur :
    - `simulateurs/index.vue` pour la liste des simulateurs
    - `simulateurs/[simulateur_id]/index.vue` pour un simulateur particulier
    - `simulateurs/[simulateur_id]/[notion_id].vue` pour une notion consultable dans le cadre d'une simulation
    - `simulateurs/[simulateur_id]/resultats/index.vue` pour la page de résultats d'une simulation
    - `simulateurs/[simulateur_id]/resultats/[aide_id].vue` pour la page de détail d'une aide suite à une simulation

## 0.4.0 [#29](https://github.com/betagouv/aides-simulateur-front/pull/29)
* Ajout de fonctionnalité
* Détail :
  * Ajout de la première version du simulateur de simulation globale

## 0.3.2 [#26](https://github.com/betagouv/aides-simulateur-front/pull/26)

* Ajout de fonctionnalité
* Détail :
  * Ajout d'un bandeau d'information dans le layout principal pour informer l'utilisateur de l'état de développement du projet

## 0.3.1 [#25](https://github.com/betagouv/aides-simulateur-front/pull/25)

* Evolutions techniques
* Détail :
  * Ajout dans [simulateurs_id].vue du script `iframeResizer.contentWindow.min.js` afin de gérer le resizing dynamique de l'iframe
  * Modification du script `iframe-integration.js` pour debuger le resizing dynamique de l'iframe
  
## 0.3.0 [#23](https://github.com/betagouv/aides-simulateur-front/pull/23)

* Ajout de fonctionnalité.
* Détail :
  * Création de l'architecture d'un simulateur
    * Chargement dynamique des questions du simulateur avec la librairie `form.ts`
    * Logique de navigation conditionnelle des questions avec la librairie `form.ts` 
  * Affichage front dynamique et modulaire des formulaires d'aides:
    * Composant `Survey`
    * Composant `DateQuestion`
    * Composant `MultiSelectQuestion`
    * Composant `RadioButtonQuestion`
  * Persistence des données remplies par l'utilisateuravec `pinia-plugin-persistedstate`  
  * Ajout d'un bouton de soumission du formulaire et d'une méthode `submitForm` pour gérer le traitement des réponses du formulaire dans le composant `Survey`

## 0.2.0 [#14](https://github.com/betagouv/aides-simulateur-front/pull/14)

* Ajout de fonctionnalité.
* Détail :
  * Création du fond dynamique qui signe l'identité d'aides-simplifiées
    * Pour permettre l'utilisation de plusieurs fonds en fonction de la hauteur du conteneur à décorer, ajout de l'utilitaire `useElementSize` de la libraire `VueUse` pour ces nombreux utilitaires légers.
  * Création d'un composant `SectionContainer` pour gérer les styles des sections html
  * Ajout d'une feuille de style globale à l'application pour les styles customisés
  * Création d'un composant pour la section fil d'Arianne
  * Ajout du menu de navigation principal
  * Création de différentes pages statiques

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
