# Passation — userscript WikiMasters

Mis à jour le 2026-10-12. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- Version livrée : **v1.8.1** (à installer par la personne ; elle avait v1.8.0).
- Dépôt sur GitHub (`matteo-lorenzi/wikimasters-rangement`, branche `main`), copie durable.
- **Tests recréés** (`docs/tests.md`) : moteur sur 51 cartes réelles + pièges, faux site jsdom, automatisation de la page, `scripts/regressions.py` (9 mutations, toutes détectées).
- v1.8.1 :
  - **Ranger choisit sa stratégie** : à partir de 200 cartes à ranger, recherches groupées d'abord (piste 1, `docs/piste-1.md`), puis page par page ; en dessous, comme avant. Décidé avec la personne le 2026-10-12.
  - Pose refusée par le site (« Impossible d'appliquer l'étiquette ») : un réessai, puis arrêt avec un message clair.
  - Chargement raté (« Le chargement de la collection a échoué ») : arrêt avec un message, au lieu de prendre la liste vide pour la fin de la vue.
  - « Tout sélectionner (page) » quand toute la page est à poser.
- Le 2026-10-12, 1 854 cartes sans étiquette, dont 1 112 rangeables.

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!Doublon`, `!À vendre`, `!À garder` (posées à la main), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- Nationalités et métiers précis → la barre de recherche du site, qui se combine avec le filtre d'étiquette ; pas d'étiquette.
- Plafond 30 étiquettes. Sans règle, la carte reste « Sans étiquette » : le script ne devine pas.

## Suite

1. **Premier rangement réel en v1.8.1** avec la personne : le rangement groupé n'a tourné que sur le faux site. Points à regarder : la saisie dans la barre de recherche (setter natif + `input`), le temps par recherche, le bandeau après la pose.
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
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` échouerait alors, avec un message. Non rejoué dans le faux site.
- Pagination absente quand `stats` échoue : `allerA` s'arrête avec un message. Non rejoué dans le faux site.
