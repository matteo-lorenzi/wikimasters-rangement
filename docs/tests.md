# Tests

`npm test` lance `node --test` sur les `test/**/*.test.js` seulement (sans ce motif, les fichiers d'aide comme `faux-site.js` comptent chacun pour un test, et `# tests N` reste au-dessus de 0 même sans vrai test). `build.sh` refuse un build où aucun test n'a tourné. La CI (`.github/workflows/tests.yml`) lance `npm run build` à chaque push ; les mutations complètes se lancent à la main depuis l'onglet Actions (Tests → Run workflow). Une modification est prouvée quand le test concerné passe au rouge sans elle et au vert avec.

`test/charger.js` charge les sources comme le build ; la variable `WMR_SRC` lui fait lire une autre copie de `src/` (c'est ce qu'utilise `scripts/regressions.py`).

## `test/classement.test.js` — le moteur de `src/regles.js`

Des cas **réels** : description de carte → étiquettes attendues (51 cartes de la collection, lues le 2026-10-12 ; les cas d'origine ont été perdus ; puis une carte par groupe de mots ajouté lors des tours de Suggestions du 2026-10-13, et les cartes des mots refusés, qui doivent rester sans règle). Les étiquettes attendues sont écrites d'après ce que la carte est, jamais recopiées du moteur. Chaque piège connu y a son cas :
- golfe ≠ golf, « facteurs » ≠ acteur, romane ≠ roman, partie ≠ parti ;
- faute du site « stréréoisomères » ;
- trait d'union (« Saint-Palais » ≠ saint) et Géographie seulement en premier ;
- collection ★Village Polonais ;
- carte sans description, lue par son titre (parenthèse d'abord : « Cherry (film, 2021) ») ;
- mot ambigu seul → `!À traiter` ; page d'homonymie, liste, prénom → ignorées, même avec un mot ambigu (« liste d'un projet Wikimedia ») ;
- titre en secours : description sans domaine → le titre range la carte (« Cour d'appel de Besançon — service de l'État français »), mais jamais une page à ignorer ni une carte dont la description a déjà un domaine ;
- 5e tour (2026-10-23) : saisons sportives (`saison 19*`, `saison 20*` ; « Saison 3 de Dark » reste Cinéma & TV) ; `politique dans` / `politique en` (« Politique environnementale », « Politique » seul : sans règle) ; **motifs de titre** `MOTIFS_DE_TITRE` : « Famille <nom> » → Histoire (garde-fous : « Famille de plantes » et « Famille de coléoptères » restent en Nature grâce à `sauf`, « Famille » seul, « La famille Addams » et « Famille (biologie) » non touchés, page à ignorer ou description avec domaine l'emportent) ; « … (groupe) » → Musique (« Cuivre (groupe 11) » et « Bôa — groupe britannique » restent ambigus).

Lot 4 de la phase 3 (2026-10-24) : **D1** ajoute des cas de DESCRIPTION (la collection entière, pas seulement les phrases Wikipédia) pour chaque mot ajouté par C1, C2 et C3 : le sens voulu ET le piège (« Europe à géométrie variable », « fonds documentaire de la bibliothèque », « oiseau grimpeur », « patrouilleur de la police municipale », « franchise professionnelle de restauration rapide » ne rangent plus comme leurs mots). Deux limites connues y sont figées (« émir du Qatar » en Histoire, « archée selon Paracelse » en Nature). **D2** : les phrases Wikipédia de `MOTS_FAIBLES` (Kickoff, Valeur temps de l'argent, Hikaitaan…), le fait que les descriptions n'y sont jamais soumises, et le test que chaque mot faible existe dans `DOMAINES`.

Navigateur (2026-10-23) : « navigateur » est ambigu (marin, explorateur ou navigateur web) ; « navigateur suisse » (Pierre Fehlmann) reste `!À traiter`, « navigateur web » en Sciences, « navigateur sportif » en Sport, « navigateur et explorateur » en Histoire.

Un test lit aussi les sources : chaque constante de `regles.js` qui change le classement doit figurer dans la liste de `EMPREINTE_REGLES` (`app.js`), sinon Ranger ne saurait pas que les règles ont changé. Seules `PAS_SUGGERER` (Suggestions seulement) et `INDEX` (dérivée) en sont exemptées. `REGLAGES` (les nombres de la lecture Wikipédia, `regles.js`) y figure donc : changer un réglage fait relire toutes les cartes sans étiquette, voulu. Un second test exige que l'empreinte contienne aussi le code qui décide du classement d'après Wikipédia (`morceauWikipedia`, `finDePhrase`, `planAvecPhrase`, `concerneeWiki`, `WIKI_EST`, `WIKI_ADJECTIFS`, `WIKI_ABREVIATIONS`), et un troisième que `app.js` lit chaque réglage dans `REGLAGES.wikipedia` (`WIKI.lot`, `WIKI.pauseMs`…) au lieu d'un nombre écrit en dur, avec les valeurs d'origine.

Le script se charge dans un contexte `vm` séparé : recopier ses tableaux (`[...x]`) avant `deepEqual`, sinon la comparaison échoue sur le prototype.

## `test/faux-site.js` — le site simulé

Une page jsdom qui rejoue **chaque piège** de `docs/wikimasters.md` et l'API via un `window.fetch` simulé :
pagination tardive et au total faux (pages fantômes), absente sur une vue d'une page ; « Chargement… » ; cartes sans `p` ; « #Nom (n) » dans le filtre ; barre de recherche (sous-chaîne sans casse ni accents, même valeur = rien ne part) ; mode sélection, calque `ring-4`, « Tout sélectionner (page) », sélection perdue au changement de page ; fenêtre « Appliquer une étiquette » avec bilan et « Terminé », qui se ferme seule ou non, bandeau à croix « Fermer » ; retour en page 1 ; `confirm` natif ; fiche ouverte hors sélection et « Défausser » (notés dans `site.actions` pour vérifier qu'ils n'arrivent jamais).

Options de panne : `echecsPose` (« Impossible d'appliquer l'étiquette »), `chargementsEnEchec` (« Le chargement de la collection a échoué »), `echecsRecherche` (les N premières recherches ratées), `recherchesImpossibles`, `menuTardif` (menu des étiquettes vide juste après l'ouverture), `apiEchecs` (les N premières requêtes en 500), `apiEnPanne`, `apiIllisible`, `messageConfirm`. Le faux site note aussi chaque clic de sélection (`clic`) et compte ses chargements de liste (`site.chargements()`).

**Faux Wikipédia** (option `wikipedia`) : `window.fetch` répond aux URL qui contiennent `wikipedia.org/w/api.php`, comme l'API réelle (`docs/wikimasters.md`, « API de Wikipédia »). Options : `articles` (`{ titre: introduction }`), `homonymies`, `redirections`, `disparus` (le titre disparaît de la réponse à sa 1re demande), `bloque` (l'appel est refusé par le navigateur : `fetch` lève une `TypeError`), `statutHttp` (429, 503…), `rechargerApres` (la page est rechargée après la N-ième requête, comme un F5). Pièges rejoués : 20 extraits au plus par requête (au-delà, la page revient sans `extract` ni `missing`), première lettre mise en majuscule (`normalized`), redirections, `missing`, `pageprops.disambiguation`, extrait coupé à 500 caractères avec « ... ». `site.wikipedia()` donne les requêtes faites (`titres`, `methode`, `simultanees`), `site.titresWikipedia()` tous les titres demandés, d'une page à l'autre.

**Rechargement de la page** : le script appelle `window.__WMR_RECHARGER__` au lieu de `location.reload()` (absent de jsdom). Le faux site ouvre alors une nouvelle page sur le même compte, recopie le `localStorage` et monte le panneau, comme le ferait la surveillance d'URL. `site.window`, `site.document` et `site.wmr` désignent toujours la page ouverte ; `site.rechargements()` les compte.

- Le script est chargé avec `window.__WMR_TEST__ = true` (expose `window.__WMR`, coupe la surveillance d'URL) et `window.__WMR_ECHELLE__ = 0.02` (toutes les attentes × 0,02).
- jsdom n'a pas `innerText` : le faux site le remplace (texte visible, un saut de ligne après chaque bloc). Il n'applique pas le CSS des shadow roots : vérifier l'affichage du panneau par `style.display`.

## `test/page.test.js` — l'automatisation sur le faux site

Couvre : panneau ouvrir/fermer ; lecture (pagination tardive, pages fantômes, cartes sans `p`, chargement en échec) ; filtre avec compteur dans le libellé (le menu n'est pas rouvert) ; bilan « Terminé », fenêtre qui se ferme seule ou non ; pose lente (« Terminé » après ~50 s, pas pris pour un refus) ; pose refusée une fois (réessai) ou deux (arrêt rapide) ; étiquette créée ; retour en page 1 ; Ranger dans « Sans étiquette » en ≤ 2 changements de page ; lecture API complète, incrémentale (toutes les cartes relues si les règles ont changé), et repli sur l'écran si l'API est illisible ; erreur API passagère réessayée ; panne prolongée → rechargement et relecture ; raté pendant le rangement → rechargement, reprise, rien de perdu ; ratés à répétition → 3 rechargements puis arrêt ; ratés espacés avec du progrès entre deux → la séance va au bout ; recherche ratée → relancée sur place, ou abandonnée et notée ; menu des étiquettes vide après l'ouverture ; sélection en peu de clics (tout cocher puis décocher) ; journal des bugs (contenu, vider) ; rapport de Migration (étiquette de métier ou de lieu supprimable dès que ses cartes ont son domaine, nationalité seulement avec son mot sur la carte) ; **Ranger et `!À traiter`** (60 cartes sur 2 pages, une avec `!À garder`, une encore ambiguë : domaine posé puis retrait dans cet ordre, jamais une autre étiquette retirée, raté en plein retrait → rechargement et reprise, aperçu sans bouton quand rien n'est rangeable) ; **Ranger sur un gros stock** (recherches groupées, intrus jamais cochés, recherche vidée à la fin) ; **Compléter les cartes rangées** (60 cartes #Sport qui gagnent Musique sur 2 pages de vue, carte déjà complète jamais cochée, plafond de 5 domaines, aucun retrait et `!À vendre` intacte, carte sans étiquette ou sans domaine intacte, aperçu groupé « + #Musique : 61 cartes » avant tout « Appliquer », rien à faire → pas de bouton, raté en plein travail → rechargement, reprise et aucune carte cochée deux fois) ; suppression avec `confirm` accepté et refusé ; **Ranger et Wikipédia** (v1.10, tests « Wikipédia … » : 45 titres en lots de 20, en série, chacun une fois ; titre disparu remis dans la file ; cache (2e Ranger sans requête, 30 jours, NFC, forme des entrées) ; rechargement en plein milieu de la lecture ou de l'application sans rien relire ; essai de 40 cartes et choix mémorisé ; cartes laissées de côté relues une fois la case décochée ou le script mis à jour ; appel bloqué ou en 503 → message, journal des bugs, Ranger continue ; extraction du morceau (sorcière, chirurgien, monoplace, « c. », « av. », pas de « est un », trop loin, homonymie, absent, minuscule, redirection) ; seules les cartes concernées sont envoyées ; aperçu « Classées d'après Wikipédia » ; mots manquants (lecture complète à jour ou périmée, cartes du lot, « nouvelle étiquette ? ») ; aucune écriture avant « Appliquer »).

## Mesure Wikipédia — `test/rapport.test.js`, `npm run essai`

Diagnostic seulement : rien du classement, de la lecture ni de l'écriture ne dépend de la mesure.

**Dans le navigateur.** À chaque Ranger où Wikipédia a tourné (au moins une carte lue, cache compris), le script écrit le rapport sous `wmr_wp_rapport` (écrasé à chaque fois ; un Ranger sans carte concernée n'y touche pas). L'aperçu montre le groupe « Mesure Wikipédia » : nombre de cartes par cause, couverture, et le bouton « Copier le rapport Wikipédia (JSON) ». La personne colle ce JSON dans la conversation ; Claude le range dans `resultats/rapport-wikipedia.json` et lance `npm run essai`.

Format (`format: 1`) : l'en-tête indenté, puis **une ligne par carte** concernée (un exemplaire en double : une seule ligne).

```json
{ "outil": "wmr-rapport-wikipedia", "format": 1, "version": "1.9.11", "date": "2026-10-23T15:00:00.000Z", "essai": true,
  "dureeMs": 2140, "requetes": 1, "lots": [{ "titres": 8, "ms": 1120, "ok": true }], "erreurs": [], "concernees": 9, "lues": 8,
  "bilan": { "parCause": { "classee": 2, … }, "couverture": { "classees": 2, "lues": 8, "taux": 0.25 }, "precision": null },
  "cartes": [
  {"titre":"Pierre F.","rarete":"C","etape":"cache","phrase":"navigateur suisse…","cause":"phrase-ambigue","domaines":[],"mots":["navigateur"],"redirection":"Pierre Fehlmann"},
  {"titre":"Bourboulon","rarete":"C","etape":"reseau","cause":"pas-de-est-un","domaines":[],"extrait":"Le nom propre Bourboulon…"} ] }
```

- `requetes` : appels `fetch` (réessais 429/5xx compris) ; `lots` : un par requête de 20 titres au plus, `ok: false` pour celui qui a échoué ; `erreurs` : le message de l'appel bloqué ou en erreur.
- `etape` : `reseau` (lu pendant ce Ranger), `cache` (déjà connu), `appel-bloque` (à lire, mais l'appel a échoué avant), `non-lue-essai` (hors des 40 de l'essai).
- `cause` : `classee` ; `titre-absent` (pas d'article, ou titre impossible à demander : vide ou avec `|`) ; `homonymie` ; `extrait-vide-ou-stub` (pas de « est un », extrait vide, réduit au titre comme « Hanabie. », ou de moins de 4 mots) ; `pas-de-est-un` (extrait plus long sans « est un/une/le/la » ni, à défaut, « était / fut / sont / a été / forment / constituent / désigne » + article, ou « est / sont l'une des », dans les ~300 premiers caractères : `WIKI_EST_ELARGI`, C1) ; `page-ignoree` (C4 : page de dates, « Cette page concerne l'année… », « 291e jour de l'année… », titre « 1869 en France » ou « 18 octobre 1965 » ; sortie du dénominateur de la couverture comme `non-lue-essai` : changement de MESURE, pas de classement ; `npm run essai` imprime alors « Couverture brute » en plus) ; `phrase-sans-regle` (le moteur ne trouve aucun domaine dans la phrase, ou n'y voit qu'une page à ignorer) ; `phrase-ambigue` (seul un mot ambigu : `!À traiter`) ; `non-lue-essai` ; `appel-bloque`. `redirection` fait partie de la liste mais n'est jamais une cause : une redirection est un chemin, pas un résultat ; la cible est donnée dans le champ `redirection` de la carte, quel que soit son résultat.
- `phrase` : le morceau lu (250 caractères au plus) ; `extrait` : l'extrait (500 caractères au plus, `REGLAGES.wikipedia.extrait` ; 250 avant la prochaine version) quand il n'y a pas de phrase ; `domaines` : ceux que Ranger proposera (seulement si `classee`) ; `mots` : `classer(...).mots`, les mots du moteur qui ont déclenché.
- `bilan` : nombre par cause, couverture et précision (voir `GLOSSARY.md`) ; `precision` vaut `null` dans le navigateur (pas d'étiquettes de vérité).

**Hors navigateur : `npm run essai [rapport.json] [--verite fichier] [--sortie dossier]`** (`scripts/essai-wikipedia.js`, Node seul, sans réseau ni dépendance). Il charge le userscript dans un contexte `vm` comme `test/charger.js` (`WMR_SRC` respecté) et rejoue le **moteur actuel** sur la phrase de chaque carte ; une carte sans phrase mais avec un `extrait` est rejouée par `morceauWikipedia` (on mesure donc un gain d'extraction hors navigateur) ; une carte sans phrase ni extrait garde la cause du rapport. Un rapport dont les extraits sont coupés à 250 caractères (ancien format, 89 cartes dans celui du 2026-10-24) fait écrire un `avertissements` dans le résultat et une ligne « Attention : extraits coupés à 250 caractères dans ce rapport » : le rejeu d'extraction y est incomplet. Rapport par défaut : `resultats/rapport-wikipedia.json`, et s'il n'existe pas, la référence elle-même. Vérité par défaut : `test/reference-wikipedia.json` (190 cartes depuis le lot 3 de la phase 3 — C1 : 60, C2 : 20, C3 : 6 cartes ajoutées —, dont au départ 104 : 23 cartes réelles de l'essai du 2026-10-23, 60 cartes classées tirées au hasard, graine 24, du rapport du 2026-10-24, puis 18 cartes de la phase 3 ajoutées avec leur correction (P3 : 11, P2 : 7), avec leur phrase, leurs domaines `attendu` et `acceptables` — jugement de Claude, à valider par la personne — plus Hanabie., une homonymie et un titre absent, sans classement attendu). **Garde-fou** : quand le rapport est la référence elle-même, l'essai sort en code 1 si la précision est sous `REGLAGES.wikipedia.precisionMinimale` (`src/regles.js`, `--minimum 0.9` pour l'essayer autrement), et un test de `rapport.test.js` l'exige aussi. Le minimum est la précision atteinte arrondie vers le bas (0,83 au départ : 69 justes sur 83 ; 0,95 après P2 : 89 sur 93), **relevé à chaque tâche** qui améliore la précision, jusqu'à 0,95 ; il ne baisse que si la personne change un jugement de la référence. Une carte classée est **juste** si au moins un domaine de `attendu` est proposé et aucun domaine hors de `attendu` et `acceptables` ; `attendu: []` : rien ne doit être proposé. Il écrit `resultats/essai-<AAAA-MM-JJ-HHMM>.json` (même forme, plus `fausses` avec `motsResponsables` — les mots qui donnent un domaine non attendu —, `avant` sur une carte dont le résultat a changé depuis le rapport, `dureeEssaiMs`) et imprime un résumé en français. `resultats/*.json` est ignoré par git, sauf `resultats/exemple.json`.

Tests (`test/rapport.test.js`) : chaque cause du faux Wikipédia (titre absent, homonymie, Hanabie., pas de « est un », phrase classée, sans règle, ambiguë, redirection), étapes `reseau`/`cache`/`non-lue-essai`/`appel-bloque`, le bouton Copier, une ligne par carte, et `scripts/essai-wikipedia.js` sur `resultats/exemple.json` (couverture 2/8, précision 1/2 avec une petite vérité) et sur la référence.

## `test/suggestions.test.js` — le bouton « Suggestions »

Le calcul (`suggestions`) sur une petite collection inventée : compteur des cartes sans domaine (`!À traiter` à part), mots inconnus des règles à partir de 3 cartes, sans mots vides, pays, nationalités ni mots refusés (`PAS_SUGGERER` ; un test par date de refus : 2026-10-14 et 2026-10-23) ni expressions déjà couvertes par un mot ; domaine proposé à 70 % des cartes étiquetées ; « nouvelle étiquette ? » à 30 cartes. Puis le panneau : lecture par l'API seulement (aucun clic sur la page), texte à copier pour Claude, toutes les cartes à revoir (sans règle, mot ambigu seul) à copier aussi, lecture gardée qui devient périmée après un Ranger (« Relire (recommandé) »).

## `scripts/regressions.py` — les bugs déjà livrés

`python scripts/regressions.py` lance d'abord toute la suite sur les sources intactes, puis réintroduit chaque bug passé, un à la fois, dans une copie des sources, lance **seulement le test qui le surveille** (`--test-name-pattern`), et exige qu'il le **détecte** (rouge). Environ 3 minutes. Les 83 actuels (du 32 au 83, ceux de la phase 3) :
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
15. « Tout sélectionner (page) » sans décocher les cartes en trop ;
16. règles changées depuis le dernier rangement : Ranger ne relit que les nouvelles cartes (186 cartes rangeables jamais relues, 2026-10-13);
17. Compléter : plus de 5 domaines sur une carte ;
18. Compléter : reprise après rechargement qui oublie ce qui était déjà posé ;
19. Wikipédia : titre disparu de la réponse non remis dans la file ;
20. Wikipédia : cache ignoré, tout relu à chaque Ranger ;
21. Wikipédia : lots de 50 titres au lieu de 20 ;
22. Wikipédia : page d'homonymie lue comme un résumé ;
23. Wikipédia : essai de 40 cartes ignoré ;
24. Wikipédia bloquée : Ranger s'arrête au lieu de continuer sans Wikipédia ;
25. Wikipédia : cartes laissées de côté par l'essai oubliées ;
26. Suggestions : un exemplaire en double compte pour deux cartes ;
27. Mesure Wikipédia : phrase ambiguë notée comme phrase sans règle ;
28. Mesure Wikipédia : jugement sans la condition « aucun domaine non attendu » (un domaine en trop jugé juste) ;
29. Mesure Wikipédia : construction du rapport sans protection, Ranger s'arrête ;
30. Mesure Wikipédia : affichage du rapport sans protection, aperçu perdu ;
31. Mesure Wikipédia : mesure sans protection pendant la lecture, Ranger s'arrête ;
32. Wikipédia : l'extraction du morceau absente de l'empreinte des règles, les cartes déjà vues ne sont pas relues ;
33. Mesure Wikipédia : extrait du rapport coupé à 250 caractères au lieu de 500 ;
34-44. P3, corrections ciblées de mots (`PHRASES_NEUTRES` non appliquées et hors de l'empreinte, `presse` seul, `vitesse moto`, `paroisse civile`, `composition`, `historien de l'art`, `album de bande dessinée`, `concombre de mer`, tempête tropicale, `sociétés humaines`) ;
45-50. P1 : second domaine d'une phrase Wikipédia (`scanPhrase` non appliquée, premier domaine retiré, réglage `secondDomaineMots` ignoré, Ranger et mesure qui lisent la phrase comme une description, `vice-amiral`) ;
51-55. P2 : lieux génériques tardifs (`LIEUX_GENERIQUES` non appliquée, retirée aussi des descriptions, réglage `lieuGeneriqueMots` ignoré, hors de l'empreinte, détail tardif promu premier domaine). 56-59. R (lot 3) : « en général de brigade » neutralisé, `NEUTRES_SAUF_SUIVI_DE` hors de l'empreinte, « magnat de la presse », « presse sportive » ; 60-70. C1 : extraction élargie (article obligatoire, `\b` contre lettre accentuée, `WIKI_EST` prioritaire, `WIKI_EST_ELARGI` hors de l'empreinte) et 7 corrections de mots ; 71-79. C2 : une mutation par ligne de vocabulaire ; 80-81. C3 : genres musicaux et taxons ; 82-83. C4 : page de dates non rejouée dans le navigateur, pages de dates gardées au dénominateur. Les noms exacts sont dans `scripts/regressions.py`.

Un nouveau bug corrigé y ajoute sa mutation : `(nom, fichier, texte d'origine, texte fautif, test)`, où `test` est le début du nom du test qui passe au rouge. Choisir un test qui échoue **à coup sûr**, pas selon la charge de la machine : vérifier qu'il échoue lancé seul (`node --test --test-name-pattern="^début du nom"` avec `WMR_SRC` sur la copie mutée). Quand le code autour change, une mutation dont le texte n'est plus trouvé, ou dont le test a été renommé, est signalée « à mettre à jour » et compte comme ratée ; `build.sh` vérifie les textes à chaque build (`--ancres`, instantané).

Le script lit la sortie au format TAP (`--test-reporter=tap`) : depuis Node 23, `node --test` affiche par défaut `ℹ tests N` au lieu de `# tests N`.

Pour rejouer une seule mutation (après avoir durci son test) : `python scripts/regressions.py <bout du nom>`.
