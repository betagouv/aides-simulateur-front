# aides-simulateur-front

Interface graphique du simulateur aides-simplifiées.

## Pré-requis

L'application `aides-simulateur-front` nécessite en particulier cet environnement :

* [Node.js](https://nodejs.org/fr) : environnement d'exécution JavaScript (version 22)

Pour la gestion des évolutions de l'ensemble des dépendances, nous utilisons en particulier :

* [NVM](https://github.com/nvm-sh/nvm) pour la gestion de évolutions de versions de Node.js (conseillé)
* [PNPM](https://pnpm.io/fr/) pour la gestion des évolutions des dépendances (fortement conseillé)

## Installation des dépendances

Parmi les dépendances structurantes de l'application, il y a :
* [Nuxt.js](https://nuxt.com) : framework [Vue.js](https://fr.vuejs.org) ([documentation](https://nuxt.com/docs/getting-started/introduction))
* [Pinia](https://pinia.vuejs.org) : librairie officielle de gestion de store Vue.js (pour le partage d'état entre pages de l'application)
* [VueDsfr](https://vue-ds.fr) : bibliothèque de composants du système de design de l'État français ([documentation](https://vue-dsfr.netlify.app))

Pour installer l'ensemble des librairies dont dépend `aides-simulateur-front`, exécuter la commande suivante dans un terminal shell :

```bash
# si npm
npm install

# si pnpm
pnpm install
```
## Vue-dsfr

Pour pouvoir exécuter le script `icons`, exécuter la commande suivante dans un terminal shell :

```bash
# si npm
npm i -g @gouvminint/vue-dsfr

# si pnpm
pnpm i -g @gouvminint/vue-dsfr
```

## Lancer nuxt en mode développement

Démarre le serveur sur `http://localhost:3000`·:

```bash
# npm
npm run dev

# pnpm
pnpm run dev
```

## Générer le code de production

Génère le code de production de l'application :

```bash
# npm
npm run build

# pnpm
pnpm run build
```

Prévisualisation du code de prod (nécessite un build préalable) :

```bash
# npm
npm run preview

# pnpm
pnpm run preview
```

## Tests

Le projet est testé avec deux outils principaux :
* [Vitest](https://vitest.dev) pour les tests unitaires
* [Playwright](https://playwright.dev) pour les tests end-to-end

### Installation des dépendances de test

Pour Playwright, vous devez installer les navigateurs nécessaires après l'installation des dépendances :

```bash
# npm
npx playwright install

# pnpm
pnpx playwright install
```

### Exécution des tests

**Attention, les tests e2e nécessitent que le serveur de développement soit lancé avec `pnpm run dev` ou `npm run dev`.**

Pour lancer tous les tests (unitaires et e2e) :

```bash
# npm
npm run test

# pnpm
pnpm run test
```

Pour exécuter uniquement les tests unitaires :

```bash
# npm
npm run test:unit

# pnpm
pnpm run test:unit
```

Pour exécuter uniquement les tests end-to-end :

```bash
# npm
npm run test:e2e

# pnpm
pnpm run test:e2e
```

Pour générer et consulter un rapport des tests e2e :

```bash
# Générer le rapport
npm run e2e:report
# ou
pnpm run e2e:report

# Afficher le rapport dans un navigateur
npm run e2e:web
# ou
pnpm run e2e:web
```

## FAQ

**En mode développement, un type n'est pas reconnu, que faire ?**

Regénérer la configuration, des références en particulier, avec `npx nuxi prepare` ou `pnpx nuxi prepare`.
