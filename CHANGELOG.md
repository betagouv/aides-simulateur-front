# CHANGELOG

## 0.17.0 [#71](https://github.com/betagouv/aides-simulateur-front/pull/71)

* Amélioration du calcul.
* Détails :
  * Évite des valeurs à zéro pour garantie visale, locapass, aide mobilité parcoursup et aide mobilité master 1
  * Bouchonne des valeurs par défaut dans la requête à `aides-calculatrice-back` 
    * Ajoute une `nationalite` à `FR` pour activer `visale_eligibilite`
    * Ajoute `date_entree_logement` au mois suivant la simulation pour `locapass_eligibilite` 
    * Ajoute `annee_etude` à `master_1` si  `sortie_region_academique` choisi (L3 et M1 étaient possibles)
  * Injecte des valeurs par défaut par rapport à la situation de la personne à la requête `aides-calculatrice-back`
    * Ajoute `sortie_academie` si 'parcoursup-nouvelle-region' choisi (aide mobilité parcoursup) et `sortie_region_academique` si `master-nouvelle-zone` choisi (aide mobilité master 1)
    * Ajoute `bourse_lycee` à la place de `bourse_criteres_sociaux` si 'parcoursup-nouvelle-region' choisi

## 0.16.2 [#70](https://github.com/betagouv/aides-simulateur-front/pull/70)

* Ajout de fonctionnalités.
* Détail :
  * Répare le lien de retour aux résultat
  * Desactive le scroll du conteneur de question
  * Ne focus pas le bouton de lien vers une notion lors du rendu d'une * nouvelle question
  * Masque provisoirement l'accordéon "Comment avons-nous estimé ces aides ?"
  * Restore l'ancre vers le titre du simulateur
  * Ajoute un bandeau de warning à la page de résultats
  * Améliore l'affichage des états de chargement des résultats
  * Améliore l'expérience du scroll
  * Améliore le chargement des résultats transformés de la simulation
  * Modifications de styles mineures

## 0.16.1 [#69](https://github.com/betagouv/aides-simulateur-front/pull/69)

* Ajout de fonctionnalités.
* Détail :
  * Mise à jour du formulaire du simulateur demenagement-logement : ajout de personae et ajout de la question sur le logement conventionné

## 0.16.0 [#68](https://github.com/betagouv/aides-simulateur-front/pull/68)

* Ajout de fonctionnalités.
* Détail :
  * Minimise différents layout-shift
  * Optimise le chargement des pages de contenu
  * Permet d'afficher des textes de lois à l'utilisateur
  * Améliorations de styles

## 0.15.0 [#67](https://github.com/betagouv/aides-simulateur-front/pull/67)

* Ajout de fonctionnalités.
* Détail : 
  * Permet une interface admin lançant des tests sur les simulateurs : à partir de `demenagement-logement.json` et de sa clé "tests", permet à l'admin de lancer le test de son choix et de simuler le retour openfisca. L'admin peut aussi choisir de simuler les réponses de l'utlisateur en dehors d'un cas pré-défini
  * Auto-completion améliorée dans le moteur de recherche du code inseee 

## 0.14.4 [#64](https://github.com/betagouv/aides-simulateur-front/pull/64)

* Répare un bug
* Détail : 
  * Répare le nom de la variable openfisca pour les revenus du patrimoine

## 0.14.3 [#63](https://github.com/betagouv/aides-simulateur-front/pull/63)

* Ajout de fonctionnalités.
  * Détail : 
    * Ajoute un indicateur d'état du fetch des résultats de simulation
    * Utilise des boutons radios riches pour les questions avec radios
    * Ajoute un style customisé 'riche' pour les question avec checkbox
    * Améliore la navigation au clavier du formulaire

## 0.14.2 [#65](https://github.com/betagouv/aides-simulateur-front/pull/65)

