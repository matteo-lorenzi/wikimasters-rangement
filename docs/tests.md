# Tests

`npm test` lance `node --test` sur les `test/**/*.test.js` seulement (sans ce motif, les fichiers d'aide comme `faux-site.js` comptent chacun pour un test, et `# tests N` reste au-dessus de 0 même sans vrai test). `build.sh` refuse un build où aucun test n'a tourné. La CI (`.github/workflows/tests.yml`) lance `npm run build` à chaque push ; les mutations complètes se lancent à la main depuis l'onglet Actions (Tests → Run workflow). Une modification est prouvée quand le test concerné passe au rouge sans elle et au vert avec.

`test/charger.js` charge les sources comme le build ; la variable `WMR_SRC` lui fait lire une autre copie de `src/` (c'est ce qu'utilise `scripts/regressions.py`).

## `test/classement.test.js` — le moteur de `src/regles.js`

Des cas **réels** : description de carte → étiquettes attendues (51 cartes de la collection, lues le 2026-10-12 ; les cas d'origine ont été perdus). Les étiquettes attendues sont écrites d'après ce que la carte est, jamais recopiées du moteur. Chaque piège connu y a son cas :
- golfe ≠ golf, « facteurs » ≠ acteur, romane ≠ roman, partie ≠ parti ;
- faute du site « stréréoisomères » ;
- trait d'union (« Saint-Palais » ≠ saint) et Géographie seulement en premier ;
- collection ★Village Polonais ;
- carte sans description, lue par son titre (parenthèse d'abord : « Cherry (film, 2021) ») ;
- mot ambigu seul → `!À traiter` ; page d'homonymie, liste, prénom → ignorées.

Le script se charge dans un contexte `vm` séparé : recopier ses tableaux (`[...x]`) avant `deepEqual`, sinon la comparaison échoue sur le prototype.

## `test/faux-site.js` — le site simulé

Une page jsdom qui rejoue **chaque piège** de `docs/wikimasters.md` et l'API via un `window.fetch` simulé :
pagination tardive et au total faux (pages fantômes), absente sur une vue d'une page ; « Chargement… » ; cartes sans `p` ; « #Nom (n) » dans le filtre ; barre de recherche (sous-chaîne sans casse ni accents, même valeur = rien ne part) ; mode sélection, calque `ring-4`, « Tout sélectionner (page) », sélection perdue au changement de page ; fenêtre « Appliquer une étiquette » avec bilan et « Terminé », qui se ferme seule ou non, bandeau à croix « Fermer » ; retour en page 1 ; `confirm` natif ; fiche ouverte hors sélection et « Défausser » (notés dans `site.actions` pour vérifier qu'ils n'arrivent jamais).

Options de panne : `echecsPose` (« Impossible d'appliquer l'étiquette »), `chargementsEnEchec` (« Le chargement de la collection a échoué »), `echecsRecherche` (les N premières recherches ratées), `recherchesImpossibles`, `menuTardif` (menu des étiquettes vide juste après l'ouverture), `apiEchecs` (les N premières requêtes en 500), `apiEnPanne`, `apiIllisible`, `messageConfirm`. Le faux site note aussi chaque clic de sélection (`clic`) et compte ses chargements de liste (`site.chargements()`).

**Rechargement de la page** : le script appelle `window.__WMR_RECHARGER__` au lieu de `location.reload()` (absent de jsdom). Le faux site ouvre alors une nouvelle page sur le même compte, recopie le `localStorage` et monte le panneau, comme le ferait la surveillance d'URL. `site.window`, `site.document` et `site.wmr` désignent toujours la page ouverte ; `site.rechargements()` les compte.

- Le script est chargé avec `window.__WMR_TEST__ = true` (expose `window.__WMR`, coupe la surveillance d'URL) et `window.__WMR_ECHELLE__ = 0.02` (toutes les attentes × 0,02).
- jsdom n'a pas `innerText` : le faux site le remplace (texte visible, un saut de ligne après chaque bloc). Il n'applique pas le CSS des shadow roots : vérifier l'affichage du panneau par `style.display`.

## `test/page.test.js` — l'automatisation sur le faux site

Couvre : panneau ouvrir/fermer ; lecture (pagination tardive, pages fantômes, cartes sans `p`, chargement en échec) ; filtre avec compteur dans le libellé (le menu n'est pas rouvert) ; bilan « Terminé », fenêtre qui se ferme seule ou non ; pose refusée une fois (réessai) ou deux (arrêt rapide) ; étiquette créée ; retour en page 1 ; Ranger dans « Sans étiquette » en ≤ 2 changements de page ; lecture API complète, incrémentale, et repli sur l'écran si l'API est illisible ; erreur API passagère réessayée ; panne prolongée → rechargement et relecture ; raté pendant le rangement → rechargement, reprise, rien de perdu ; ratés à répétition → 3 rechargements puis arrêt ; ratés espacés avec du progrès entre deux → la séance va au bout ; recherche ratée → relancée sur place, ou abandonnée et notée ; menu des étiquettes vide après l'ouverture ; sélection en peu de clics (tout cocher puis décocher) ; journal des bugs (contenu, vider) ; **Ranger sur un gros stock** (recherches groupées, intrus jamais cochés, recherche vidée à la fin) ; suppression avec `confirm` accepté et refusé.

## `scripts/regressions.py` — les bugs déjà livrés

`python scripts/regressions.py` réintroduit chaque bug passé, un à la fois, dans une copie des sources, lance les tests, et exige qu'ils le **détectent** (rouge). Les 15 actuels :
1. carte sans `p` ignorée ;
2. « Terminé » non géré ;
3. compteur « (n) » gardé dans le libellé du filtre ;
4. arrêt quand la page change après un étiquetage ;
5. panneau `hidden` annulé par le CSS ;
6. rangement fait dans « Toutes les étiquettes » au lieu de « Sans étiquette » ;
7. lecture qui suit le total de pages annoncé ;
8. pose refusée par le site : 90 s d'attente puis message trompeur ;
9. chargement raté pris pour la fin de la vue ;
10. pose réussie oubliée quand la liste ne se recharge pas ensuite ;
11. reprise après rechargement qui oublie ce qui était déjà posé ;
12. rechargements comptés sur toute la séance, même quand des cartes sont rangées entre deux ;
13. recherche ratée par le serveur : pas de relance sur place ;
14. menu des étiquettes encore vide : options pas attendues ;
15. « Tout sélectionner (page) » sans décocher les cartes en trop.

Un nouveau bug corrigé y ajoute sa mutation. Quand le code autour change, une mutation dont le texte n'est plus trouvé est signalée « à mettre à jour » et compte comme ratée ; `build.sh` le vérifie à chaque build (`--ancres`, instantané).

Pour rejouer une seule mutation (après avoir durci son test) : `python scripts/regressions.py <bout du nom>`.
