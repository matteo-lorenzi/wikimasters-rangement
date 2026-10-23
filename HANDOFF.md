# Passation — userscript WikiMasters

Mis à jour le 2026-10-23 : **v1.9.7** sur la branche `claude/retrait-a-traiter` (Ranger retire `!À traiter` des cartes que les règles rangent), en attente du oui de la personne pour `main`. **v1.9.6 sur `main`**, validée par la personne : installée, cartes triées avec, aucun bug dans le journal. Les instructions durables sont dans `CLAUDE.md` ; ce fichier garde l'état, les décisions, la suite et les questions en suspens.

## Avant tout, en début de session : ce que la personne fait

À donner tel quel quand la personne demande par où commencer (« Nouvelle session pour wikimasters rangement, que dois-je faire avant de commencer à travailler les questions en suspens ? »). Ces étapes donnent à Claude l'état réel de la collection : sans elles, un tour de Suggestions ou une décision sur les questions en suspens se ferait sur des chiffres périmés.

1. **Installer la dernière version** : le fichier `dist/wikimasters-rangement.user.js` de `main` sur GitHub (`matteo-lorenzi/wikimasters-rangement`), dans Tampermonkey. Vérifier que le numéro de version affiché par Tampermonkey est celui de « État » ci-dessous (aujourd'hui **1.9.6**).
2. **Ouvrir la page Collection** de wiki-masters.com dans **Chrome** (pas Opera GX), onglet au premier plan, et ouvrir le panneau « 🏷 Rangement ».
3. **Ranger** : « Ranger les nouvelles cartes ». Si les règles ont changé depuis le dernier rangement, il l'annonce et relit toutes les cartes sans étiquette (≈ 1 min 30). Relire l'aperçu, puis « Appliquer » et laisser aller au bout.
4. **Journal des bugs** : si le bouton affiche un nombre (« Journal des bugs (2) »), le copier pour Claude.
5. **Suggestions** : « Suggestions » → « Relire » (la collection a changé avec le Ranger). Copier les deux textes : « Copier pour Claude » (compteur et mots) et « Copier les cartes sans règle ».
6. **Coller à Claude**, dans le premier message de la session : les deux textes de Suggestions, le journal des bugs s'il y en a un, et ce qui a surpris pendant le Ranger.
7. **Choisir avec Claude** par quoi commencer : un tour de Suggestions, une question en suspens (liste plus bas, chacune avec la recommandation de Claude), ou la suite du chantier.

Si Claude doit regarder le vrai site (observer un bouton, lire une carte) : Chrome ouvert sur la page Collection avec l'extension Claude in Chrome connectée ; Claude demande l'accord avant toute action qui modifie le compte.

## Reprendre une session (côté Claude)

1. Lire `CLAUDE.md`, puis ce fichier en entier (surtout « Questions en suspens »).
2. Dépôt absent → `git clone https://github.com/matteo-lorenzi/wikimasters-rangement`, puis `npm install`. `npm test` doit donner **220 tests verts** ; `PYTHONIOENCODING=utf-8 python scripts/regressions.py` **16/16 mutations détectées**.
3. Travailler sur une nouvelle branche partie de `main` ; `main` n'avance qu'après le oui de la personne (`CLAUDE.md`).
4. Si la personne n'a pas encore fait « Avant tout » (ci-dessus), le lui donner avant de coder ou de trancher quoi que ce soit.

## État

- **v1.9.7** (2026-10-23, branche ci-dessus), 220 tests, 16 bugs surveillés par `scripts/regressions.py`. **v1.9.6 sur `main`** (2026-10-15) : la personne l'a installée et a rangé ses cartes avec (2026-10-23), sans bug au journal. Node.js 26 et Python 3.13 installés sur la machine de travail le 2026-10-23.
- Le panneau du script a cinq boutons :
  - **Ranger les nouvelles cartes** : lit les cartes sans étiquette (seulement les nouvelles, ou **toutes si les règles ont changé** depuis le dernier rangement, v1.9.3), montre l'aperçu, pose les domaines après « Appliquer ». Recherches groupées à partir de 200 cartes (`docs/piste-1.md`). Rechargement et reprise automatiques sur raté du site.
  - **Suggestions** (v1.9.0–1.9.1, lecture seule) : compteur des cartes sans domaine, mots inconnus des règles (dès 3 cartes, domaine proposé d'après les cartes déjà étiquetées), « Copier pour Claude » et « Copier les cartes sans règle ». C'est l'outil du chantier en cours (voir plus bas).
  - **Migration (une fois)** : faite par la personne (2026-10-13, v1.8.4). Sa lecture complète (`lecture2`) est partagée avec Suggestions.
  - **Doublons** (v1.9.6, demandé par la personne) : lit toute la collection par l'API, liste les cartes possédées en plusieurs exemplaires (même titre, description et rareté) qui n'ont pas encore `!Doublon`, puis après « Appliquer » cherche chaque titre et pose `!Doublon` sur tous ses exemplaires (le site ne les distingue pas). Pas encore lancé sur le vrai site.
  - **Journal des bugs** : la personne le copie dans la conversation ; lire d'abord « Page : » et « Journal : ».
- Moteur (`src/regles.js`) : la description d'abord ; **si elle ne donne aucun domaine (et n'est pas une page à ignorer), le titre en secours** (v1.9.2). Une page à ignorer l'emporte sur un mot ambigu (v1.9.2).
- Dernier compteur (Suggestions, v1.9.2, 2026-10-13 16:49) : 875 sans étiquette = 449 sans règle, 0 à traiter, 240 ignorées, **186 rangeables** (pas encore rangées : bug corrigé en v1.9.3) ; 50 portent `!À traiter` (18 que les règles rangent maintenant). Depuis, ~35 mots ajoutés (v1.9.3) et « Cour d'appel de Besançon » a perdu son `!À traiter` (test de « Retirer l'étiquette »).
- La première fois que la personne suit « Avant tout » avec la v1.9.3, Ranger annonce « Les règles ont changé » et range, entre autres, les 186 cartes en attente.

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!À vendre`, `!À garder` (posées à la main), `!Doublon` (à la main ou par le bouton Doublons), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- `★Village Polonais` : « village », « commune polonaise » ou « gmina rurale », avec un mot de la Pologne (v1.9.6, demandé par la personne).
- Nationalités et métiers précis → la barre de recherche du site ; pas d'étiquette. Plafond 30 étiquettes (22 utilisées).
- Sans règle, la carte reste « Sans étiquette » : le script ne devine pas. Les cartes ignorées (homonymies, listes, noms de famille, prénoms : 240) restent sans étiquette, hors objectif.
- Anciennes étiquettes (Migration) : une étiquette de métier ou de lieu est supprimable dès que ses cartes ont son domaine ; une nationalité exige son mot sur la carte. Les nationalités qui bloquent sont **gardées pour l'instant** (question B).

## Chantier : moins de cartes sans étiquette (décidé avec la personne le 2026-10-13)

Méthode : **le script propose, la personne tranche, Claude écrit la règle**. Un tour = la personne lance Suggestions et colle les deux textes ; Claude propose des mots par domaine avec les cartes qu'ils rangent (vérifier d'abord qu'ils sont inconnus du moteur, et signaler les mots risqués) ; la personne accepte ou refuse ; chaque groupe accepté entre dans `test/classement.test.js` avec une carte réelle (rouge), puis dans `regles.js` (vert), marqué en commentaire par le tour ; puis version, Ranger, nouveau compteur.

Tours faits le 2026-10-13 (v1.9.0 → v1.9.3) : 577 → 449 cartes sans règle. Les ~450 restantes sont **presque toutes des titres seuls** (noms propres, espèces en latin) : les mots n'y peuvent plus grand-chose, d'où Wikipédia (question A).

### Tour 4 (2026-10-14) : fait, v1.9.4 puis v1.9.5

Compteur de la personne (Suggestions v1.9.3, 14/10 16:08) : 770 sans étiquette = **490 sans règle**, 1 à traiter, 259 ignorées, 20 rangeables ; 57 portent `!À traiter`. Le Ranger v1.9.3 est allé au bout, sans bug (réponse de la personne).

Réponse de la personne : groupes 1, 3 à 10 et 12 acceptés **tels quels, ⚠ compris** (médical, commission, accord de, section de, coupe) ; 11 refusé (essai, bibliothèque) ; 2 accepté **sans les mois** : « un mois seul ne vaut pas Histoire, il faut un événement avec » (« guerre en septembre » oui, « mois de septembre » non). L'événement range déjà la carte, donc aucun mois n'est ajouté. Effet mesuré sur 724 cartes sans étiquette lues par l'API le 14/10 (pages 1 à 15 ; la page 0 a été oubliée) : **63 cartes rangées en plus**, une seule fausse (« LVL Medical », une entreprise, en Sciences : ⚠ accepté). « Commission scolaire de Charlevoix » gagne Politique & Droit (⚠ commission).

Puis (v1.9.5), réponses de la personne : **une date seule ne range pas en Histoire**, il faut un événement, un personnage, un bâtiment historique… → `année`, `mois`, `lundi`…`dimanche` (1er tour) retirés d'Histoire, et les dates (mois, jours, `année`, `mois`) mises dans `PAS_SUGGERER` pour que Suggestions ne les repropose pas ; `chronologie` gardé. `classe`, `distribution`, `formation`, `thomas` refusés (« si on est sûr qu'ils posent problème » : plusieurs sens sur ses cartes, ou prénom) → `PAS_SUGGERER`. Aucune des 724 cartes sans étiquette ne change ; les cartes de dates déjà étiquetées `#Histoire` le restent (le script ne retire jamais un domaine).

