# Userscript WikiMasters — rangement des cartes

Userscript Tampermonkey (Chrome) qui étiquette par domaine les cartes de la page Collection de wiki-masters.com. La personne y joue (~3 200 cartes) et installe elle-même `dist/wikimasters-rangement.user.js`. Avec elle : français, tutoiement, ton direct.

- `src/regles.js` : listes de mots par domaine et moteur `classer`. La personne édite ce fichier elle-même (mode d'emploi en tête) : garde les listes lisibles par elle.
- `src/app.js` : automatisation de la page Collection, modes Ranger et Migration, panneau.
- Le build enveloppe les deux dans une seule IIFE, `regles.js` d'abord : `app.js` utilise `DOMAINES`, `classer`… sans import.

## Lire avant d'agir

- **Concevoir ou relire** un changement → `CODING_STANDARDS.md`. Sa règle 1 tranche toute idée de raccourci : on écrit sur le compte uniquement par les boutons du site, l'API sert à lire.
- **Automatisation du site** (sélecteurs, attentes, pagination, API, Chrome de la personne) → `docs/wikimasters.md`. Un comportement nouveau du site s'y note **et** se rejoue dans `test/faux-site.js`.
- **Tests** (écrire, réparer, faux site, mutations) → `docs/tests.md`.
- **Reprise de session** → `HANDOFF.md` : état, prochaine étape, points ouverts.

## Changer le code

- Carte mal classée → son cas réel (titre, description, étiquettes attendues) entre d'abord dans `test/classement.test.js`, puis la règle.
- Bug corrigé → un test rouge sans la correction, puis sa mutation dans `scripts/regressions.py`.
- Livrer : `npm version patch --no-git-tag-version`, `npm run build`, commit, amener le commit sur `main` (avance rapide depuis la branche de travail, accord permanent de la personne : c'est `main` qu'elle regarde sur GitHub), puis envoyer `dist/wikimasters-rangement.user.js` à la personne.
- Un build vert compte seulement si la sortie de `node --test` affiche `# tests N` avec N > 0 : sans fichier de test, il sort vert quand même.

## Sauvegarde

Le disque de travail peut être effacé sans prévenir (c'est déjà arrivé). La copie durable est GitHub : `matteo-lorenzi/wikimasters-rangement`, branche `main`. Chaque commit est poussé tout de suite ; un travail qui n'existe qu'en local est un travail qu'on peut perdre.

Dépôt absent au démarrage → le cloner, puis `npm install`.
