# Passation — userscript WikiMasters

Mis à jour le 2026-10-11. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- Version installée chez la personne : **v1.8.0**.
- Dépôt reconstruit depuis le build v1.8.0 après la perte de l'environnement : `npm run build` régénère ce build **à l'octet près**. Un commit git.
- `docs/wikimasters.md` (fiche du site) et `docs/tests.md` réécrits depuis l'ancienne passation.
- **Tests perdus, pas encore recréés** : `test/` et `scripts/` sont vides, le build passe avec zéro test. `docs/tests.md` décrit ce qu'ils doivent couvrir.

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!Doublon`, `!À vendre`, `!À garder` (posées à la main), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- Nationalités et métiers précis → la barre de recherche du site, qui se combine avec le filtre d'étiquette ; pas d'étiquette.
- Plafond 30 étiquettes. Sans règle, la carte reste « Sans étiquette » : le script ne devine pas.

## Suite

1. **Recréer les tests** selon `docs/tests.md`, test d'abord (`mattpocock-skills:tdd`) : `classement.test.js` (55 cas réels), `faux-site.js`, `page.test.js`, puis `scripts/regressions.py` (7 mutations, toutes détectées).
2. **« Piste 1 » — étiquetage groupé par recherche**, en attente du feu vert de la personne : le lui demander avant de coder. Pour chaque domaine, chercher dans « Sans étiquette » les mots qui couvrent le plus de cartes du plan (`q=footballeur`, …), cocher jusqu'à 50 cartes du même domaine, poser l'étiquette en **une** opération. Ne cocher que des cartes du plan. Gain estimé ×2 à ×3 sur le rattrapage (~1 340 cartes sans étiquette, dont ~1 300 rangeables). Écrire d'abord le test sur le faux site.

Déjà refusé par la personne, à ne pas reproposer : écrire directement dans la base (Supabase) avec le jeton de session (règle 1 de `CODING_STANDARDS.md`). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.

## Points ouverts

- Suppression des anciennes étiquettes (101 au départ) : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, demander son texte exact et le noter dans `docs/wikimasters.md`.
- Migration appliquée au moins en partie ; ce qui reste à supprimer est inconnu : relire par l'API avant d'agir.
- À revalider avec la personne : philosophes et historiens rangés en #Sciences.