Mots proposés (numéros tels que donnés à la personne ; ⚠ = risqué) :

1. Sciences : allergie, épidémiologie, autisme, urine, oculaire, médical (⚠ range « LVL Medical », une entreprise), classe de complexité, linux, software, protocol, compression de données, polym*, laser, semi-conducteur, électron, diffraction, fermentation, diviseur (19 cartes).
2. Histoire : janvier, février, septembre, octobre, novembre, décembre (pas mars/avril/mai/août : planète, prénoms), char de combat, luftwaffe, conflit armé, clan, duché, seigneurie, offensive, chef amérindien (14).
3. Politique & Droit : agence fédérale, candidat politique, juridiction, système politique, relations entre, droits de l'homme, identité de genre, garde républicaine (8) ; ⚠ commission, ⚠ accord de (+2).
4. Économie : commerce de détail, charbon, centrale solaire, secteur de l'énergie, bank, agroalimentaire, agriculture, tourisme (8). `management` écarté (« Network Data Management Protocol » partait en Économie).
5. Géographie : río, étang, récif, caverne, township, socken, amt, porte de paris (9) ; ⚠ section de (Lombeek-Notre-Dame, +1 ; « section d'Oreye » n'est pas trouvé).
6. Nature : quercus, dypsis, réserve nationale, faune, sous-classe (7).
7. Espace : ngc, télescope (3).
8. Sport : cup, racing, running, fútbol, eurobowl (5, dont Alianza Fútbol Club sorti de `!À traiter`) ; ⚠ coupe (+1).
9. Patrimoine : caserne, arène, maison-atelier (3).
10. Médias : télé, tv (2).
11. Littérature : ⚠ essai (essai nucléaire, rugby) ; ⚠ bibliothèque : Littérature ou Patrimoine ?
12. Trous du moteur : « artiste-peintre » (le trait d'union bloque « artiste » et « peintre ») → `artiste-peintre` en Arts ; `film` (4 lettres, pris tel quel) ne trouve pas « Eagle-Lion Films » → `films` en Cinéma & TV. Pluriel général des mots courts essayé puis écarté (un test casse ; « Cent francs belges type 4 rois » partait en Histoire).

Fait : une carte réelle par groupe dans `test/classement.test.js` (rouge sans les mots : 17 échecs), les mots dans `regles.js` (commentaire « Suggestions du 2026-10-14 (4e tour) »), v1.9.4. Les ~410 cartes restantes : noms propres et espèces latines → Wikipédia (question A).

### Suite, dans l'ordre

1. **La personne installe la v1.9.5** et lance Ranger (il annoncera « Les règles ont changé »), puis Suggestions pour le nouveau compteur.
2. **Retrait de `!À traiter`** : **fait en v1.9.7 et essayé sur le vrai site le 2026-10-23** : 36 cartes rangées puis débarrassées de `!À traiter` (92 → 57 au lieu des 56 prévus, une de plus non expliquée), message de validation, un seul raté (bug n° 8 du journal : après un retrait, le site affichait encore les cartes retirées, page « 2 / 2 » à 42 cartes et filtre à « (92) » ; liste sans doute pas actualisée) rattrapé par le rechargement automatique. **Piste, non faite** : attendre ~20 s que la liste se rafraîchisse avant de déclarer ce raté, après l'avoir rejoué dans le faux site (option « liste en retard »). Ranger lit aussi les cartes `!À traiter` (id lu dans les `tagOptions` de `stats` : forme **à vérifier**, voir `docs/wikimasters.md`), puis une passe 3 dans la vue `#!À traiter` pose les domaines et ensuite retire `!À traiter`. Spécification d'origine :
   - Ranger lit aussi les cartes portant `!À traiter` (API `tag_id=<id de !À traiter>`, l'id est dans `stats.tagOptions`) ; celles que les règles rangent maintenant reçoivent leur(s) domaine(s) **puis** perdent `!À traiter` (dans cet ordre : si la pose échoue, la carte garde son repère). Aperçu (« N cartes : #Domaine + retrait de !À traiter ») puis « Appliquer ».
   - Le script retire **`!À traiter` et seulement elle** : bouton au texte exact `!À traiter` (le texte du bouton est « nom » + saut de ligne + nombre). Un test du faux site vérifie qu'aucune autre étiquette n'est retirée, et qu'une carte encore ambiguë garde `!À traiter`.
   - Comportement du site observé le 2026-10-13 : voir `docs/wikimasters.md`, « Retirer l'étiquette » (pas de `confirm`, bilan « N carte désétiquetée. », **fenêtre qui ne se ferme pas seule → cliquer « Terminé »**, **sélection gardée après**). Le rejouer d'abord dans `test/faux-site.js` (aujourd'hui le bouton y est vide).
   - Reprise sans perte (règle 4) : noter chaque retrait fait dans le stockage, comme `ranger_fait`.
   - Mettre à jour `docs/piste-1.md` (« Jamais Retirer l'étiquette ») et `CODING_STANDARDS.md` (règle 2 : retirer `!À traiter`, posée par le script, est réversible ; aucune autre étiquette).
   - Le premier usage réel se fait avec la personne présente, sur quelques cartes d'abord.
3. **« Compléter les cartes rangées »** (décidé) : bouton dans Ranger ; cartes portant au moins un domaine ; ajout des domaines manquants trouvés par les règles (5 au total au plus), jamais de retrait ; aperçu groupé (« + #Sciences : 42 cartes »). Une carte rangée à la main en `#Arts` que les règles mettent en Musique finit avec les deux (accepté).
4. **Wikipédia** : seulement quand la question A sera tranchée.

### Idées futures (de la personne, pas encore décidées)

- **Mettre aux enchères, au prix moyen, les cartes en `!Doublon`** (2026-10-15). Avant d'y toucher : `CODING_STANDARDS.md` dit aujourd'hui « le script ne touche jamais […] aux enchères » (règle 2), à rediscuter avec la personne ; observer d'abord sur le vrai site la mise aux enchères et où lire le prix moyen, et le noter dans `docs/wikimasters.md`. Garder un exemplaire de chaque carte.

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
- **H. Cartes de dates déjà étiquetées `#Histoire`** (rangées avant la v1.9.5, par `année`, `mois` ou un jour) : elles gardent `#Histoire`, le script ne retire pas de domaine. Les retirer à la main, ou plus tard avec un outil ? Pas demandé par la personne ; à signaler si la personne en voit.
- **G. Groupes de musique** (« Bôa — groupe britannique », « Hanabie. — groupe japonais », « Terrorgruppe — groupe allemand », « Ravager (groupe) ») : « groupe » est ambigu à juste titre (groupe aéronaval…), le moteur ne sait pas dire « groupe + nationalité ». Décidé : laissés `!À traiter` en attendant Wikipédia (A).

## Refusé par la personne — ne pas reproposer

- Écrire directement dans la base (Supabase) avec le jeton de session (règle 1). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.
- Mots refusés : `politique` (seul ; « doctrine politique » accepté) ; mots risqués **date, conflit, industrie, commerce, justice, manifestation, affection, barrage** (leurs cartes restent sans règle dans les tests) ; 4e tour : **essai, bibliothèque**, **les dates seules** (jours, mois, `année` : il faut un événement, un personnage, un bâtiment historique…), **classe, distribution, formation, thomas**.
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

- **v1.9.7** : Ranger retire `!À traiter` (et elle seule) des cartes que les règles rangent, après avoir posé leur domaine ; l'aperçu les annonce.
- **v1.9.6** : `★Village Polonais` aussi pour « commune polonaise » et « gmina rurale polonaise » ; bouton Doublons (pose `!Doublon`).
- **v1.9.5** : une date seule ne range plus en Histoire (`année`, `mois`, jours retirés) ; dates et `classe`, `distribution`, `formation`, `thomas` jamais proposés par Suggestions.
- **v1.9.4** : ~75 mots (4e tour), dont `films` et `artiste-peintre` (trous du moteur) ; pas de mois.
- **v1.9.3** : Ranger relit toutes les cartes sans étiquette quand les règles ont changé (empreinte `ranger_regles` ; bug n° 16) ; ~35 mots (3e tour).
- **v1.9.2** : titre en secours ; « ignorée » avant « ambigu » ; ~120 mots (2e tour).
- **v1.9.1** : Suggestions dès 3 cartes, pays et mots refusés jamais proposés, « Copier les cartes sans règle » ; `voie` → Géographie, `voie verte` → Transports.
- **v1.9.0** : bouton Suggestions.
- **v1.8.4** : Migration, une étiquette de métier ou de lieu se supprime avec son domaine.
- **v1.8.3** (premier journal des bugs) : recherche ratée relancée sur place ou abandonnée ; rechargements comptés seulement sans progrès ; menu des étiquettes vide attendu ; « Tout sélectionner (page) » puis décocher.
- **v1.8.2** : journal des bugs ; rechargement et reprise automatiques.
- **v1.8.1** : rangement groupé par recherches à partir de 200 cartes ; pose refusée et chargement raté gérés.
- Le 2026-10-12 : 1 854 cartes sans étiquette, dont 1 112 rangeables, avant le premier vrai rangement.
