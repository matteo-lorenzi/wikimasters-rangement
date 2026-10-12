# Passation — userscript WikiMasters

Mis à jour le 2026-10-12. Les instructions durables sont dans `CLAUDE.md` ; ce fichier ne garde que l'état et la suite.

## État

- Version installée chez la personne : **v1.8.0**.
- Dépôt reconstruit depuis le build v1.8.0 après la perte de l'environnement : `npm run build` régénère ce build **à l'octet près**. Poussé sur GitHub (`matteo-lorenzi/wikimasters-rangement`), qui remplace le Project claude.ai « WikiMaster » comme copie durable ; le Project garde une copie figée du 2026-10-11.
- `docs/wikimasters.md` (fiche du site) et `docs/tests.md` réécrits depuis l'ancienne passation ; fiche complétée le 2026-10-12 (recherche, sélection, fenêtre qui se ferme seule, pannes du site).
- **Tests perdus, pas encore recréés** : `test/` est vide, le build passe avec zéro test. `docs/tests.md` décrit ce qu'ils doivent couvrir.
- **Étude de la « piste 1 » faite** : `docs/piste-1.md`, script `scripts/couverture-piste1.js`. Gain mesuré ×1,5 sur la passe 1 (≈ 100 → 67 min), pas ×2 à ×3 ; recommandation « oui sous conditions ». Pendant l'étude, avec l'accord de la personne : 50 cartes « espèce… » étiquetées Nature et 17 footballeurs étiquetés Sport, par les boutons du site.
- Le 2026-10-12, 1 854 cartes sans étiquette, dont 1 112 rangeables (523 inconnues, 219 ignorées).

## Système d'étiquettes (décidé avec la personne)

- 17 **domaines** (clés de `DOMAINES` dans `src/regles.js`), jusqu'à 5 par carte, dans l'ordre de la description.
- 1 collection : `★Village Polonais`. Gestion : `!Doublon`, `!À vendre`, `!À garder` (posées à la main), `!À traiter` (posée par le script quand seul un mot ambigu est trouvé).
- Nationalités et métiers précis → la barre de recherche du site, qui se combine avec le filtre d'étiquette ; pas d'étiquette.
- Plafond 30 étiquettes. Sans règle, la carte reste « Sans étiquette » : le script ne devine pas.

## Suite

1. **Recréer les tests** selon `docs/tests.md`, test d'abord (`mattpocock-skills:tdd`) : `classement.test.js` (55 cas réels), `faux-site.js`, `page.test.js`, puis `scripts/regressions.py` (7 mutations, toutes détectées). Le faux site rejoue aussi les comportements notés le 2026-10-12 dans `docs/wikimasters.md`.
2. **Pannes du site dans le code actuel** (avant la piste 1, elles touchent déjà v1.8.0) : reconnaître « Le chargement de la collection a échoué » (sinon une vue en échec passe pour une vue vide), et « Impossible d'appliquer l'étiquette » (aujourd'hui : 90 s d'attente puis un message trompeur). Accepter la fenêtre « Appliquer une étiquette » qui se ferme seule.
3. **Piste 1** : décision à prendre avec la personne sur la base de `docs/piste-1.md` (≈ 33 min gagnées une fois, intérêt nul sur les rangements quotidiens). Si oui : phase préalable de la passe 1, en réutilisant `appliquerSurPage` avec un plan réduit au groupe du mot ; esquisse dans `docs/piste-1.md`. Écrire d'abord le test sur le faux site.

Déjà refusé par la personne, à ne pas reproposer : écrire directement dans la base (Supabase) avec le jeton de session (règle 1 de `CODING_STANDARDS.md`). Une exploration des cookies a déjà été bloquée par le classificateur de sécurité.

## Points ouverts

- Suppression des anciennes étiquettes (101 au départ) : la réponse au `confirm` natif n'a jamais été vérifiée sur le vrai site. Si la fenêtre réapparaît, demander son texte exact et le noter dans `docs/wikimasters.md`.
- Migration appliquée au moins en partie ; ce qui reste à supprimer est inconnu : relire par l'API avant d'agir. Des cartes portent encore d'anciennes étiquettes (vu le 2026-10-12 : « Footballeur », « Anglais », « Japon »…).
- À revalider avec la personne : philosophes et historiens rangés en #Sciences.
- Le bouton « Sélectionner / Quitter la sélection » a disparu une fois après une pose suivie d'un échec de `stats` (cause inconnue) : `modeSelection` échouerait alors. À surveiller.
