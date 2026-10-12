# Passation — userscript WikiMasters

Mis à jour le 2026-10-13. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- Version livrée : **v1.8.4** (à installer par la personne ; v1.8.4 assouplit la suppression des anciennes étiquettes ; premier vrai rangement fait en v1.8.2, voir plus bas).
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

0. **Cartes « pas de domaine » du rapport de Migration** (2026-10-13), à classer par les règles (cas réel dans `test/classement.test.js` d'abord, il faut leur description) : Saison 2015 des Astros de Houston, McLaren MP4-28, Hippodrome de Dieppe, Borough de Denali, Stanley Benham, David B. Samadi, John L. Lewis, Raymond Montaner, Jean de Croonders, Mary Butters, The Irish Press, TM Racing, Wilfried Huber, Radiorama, Guido Capello Vincentinus, Hanabie., Iouri Matvéïévitch Sokolov, Xenia Gueorguievna de Russie, Pierre Fehlmann, Français de Corse, Bourboulon. Les 16 de `#Nom de famille` restent ignorées (pages de nom).
1. **Finir le premier rangement en v1.8.3** avec la personne et relire son journal des bugs. Vérifié sur le vrai site en v1.8.2 : saisie dans la barre de recherche, poses groupées, reprise après un vrai `location.reload()`.
2. **Cartes mal classées repérées en recréant les tests**, à trancher avec la personne avant de toucher aux règles (cas réel dans `test/classement.test.js` d'abord) :
   - « Armed Forces Bowl 2017 — match de football universitaire américain… à Fort Worth » → Sport, **Sciences** (universitaire), **Patrimoine** (Fort Worth) ;
   - « Le Secret de la salamandre — album de bande dessinée » → **Musique** + Littérature ;
   - « Programmation spaghetti — code source… gestion des événements » → **Histoire** (événements) ;
   - « Qué bonito amor — telenovela mexicaine » → rien (telenovela absent).

Déjà refusé par la personne, à ne pas reproposer : écrire directement dans la base (Supabase) avec le jeton de session (règle 1 de `CODING_STANDARDS.md`). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.

## Points ouverts

- Suppression des anciennes étiquettes (101 au départ) : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, demander son texte exact et le noter dans `docs/wikimasters.md`.
- Migration appliquée au moins en partie ; ce qui reste à supprimer est inconnu : relire par l'API avant d'agir. Des cartes portent encore d'anciennes étiquettes (vu le 2026-10-12 : « Footballeur », « Anglais », « Japon »…).
- À revalider avec la personne : philosophes et historiens rangés en #Sciences.
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` lève alors une PanneSite, donc rechargement et reprise. Non rejoué dans le faux site.
- Pagination absente quand `stats` échoue : `allerA` lève une PanneSite (rechargement et reprise). Non rejoué dans le faux site.
