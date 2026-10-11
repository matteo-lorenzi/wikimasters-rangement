# Tests

`npm test` lance `node --test`, qui prend tous les `test/*.test.js`. Une modification est prouvée quand le test concerné passe au rouge sans elle et au vert avec.

## `test/classement.test.js` — le moteur de `src/regles.js`

Des cas **réels** : description de carte → étiquettes attendues. Chaque piège connu y a son cas :
- golfe ≠ golf, partie ≠ parti, romane ≠ roman ;
- faute du site « stréréoisomères » ;
- carte sans description, lue par son titre (parenthèse d'abord : « Cherry (film, 2021) ») ;
- mot ambigu seul → `!À traiter` ; page d'homonymie → ignorée.

Le script se charge dans un contexte `vm` séparé : recopier ses tableaux (`[...x]`) avant `deepEqual`, sinon la comparaison échoue sur le prototype.

## `test/faux-site.js` — le site simulé

Une page jsdom qui rejoue **chaque piège** de `docs/wikimasters.md` (pagination tardive et fausse, cartes sans `p`, fenêtre « Terminé », retour en page 1, `confirm` natif…) et l'API via un `window.fetch` simulé.

- Charger le script avec `window.__WMR_TEST__ = true` (expose `window.__WMR`, coupe la surveillance d'URL) et `window.__WMR_ECHELLE__ = 0.02` (toutes les attentes × 0,02).
- jsdom n'a pas `innerText` : le polyfiller. Il n'applique pas le CSS des shadow roots : vérifier l'affichage du panneau par `style.display`.

## `test/page.test.js` — l'automatisation sur le faux site

Couvre : panneau ouvrir/fermer ; lecture (pagination tardive, pages fantômes, cartes sans `p`) ; filtre avec compteur dans le libellé ; bilan « Terminé » ; retour en page 1 ; rangement dans « Sans étiquette » en ≤ 2 changements de page ; lecture API complète et incrémentale ; suppression avec `confirm` accepté et refusé.

## `scripts/regressions.py` — les bugs déjà livrés

Réintroduit chaque bug passé, un à la fois, dans une copie des sources, lance les tests, et exige qu'ils le **détectent** (rouge). Les 7 actuels :
1. carte sans `p` ignorée ;
2. « Terminé » non géré ;
3. compteur « (n) » gardé dans le libellé du filtre ;
4. arrêt quand la page change après un étiquetage ;
5. panneau `hidden` annulé par le CSS ;
6. rangement fait dans « Toutes les étiquettes » au lieu de « Sans étiquette » ;
7. lecture qui suit le total de pages annoncé.

Un nouveau bug corrigé y ajoute sa mutation.