* Ajout de fonctionnalités.
  * Détail : 
    * Ajout des clés : mobilite-master-1-eligibilite, mobilite-parcoursup-eligibilite, locapass-eligibilite dans beautify-results.ts

## 0.14.1 [#64](https://github.com/betagouv/aides-simulateur-front/pull/64)

* Mise à jour des contenus textuels de l'application (pages statiques, formulaire déménagement)

## 0.14.0 [#60](https://github.com/betagouv/aides-simulateur-front/pull/60)

* Ajout de fonctionnalités.
* Détail :
  * Renomme `client/utils/aides-mapping-ids.ts` en `client/utils/aides-mapping-inputs.ts`
  * Transcrit les valeurs énumérées du formulaire en énuméré pour `aides-calculatrice-back`
    * Évite les réponses `{ "error": ... }` de l'API web
    * Ajoute le mécanisme de fonction `dispatch` pour la transcription d'inputs complexes
    * Met à jour la configuration de la transcription dans `client/utils/aides-mapping-inputs.ts`
  * Définit les périodes de la requête à partir de la date du jour de la simulation
  * Construit le dictionnaire de résultats de simulation à partir de la réponse `aides-calculatrice-back`
    * Déduit `aide-personnalisee-logement-eligibilite` du montant d'`aide-personnalisee-logement`
  * Introduit `UnknownPeriodError` et `UnexpectedValueUpdateError`

## 0.13.0 [#32](https://github.com/betagouv/aides-simulateur-front/pull/32)

* Ajout de fonctionnalités.
* Détails :
  * Créé un store pour enregistrer les résultats d'une simulation
  * Navigue vers la page résultats lorsqu'un l'api back retourne un résultat valide
  * Dynamise la page de résultats avec les résultats enregistrés dans le store

### 0.12.2 [#61](https://github.com/betagouv/aides-simulateur-front/pull/61)

* Ajout de fonctionnalités.
* Détails :
  * Ajoute un écran de démarrage au formulaire

### 0.12.1 [#59](https://github.com/betagouv/aides-simulateur-front/pull/59)

* Amélioration de l'accessibilité
* Détails :
  * Améliore le contraste des sections
  * Améliore la hierarchie des titres
  * Améliore la navigation globale au clavier
  * Améliore la navigation au clavier du formulaire

## 0.12.0 [#58](https://github.com/betagouv/aides-simulateur-front/pull/58)

* Ajout de fonctionnalités.
* Détails :
  * Créé un store pour la gestion du fil d'arianne
  * Extrait le layout partagé par les pages de simulation vers un NuxtLayout
  * Rajoute l'écran de chargement du formulaire
  * Sert le script d'iframeresizer depuis l'application
  * Permet de reprendre son questionnaire directement selon certains chemins de navigation

## 0.11.0 [#57](https://github.com/betagouv/aides-simulateur-front/pull/57)

* Ajout d'une fonctionnalité.
* Détails :
  * Ajout d'un suivi détaillé des événements Matomo du type Survey["survey_id"]["utm_source"] : Inclusion de l'ID et de la source du simulateur dans le suivi des événements
  * Ajout du tracking du début de formulaire
  * Ajout du composant MatomoOptOut aux mises en page par défaut et iframe

## 0.10.0 [#53](https://github.com/betagouv/aides-simulateur-front/pull/53)

* Ajout d'une fonctionnalité.
* Détails :
  * Ajoute la notion de `question` posée par un simulateur
    * La liste des questions est temporairement figée dans `client/components/form/Survey.vue` 
  * Ajoute les questions à la requête à `aides-calculatrice-back`
    * Introduit le mapping des questions dans `client/utils/aides-mapping-questions.ts`
    * Met en forme le résultat pour le simulateur dans `client/utils/beautify-results.ts`

### 0.9.2 [#56](https://github.com/betagouv/aides-simulateur-front/pull/56)

* Corrections
* Détail :
  * Corrige le style des vues intégrées dans l'iframe
  * Met à jour le contenu de la page 'Intégrer nos simulateurs'

