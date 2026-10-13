# Passation — userscript WikiMasters

Mis à jour le 2026-10-13. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- **v1.9.3** (2026-10-13, à installer par la personne) : Ranger relit toutes les cartes sans étiquette quand les règles ont changé (empreinte `ranger_regles`) ; ~35 mots du 3e tour. v1.9.2 : règles enrichies d'après le 2e tour de Suggestions (voir plus bas). v1.9.1 : bouton « Suggestions » (voir Chantier plus bas).
- Premier tour de Suggestions (v1.9.0, 2026-10-13) : 826 sans étiquette = 577 sans règle, 0 à traiter, 235 ignorées, 14 rangeables ; 50 portent `!À traiter`. Seulement 3 mots à 5 cartes ou plus (france, politique, voie) : les cartes sans règle sont presque toutes isolées. Décidé avec la personne : `voie` → Géographie et `voie verte` → Transports ; `politique` refusé (dans `PAS_SUGGERER`) ; pays jamais proposés ; seuil abaissé à 3 cartes ; bouton « Copier les cartes sans règle » (v1.9.1) pour que Claude propose des règles aux cartes isolées ; les 235 ignorées restent sans étiquette (pas de `!Homonymie`).
- 2e tour (v1.9.1, 2026-10-13) : 826 sans étiquette = 572 sans règle, 235 ignorées, 19 rangeables ; 50 portent `!À traiter`. ~60 % des 572 n'ont **pas de description** (titre seul, souvent un nom propre) : aucune règle de mots ne les rangera. Décidé avec la personne (v1.9.2) :
  - **titre en secours** : si la description ne donne aucun domaine (et n'est pas une page à ignorer), le moteur lit aussi le titre ;
  - **« ignorée » passe avant « mot ambigu »** (« liste d'un projet Wikimedia » n'est plus `!À traiter`) ;
  - ~120 mots ajoutés aux 15 domaines (marqués « Suggestions du 2026-10-13 » dans `regles.js`), un cas réel par groupe dans `test/classement.test.js` ;
  - **mots risqués refusés** : date, conflit, industrie, commerce, justice, manifestation (cas « Friperie » et « 16 septembre » restent sans règle dans les tests).
- **Wikipédia pour les cartes sans description** (première phrase de l'article, « est un/une … », API publique en lecture seule) : accord de principe, **à reparler en détail avec la personne pour optimiser les appels** avant d'écrire quoi que ce soit.
- Effet de bord accepté par la personne (2026-10-13) : « Défilé de l'Écluse — défilé situé dans l'Ain, France » part en Transports (« écluse » dans le titre, lu en secours). Ne pas mettre « défilé » en Géographie (défilé de mode, défilé militaire).
- 3e tour (v1.9.2, 2026-10-13) : 875 sans étiquette = 449 sans règle, 240 ignorées, **186 rangeables jamais relues** (Ranger ne lisait que les nouvelles cartes : corrigé en v1.9.3, bug n° 16 de `regressions.py`) ; 50 portent `!À traiter`, dont 18 que les règles rangent maintenant. Les 449 sont presque toutes des titres seuls. Décidé avec la personne (v1.9.3) : ~35 mots (« 3e tour » dans `regles.js`), sauf « affection » et « barrage » (risqués) ; groupes de musique (« groupe britannique »…) laissés pour Wikipédia.
- **Wikipédia** : la personne veut en parler **quand il ne restera que des cartes dont le titre n'indique aucun domaine**.
- Prochaine étape : (1) la personne installe la v1.9.3 et lance Ranger (relit tout, une fois) ; (2) **retrait de `!À traiter`** : « Retirer l'étiquette » observé le 2026-10-13 (voir `docs/wikimasters.md`) ; reste à le rejouer dans le faux site et à coder (voir Chantier).
- Avant : **v1.8.4** (à installer par la personne ; v1.8.4 assouplit la suppression des anciennes étiquettes ; premier vrai rangement fait en v1.8.2, voir plus bas).
- Dépôt sur GitHub (`matteo-lorenzi/wikimasters-rangement`, branche `main`), copie durable.
- **Tests recréés** (`docs/tests.md`) : moteur sur 51 cartes réelles + pièges, faux site jsdom (rechargement de page compris), automatisation de la page, `scripts/regressions.py` (15 mutations, toutes détectées en v1.8.3 ; ~2 min 30, chaque mutation ne lance que son test).
- v1.8.2, demandé par la personne le 2026-10-12 :
  - **Journal des bugs** (bouton du panneau) : chaque erreur et chaque rechargement automatique y sont notés (version, message, état de la page, fin du journal) ; la personne le copie et le colle dans la conversation. Lire d'abord « Page : » et « Journal : ».
  - **Raté du site → rechargement et reprise** : erreur API passagère réessayée (3 essais) ; serveur toujours en erreur, chargement raté, pose refusée, page bloquée → la page est rechargée et l'étape (lecture ou application) reprend seule, 3 fois au plus. Ce qui est posé est enregistré au fil de l'eau (`ranger_fait`). La lecture par l'écran ne sert plus que si l'API répond dans un format inconnu.
- v1.8.1 :
  - **Ranger choisit sa stratégie** : à partir de 200 cartes à ranger, recherches groupées d'abord (piste 1, `docs/piste-1.md`), puis page par page ; en dessous, comme avant. Décidé avec la personne le 2026-10-12.
  - Pose refusée par le site (« Impossible d'appliquer l'étiquette ») : un réessai, puis arrêt avec un message clair.
  - Chargement raté (« Le chargement de la collection a échoué ») : arrêt avec un message, au lieu de prendre la liste vide pour la fin de la vue.
  - « Tout sélectionner (page) » quand toute la page est à poser.
- v1.8.3, d'après le premier journal des bugs de la personne (v1.8.2, 2026-10-12 : ~330 cartes rangées par recherche, puis arrêt après 3 rechargements) :
  - recherche ratée par le serveur → relancée sur place (`ALBUM`, puis `Album`) ; toujours ratée → mot abandonné (noté), ses cartes rangées page par page ; 3 abandons de suite → rechargement ;
  - la limite de 3 rechargements ne compte plus que les rechargements **de suite sans aucune pose** (plafond 20 par séance) ;
  - menu des étiquettes vide juste après un rechargement → le script attend ses options ;
  - sélection : plus de la moitié de la page à poser → « Tout sélectionner (page) » puis décocher le reste (demande de la personne) ; vérification carte par carte avant « Étiqueter ».
- Le 2026-10-12, 1 854 cartes sans étiquette, dont 1 112 rangeables (avant le premier vrai rangement).

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!Doublon`, `!À vendre`, `!À garder` (posées à la main), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- Nationalités et métiers précis → la barre de recherche du site, qui se combine avec le filtre d'étiquette ; pas d'étiquette.
- Plafond 30 étiquettes. Sans règle, la carte reste « Sans étiquette » : le script ne devine pas.
- Suppression des anciennes étiquettes (décidé le 2026-10-13, d'après le rapport de Migration) : une étiquette de métier ou de lieu (`d` non vide dans `ANCIENNES`) est supprimable dès que ses cartes ont son domaine, le détail se perd. Une nationalité (`d` vide) ou une étiquette non prévue exige toujours son mot dans le titre ou la description ; celles qui bloquent sont **gardées pour l'instant** (ex. `#Américain` 52/116, `#Français` 40/163, `#Anglais` 26/31), décision à reprendre plus tard avec la personne.

## Suite

1. **Migration faite** par la personne (2026-10-13, en v1.8.4).
2. **Chantier « moins de cartes sans étiquette »** (Suggestions livré ; tour en cours, voir État) (décidé avec la personne le 2026-10-13, détail plus bas) : Suggestions (v1.9.0-v1.9.1), puis retrait de `!À traiter`, puis « Compléter les cartes rangées ». Entre deux versions, un tour réel Suggestions → règles → Ranger pour voir l'effet sur le compteur.
3. Les **21 cartes « pas de domaine »** du rapport de Migration (Saison 2015 des Astros de Houston, McLaren MP4-28, Hippodrome de Dieppe, Borough de Denali, Stanley Benham, David B. Samadi, John L. Lewis, Raymond Montaner, Jean de Croonders, Mary Butters, The Irish Press, TM Racing, Wilfried Huber, Radiorama, Guido Capello Vincentinus, Hanabie., Iouri Matvéïévitch Sokolov, Xenia Gueorguievna de Russie, Pierre Fehlmann, Français de Corse, Bourboulon) et les **3 cartes mal classées** ci-dessous (Qué bonito amor réglée en v1.9.2) passent par le flux Suggestions (premiers cas réels) : cas réel dans `test/classement.test.js`, puis la règle. Les 16 de `#Nom de famille` restent ignorées.
   - « Armed Forces Bowl 2017 — match de football universitaire américain… à Fort Worth » → Sport, **Sciences** (universitaire), **Patrimoine** (Fort Worth) ;
   - « Le Secret de la salamandre — album de bande dessinée » → **Musique** + Littérature ;
   - « Programmation spaghetti — code source… gestion des événements » → **Histoire** (événements) ;
4. **Finir le premier rangement** avec la personne et relire son journal des bugs.

## Chantier : moins de cartes sans étiquette (décidé le 2026-10-13)

- **But** : faire baisser les cartes `inconnue` et `!À traiter`. Les `ignoree` (homonymie, nom de famille…) restent sans étiquette, hors objectif. Un compteur du panneau le suit.
- **Le script propose, la personne tranche** ; le script ne devine pas et ne crée rien. Les mots acceptés entrent dans `src/regles.js` (par Claude, en session), avec 1 à 2 cas réels dans `test/classement.test.js` ; pas de règles gardées dans le navigateur.
- **v1.9.0 — bouton « Suggestions »** (lecture seule) :
  - réutilise la lecture complète de Migration (`lecture2`) : date affichée, relecture proposée ; un « Appliquer » de Ranger la marque périmée (« Relire (recommandé) ») ;
  - compteur : N sans étiquette → X inconnues, Y à traiter, Z ignorées, plus les cartes portant `!À traiter` ;
  - sur les cartes `inconnue` et `a_traiter` (sans étiquette ou `!À traiter`) : mots seuls et expressions de 2-3 mots, sans mots vides ni mots déjà connus des règles, à partir de 3 cartes (5 au départ, abaissé après le premier tour), top 50, 3 exemples chacun ;
  - domaine proposé = celui que portent les cartes déjà étiquetées contenant ce mot, si ≥ 70 % sur au moins 5 cartes, sinon « ? » ; « nouvelle étiquette ? » à partir de 30 cartes sans domaine majoritaire ;
  - « Copier pour Claude » : une ligne par candidat (mot, nb, domaine + %, 3 exemples `titre — description`).
- **Version suivante** : Ranger relit aussi les cartes `!À traiter`, leur pose leur domaine et **retire `!À traiter`, et seulement elle**, avec « Retirer l'étiquette » (aperçu + « Appliquer »). Avant : observer une fois ce bouton dans le Chrome de la personne (une carte, accord à chaque clic), le noter dans `docs/wikimasters.md` et le rejouer dans le faux site ; mettre à jour `docs/piste-1.md` (qui l'interdit) et `CODING_STANDARDS.md` ; un test vérifie qu'aucune autre étiquette n'est retirée.
- **Puis** : « Compléter les cartes rangées » dans Ranger : cartes portant au moins un domaine, ajout des domaines manquants trouvés par les règles (5 au total au plus), jamais de retrait ; aperçu groupé (« + #Sciences : 42 cartes »). Une carte rangée à la main en `#Arts` que les règles mettent en Musique finit avec les deux (accepté).

Déjà refusé par la personne, à ne pas reproposer : écrire directement dans la base (Supabase) avec le jeton de session (règle 1 de `CODING_STANDARDS.md`). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.

## Points ouverts

- Suppression des anciennes étiquettes (101 au départ) : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, demander son texte exact et le noter dans `docs/wikimasters.md`.
- Rapport de Migration du 2026-10-13 (avant la v1.8.4) : une cinquantaine d'anciennes étiquettes bloquées (●). La v1.8.4 débloque celles de métier ou de lieu ; restent bloquées les nationalités (gardées pour l'instant, décision de la personne) et les cartes sans domaine (Suite, point 2). Toujours relire la collection avant de supprimer.
- À revalider avec la personne : philosophes et historiens rangés en #Sciences.
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` lève alors une PanneSite, donc rechargement et reprise. Non rejoué dans le faux site.
- Pagination absente quand `stats` échoue : `allerA` lève une PanneSite (rechargement et reprise). Non rejoué dans le faux site.
