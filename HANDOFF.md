# Passation — userscript WikiMasters

Mis à jour le 2026-10-13. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- **v1.9.0** (2026-10-13, à installer par la personne) : bouton « Suggestions » (voir Chantier plus bas). Prochaine étape : la personne le lance sur sa collection et colle la liste « Copier pour Claude » ; on choisit les mots ensemble, cas réels dans `test/classement.test.js`, puis règles.
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
2. **Chantier « moins de cartes sans étiquette »** (v1.9.0 livrée : premier tour Suggestions → règles → Ranger à faire avec la personne) (décidé avec la personne le 2026-10-13, détail plus bas) : v1.9.0 Suggestions, puis v1.9.1, puis v1.9.2. Entre deux versions, un tour réel Suggestions → règles → Ranger pour voir l'effet sur le compteur.
3. Les **21 cartes « pas de domaine »** du rapport de Migration (Saison 2015 des Astros de Houston, McLaren MP4-28, Hippodrome de Dieppe, Borough de Denali, Stanley Benham, David B. Samadi, John L. Lewis, Raymond Montaner, Jean de Croonders, Mary Butters, The Irish Press, TM Racing, Wilfried Huber, Radiorama, Guido Capello Vincentinus, Hanabie., Iouri Matvéïévitch Sokolov, Xenia Gueorguievna de Russie, Pierre Fehlmann, Français de Corse, Bourboulon) et les **4 cartes mal classées** ci-dessous passent par le flux Suggestions (premiers cas réels) : cas réel dans `test/classement.test.js`, puis la règle. Les 16 de `#Nom de famille` restent ignorées.
   - « Armed Forces Bowl 2017 — match de football universitaire américain… à Fort Worth » → Sport, **Sciences** (universitaire), **Patrimoine** (Fort Worth) ;
   - « Le Secret de la salamandre — album de bande dessinée » → **Musique** + Littérature ;
   - « Programmation spaghetti — code source… gestion des événements » → **Histoire** (événements) ;
   - « Qué bonito amor — telenovela mexicaine » → rien (telenovela absent).
4. **Finir le premier rangement** avec la personne et relire son journal des bugs.

## Chantier : moins de cartes sans étiquette (décidé le 2026-10-13)

- **But** : faire baisser les cartes `inconnue` et `!À traiter`. Les `ignoree` (homonymie, nom de famille…) restent sans étiquette, hors objectif. Un compteur du panneau le suit.
- **Le script propose, la personne tranche** ; le script ne devine pas et ne crée rien. Les mots acceptés entrent dans `src/regles.js` (par Claude, en session), avec 1 à 2 cas réels dans `test/classement.test.js` ; pas de règles gardées dans le navigateur.
- **v1.9.0 — bouton « Suggestions »** (lecture seule) :
  - réutilise la lecture complète de Migration (`lecture2`) : date affichée, relecture proposée ; un « Appliquer » de Ranger la marque périmée (« Relire (recommandé) ») ;
  - compteur : N sans étiquette → X inconnues, Y à traiter, Z ignorées, plus les cartes portant `!À traiter` ;
  - sur les cartes `inconnue` et `a_traiter` (sans étiquette ou `!À traiter`) : mots seuls et expressions de 2-3 mots, sans mots vides ni mots déjà connus des règles, à partir de 5 cartes, top 50, 3 exemples chacun ;
  - domaine proposé = celui que portent les cartes déjà étiquetées contenant ce mot, si ≥ 70 % sur au moins 5 cartes, sinon « ? » ; « nouvelle étiquette ? » à partir de 30 cartes sans domaine majoritaire ;
  - « Copier pour Claude » : une ligne par candidat (mot, nb, domaine + %, 3 exemples `titre — description`).
- **v1.9.1** : Ranger relit aussi les cartes `!À traiter`, leur pose leur domaine et **retire `!À traiter`, et seulement elle**, avec « Retirer l'étiquette » (aperçu + « Appliquer »). Avant : observer une fois ce bouton dans le Chrome de la personne (une carte, accord à chaque clic), le noter dans `docs/wikimasters.md` et le rejouer dans le faux site ; mettre à jour `docs/piste-1.md` (qui l'interdit) et `CODING_STANDARDS.md` ; un test vérifie qu'aucune autre étiquette n'est retirée.
- **v1.9.2** : « Compléter les cartes rangées » dans Ranger : cartes portant au moins un domaine, ajout des domaines manquants trouvés par les règles (5 au total au plus), jamais de retrait ; aperçu groupé (« + #Sciences : 42 cartes »). Une carte rangée à la main en `#Arts` que les règles mettent en Musique finit avec les deux (accepté).

Déjà refusé par la personne, à ne pas reproposer : écrire directement dans la base (Supabase) avec le jeton de session (règle 1 de `CODING_STANDARDS.md`). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.

## Points ouverts

- Suppression des anciennes étiquettes (101 au départ) : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, demander son texte exact et le noter dans `docs/wikimasters.md`.
- Rapport de Migration du 2026-10-13 (avant la v1.8.4) : une cinquantaine d'anciennes étiquettes bloquées (●). La v1.8.4 débloque celles de métier ou de lieu ; restent bloquées les nationalités (gardées pour l'instant, décision de la personne) et les cartes sans domaine (Suite, point 2). Toujours relire la collection avant de supprimer.
- À revalider avec la personne : philosophes et historiens rangés en #Sciences.
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` lève alors une PanneSite, donc rechargement et reprise. Non rejoué dans le faux site.
- Pagination absente quand `stats` échoue : `allerA` lève une PanneSite (rechargement et reprise). Non rejoué dans le faux site.
