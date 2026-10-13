# Passation — userscript WikiMasters

Mis à jour le 2026-10-13, en fin de session : **la v1.9.3 est la version stable, figée à la demande de la personne**. Les instructions durables sont dans `CLAUDE.md` ; ce fichier garde l'état, les décisions, la suite et les questions en suspens.

## Reprendre une session

1. Lire `CLAUDE.md`, puis ce fichier en entier (surtout « Questions en suspens »).
2. Dépôt absent → `git clone https://github.com/matteo-lorenzi/wikimasters-rangement`, puis `npm install`. `npm test` doit donner **194 tests verts** ; `PYTHONIOENCODING=utf-8 python scripts/regressions.py` **16/16 mutations détectées**.
3. Travailler sur une nouvelle branche partie de `main` ; `main` n'avance qu'après le oui de la personne (`CLAUDE.md`).
4. Demander à la personne où elle en est des « Actions de la personne » ci-dessous avant de coder.

## État

- **v1.9.3 sur `main`** (2026-10-13), CI verte, 194 tests, 16 bugs surveillés par `scripts/regressions.py`. `main` = `claude/dynamic-card-labels-08c680` (branche de cette session, rien d'autre en attente).
- Le panneau du script a quatre boutons :
  - **Ranger les nouvelles cartes** : lit les cartes sans étiquette (seulement les nouvelles, ou **toutes si les règles ont changé** depuis le dernier rangement, v1.9.3), montre l'aperçu, pose les domaines après « Appliquer ». Recherches groupées à partir de 200 cartes (`docs/piste-1.md`). Rechargement et reprise automatiques sur raté du site.
  - **Suggestions** (v1.9.0–1.9.1, lecture seule) : compteur des cartes sans domaine, mots inconnus des règles (dès 3 cartes, domaine proposé d'après les cartes déjà étiquetées), « Copier pour Claude » et « Copier les cartes sans règle ». C'est l'outil du chantier en cours (voir plus bas).
  - **Migration (une fois)** : faite par la personne (2026-10-13, v1.8.4). Sa lecture complète (`lecture2`) est partagée avec Suggestions.
  - **Journal des bugs** : la personne le copie dans la conversation ; lire d'abord « Page : » et « Journal : ».
- Moteur (`src/regles.js`) : la description d'abord ; **si elle ne donne aucun domaine (et n'est pas une page à ignorer), le titre en secours** (v1.9.2). Une page à ignorer l'emporte sur un mot ambigu (v1.9.2).
- Dernier compteur (Suggestions, v1.9.2, 2026-10-13 16:49) : 875 sans étiquette = 449 sans règle, 0 à traiter, 240 ignorées, **186 rangeables** (pas encore rangées : bug corrigé en v1.9.3) ; 50 portent `!À traiter` (18 que les règles rangent maintenant). Depuis, ~35 mots ajoutés (v1.9.3) et « Cour d'appel de Besançon » a perdu son `!À traiter` (test de « Retirer l'étiquette »).

### Actions de la personne (avant la prochaine session de code)