### 0.9.1 [#55](https://github.com/betagouv/aides-simulateur-front/pull/55)

* Amélioration de la partie admin
* Détail : 
  * Sécurité : requête POST au lieu de GET pour accéder à l'admin
  * Bouton de déconnexion et stockage dans la session du mdp

## 0.9.0 [#54](https://github.com/betagouv/aides-simulateur-front/pull/54)

* Ajout d'une mini-interface admin et amélioration des stats
* Détail : 
  * Amélioration des stats matomo : stockage des réponses aux questions des simulateurs
  * Stockage sous forme de json avec un timestamp dans le back-end lorsqu'un utilisateur complète un simulateur
  * Interface admin pour visualiser la liste de ces simulations

### 0.8.3 [#50](https://github.com/betagouv/aides-simulateur-front/pull/50)

* Refactorisations mineures
* Détail : 
  * Nettoyage du code inutile et formatage
  * Amélioration du style du formulaire
  * Gestion des types

## 0.8.2 [#49](https://github.com/betagouv/aides-simulateur-front/pull/49)

* Détail : 
  * Intégration de vue-matomo en tant que plugin

### 0.8.1 [#47](Refactor iframe integration page and add Matomo tracking #47)

* Détail : 
  * Intégration de la page iframe dans la page 
  * Ajout de vue-matomo
  
## 0.8.0 [#31](https://github.com/betagouv/aides-simulateur-front/pull/31)

* Mise à jour des dépendances, notamment critiques :
  ```json
    "@gouvfr/dsfr": "~1.13.0",
    "@gouvminint/vue-dsfr": "^8.3.0",
    "pinia": "^3.0.1",
    "@antfu/eslint-config": "^4.6.0",
  ```

## 0.7.0 [#30](https://github.com/betagouv/aides-simulateur-front/pull/30)

* Ajout de fonctionnalité.
* Détail :
  * Ajoute le calcul d'aide via requête à `aides-calculatrice-back` dans `client/utils/calculate-aides.ts`
  * Appelle l'API web openfisca du back dans `client/components/form/Survey.vue`
  * Configure la jonction entre le formulaire et la requête au back dans `client/utils/aides-mapping-ids.ts`
  * Initialise des classes d'erreurs dans `client/utils/errors.ts`
  * Définit les types propres à une requête openfisca dans `client/types/openfisca.ts`

### 0.6.1 [#46](https://github.com/betagouv/aides-simulateur-front/pull/46)

* Ajout de fonctionnalité
* Détail : 
  * Fix du background du formulaire en dark mode

## 0.6.0 [#45](https://github.com/betagouv/aides-simulateur-front/pull/45)

* Ajout de fonctionnalité
* Détail : 
  * Nouveaux types de questions possible dans le questionnaire : Number , Boolean
  * Possibilité d'autocompléter un code insee à partir d'un code postal (autocompleteFunctions)
  * Stockage de l'historique de navigation du formulaire et possibilité de retour en arrière
  * Possibilité de versionner les questionnaires 
  * Intégration de la version 1.0.0 du questionnaire "demenagement-logement"
  * Ecran permettant à l'utilisateur soit de reprendre le formulaire, soit de repartir à 0

### 0.5.1 [#44](https://github.com/betagouv/aides-simulateur-front/pull/44)

* Ajout de fonctionnalité
* Détail :
  * Répare les problèmes lié au chargement des pictogrammes via nuxt et la libraire @gouvfr/dsfr en plaçant tous les pictogrammes dans le dossier `/public`

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

### 0.3.2 [#26](https://github.com/betagouv/aides-simulateur-front/pull/26)

* Ajout de fonctionnalité
* Détail :
  * Ajout d'un bandeau d'information dans le layout principal pour informer l'utilisateur de l'état de développement du projet

### 0.3.1 [#25](https://github.com/betagouv/aides-simulateur-front/pull/25)

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