1. Installer la v1.9.3 (`dist/wikimasters-rangement.user.js`).
2. Lancer « Ranger les nouvelles cartes » : il annonce « Les règles ont changé » et relit **toutes** les cartes sans étiquette (une fois) ; « Appliquer ».
3. Lancer « Suggestions » → « Relire », et garder les deux textes copiés (mots, cartes sans règle) pour la prochaine session.

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!Doublon`, `!À vendre`, `!À garder` (posées à la main), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- Nationalités et métiers précis → la barre de recherche du site ; pas d'étiquette. Plafond 30 étiquettes (22 utilisées).
- Sans règle, la carte reste « Sans étiquette » : le script ne devine pas. Les cartes ignorées (homonymies, listes, noms de famille, prénoms : 240) restent sans étiquette, hors objectif.
- Anciennes étiquettes (Migration) : une étiquette de métier ou de lieu est supprimable dès que ses cartes ont son domaine ; une nationalité exige son mot sur la carte. Les nationalités qui bloquent sont **gardées pour l'instant** (question B).

## Chantier : moins de cartes sans étiquette (décidé avec la personne le 2026-10-13)

Méthode : **le script propose, la personne tranche, Claude écrit la règle**. Un tour = la personne lance Suggestions et colle les deux textes ; Claude propose des mots par domaine avec les cartes qu'ils rangent (vérifier d'abord qu'ils sont inconnus du moteur, et signaler les mots risqués) ; la personne accepte ou refuse ; chaque groupe accepté entre dans `test/classement.test.js` avec une carte réelle (rouge), puis dans `regles.js` (vert), marqué en commentaire par le tour ; puis version, Ranger, nouveau compteur.

Tours faits le 2026-10-13 (v1.9.0 → v1.9.3) : 577 → 449 cartes sans règle. Les ~450 restantes sont **presque toutes des titres seuls** (noms propres, espèces en latin) : les mots n'y peuvent plus grand-chose, d'où Wikipédia (question A).

### Suite, dans l'ordre

1. **Tour de Suggestions** avec les textes de la personne (après ses actions ci-dessus).
2. **Retrait de `!À traiter`** (décidé ; prochaine version de code). Spécification :
   - Ranger lit aussi les cartes portant `!À traiter` (API `tag_id=<id de !À traiter>`, l'id est dans `stats.tagOptions`) ; celles que les règles rangent maintenant reçoivent leur(s) domaine(s) **puis** perdent `!À traiter` (dans cet ordre : si la pose échoue, la carte garde son repère). Aperçu (« N cartes : #Domaine + retrait de !À traiter ») puis « Appliquer ».
   - Le script retire **`!À traiter` et seulement elle** : bouton au texte exact `!À traiter` (le texte du bouton est « nom » + saut de ligne + nombre). Un test du faux site vérifie qu'aucune autre étiquette n'est retirée, et qu'une carte encore ambiguë garde `!À traiter`.
   - Comportement du site observé le 2026-10-13 : voir `docs/wikimasters.md`, « Retirer l'étiquette » (pas de `confirm`, bilan « N carte désétiquetée. », **fenêtre qui ne se ferme pas seule → cliquer « Terminé »**, **sélection gardée après**). Le rejouer d'abord dans `test/faux-site.js` (aujourd'hui le bouton y est vide).
   - Reprise sans perte (règle 4) : noter chaque retrait fait dans le stockage, comme `ranger_fait`.
   - Mettre à jour `docs/piste-1.md` (« Jamais Retirer l'étiquette ») et `CODING_STANDARDS.md` (règle 2 : retirer `!À traiter`, posée par le script, est réversible ; aucune autre étiquette).
   - Le premier usage réel se fait avec la personne présente, sur quelques cartes d'abord.
3. **« Compléter les cartes rangées »** (décidé) : bouton dans Ranger ; cartes portant au moins un domaine ; ajout des domaines manquants trouvés par les règles (5 au total au plus), jamais de retrait ; aperçu groupé (« + #Sciences : 42 cartes »). Une carte rangée à la main en `#Arts` que les règles mettent en Musique finit avec les deux (accepté).
4. **Wikipédia** : seulement quand la question A sera tranchée.

## Questions en suspens

Chacune avec le contexte et la recommandation à proposer. Ne pas trancher à la place de la personne.

- **A. Wikipédia pour les cartes sans description** (accord de principe le 2026-10-13 ; la personne veut en parler **en détail, pour optimiser les appels, quand il ne restera que des cartes dont le titre n'indique aucun domaine**). Idée : lire la première phrase de l'article fr.wikipedia du titre de la carte (« Jimmy Choo … est un styliste … ») et classer ce qui suit « est un / est une ». Lecture seule, API publique (pas le site : règle 1 respectée) ; Tampermonkey demandera l'autorisation du domaine (`@connect`). À débattre :
  - quelles cartes : seulement les `inconnue` sans description (~400) ? aussi les `!À traiter` comme les groupes de musique (« Bôa — groupe britannique ») ?
  - nombre d'appels : l'API `action=query&prop=extracts&exintro&explaintext&exsentences=1` accepte plusieurs titres par requête (limite à vérifier, sans doute 20) → ~20 requêtes au lieu de 400 ; cache dans le navigateur pour ne jamais redemander un titre ;
  - où : dans Suggestions (proposer des mots) ou dans Ranger (poser) ? Recommandation : Ranger, avec « d'après Wikipédia » dans l'aperçu et « Appliquer » obligatoire ;
  - garde-fous : n'utiliser que la proposition après « est un/une », jamais tout l'article ; titre absent ou page d'homonymie → rien.
- **B. Anciennes étiquettes de nationalité** (`#Américain` 52/116, `#Français` 40/163, `#Anglais` 26/31…) gardées depuis la Migration : les supprimer (la barre de recherche les remplace) ou les garder ? Pas tranché.
- **C. Philosophes et historiens rangés en #Sciences** : à revalider avec la personne.
- **D. Trois cartes mal classées** (repérées en recréant les tests, à trancher avant de toucher aux règles ; cas réel d'abord) :
  - « Armed Forces Bowl 2017 — match de football universitaire américain… à Fort Worth » → Sport, **Sciences** (universitaire), **Patrimoine** (Fort Worth) ;
  - « Le Secret de la salamandre — album de bande dessinée » → **Musique** (album) + Littérature ;
  - « Programmation spaghetti — code source… gestion des événements » → **Histoire** (événements).
- **E. Les 21 cartes « pas de domaine » du rapport de Migration** (Saison 2015 des Astros de Houston, McLaren MP4-28, Hippodrome de Dieppe, Borough de Denali, Stanley Benham, David B. Samadi, John L. Lewis, Raymond Montaner, Jean de Croonders, Mary Butters, The Irish Press, TM Racing, Wilfried Huber, Radiorama, Guido Capello Vincentinus, Hanabie., Iouri Matvéïévitch Sokolov, Xenia Gueorguievna de Russie, Pierre Fehlmann, Français de Corse, Bourboulon) : presque toutes à titre seul → Wikipédia (A). Les 16 de `#Nom de famille` restent ignorées.
- **F. Derniers mots proposés par Suggestions, jamais soumis à la personne** : « formation » (4 cartes, sens différents : Formation de Kaili = géologie, Formation de classes, Centre de formation à distance) et « thomas » (prénom, 3 cartes). Recommandation : refuser les deux ; ajouter « thomas » (ou les prénoms) à `PAS_SUGGERER`.
- **G. Groupes de musique** (« Bôa — groupe britannique », « Hanabie. — groupe japonais », « Terrorgruppe — groupe allemand », « Ravager (groupe) ») : « groupe » est ambigu à juste titre (groupe aéronaval…), le moteur ne sait pas dire « groupe + nationalité ». Décidé : laissés `!À traiter` en attendant Wikipédia (A).

## Refusé par la personne — ne pas reproposer

- Écrire directement dans la base (Supabase) avec le jeton de session (règle 1). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.
- Mots refusés : `politique` (seul ; « doctrine politique » accepté) ; mots risqués **date, conflit, industrie, commerce, justice, manifestation, affection, barrage** (leurs cartes restent sans règle dans les tests).
- Proposer des pays ou des nationalités dans Suggestions (`PAS_SUGGERER`).
- Une étiquette `!Homonymie` pour les cartes ignorées.
- « défilé » en Géographie : « Défilé de l'Écluse » part en Transports (titre en secours, « écluse »), erreur acceptée.

## Points techniques ouverts

- Suppression des anciennes étiquettes : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, relever son texte exact dans `docs/wikimasters.md`.
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` lève une PanneSite (rechargement et reprise). Non rejoué dans le faux site.
- Pagination absente quand `stats` échoue : `allerA` lève une PanneSite. Non rejoué dans le faux site.
- La requête d'écriture de « Retirer l'étiquette » n'apparaît pas dans la surveillance réseau de Claude in Chrome (sans importance : le script ne l'appelle jamais).
- Titre en secours et accents : le moteur ignore les accents, donc un titre peut ranger par erreur (« marqué » trouve la règle « marque » ; vu dans un test). À garder en tête en lisant les cartes mal classées.

## Pièges de l'environnement (Windows, rencontrés en session)

- Git Bash : un script Python passé par heredoc perd des barres obliques inverses (`'\\n'` devenu un vrai saut de ligne, `\'` devenu `'` dans `regles.js`) → écrire le script dans un fichier avec l'outil d'écriture, ou modifier à la main ; toujours relancer les tests après.
- `scripts/regressions.py` plante à l'affichage du ✓ dans la console Windows → `PYTHONIOENCODING=utf-8`.
- Claude in Chrome : la personne a Opera GX **et** Chrome connectés ; l'extension vise Opera GX par défaut (« No group with id ») → `list_connected_browsers` puis `select_browser` sur Chrome (voir `docs/wikimasters.md`).
- Tests en contexte `vm` : recopier les tableaux du script (`Array.from`) avant `deepEqual` (`docs/tests.md`).

## Historique des versions

- **v1.9.3** : Ranger relit toutes les cartes sans étiquette quand les règles ont changé (empreinte `ranger_regles` ; bug n° 16) ; ~35 mots (3e tour).
- **v1.9.2** : titre en secours ; « ignorée » avant « ambigu » ; ~120 mots (2e tour).
- **v1.9.1** : Suggestions dès 3 cartes, pays et mots refusés jamais proposés, « Copier les cartes sans règle » ; `voie` → Géographie, `voie verte` → Transports.
- **v1.9.0** : bouton Suggestions.
- **v1.8.4** : Migration, une étiquette de métier ou de lieu se supprime avec son domaine.
- **v1.8.3** (premier journal des bugs) : recherche ratée relancée sur place ou abandonnée ; rechargements comptés seulement sans progrès ; menu des étiquettes vide attendu ; « Tout sélectionner (page) » puis décocher.
- **v1.8.2** : journal des bugs ; rechargement et reprise automatiques.
- **v1.8.1** : rangement groupé par recherches à partir de 200 cartes ; pose refusée et chargement raté gérés.
- Le 2026-10-12 : 1 854 cartes sans étiquette, dont 1 112 rangeables, avant le premier vrai rangement.
