# Rapports Wikipédia à auditer

Un fichier par rapport JSON copié depuis le bouton « Copier le rapport Wikipédia (JSON) » de l'aperçu de Ranger (userscript sans « Appliquer »).

- **Nom** : `AAAA-MM-JJ-vX.Y.Z.json` (date du rapport, version du script qui l'a produit). Exemple : `2026-11-10-v1.9.14.json`.
- **Format** : JSON tel que copié, sans rien changer (pas de Markdown ni de texte autour). `npm run essai rapports-wikipedia/<fichier>` le rejoue.
- **Versionné** : ces fichiers sont poussés sur GitHub (copie durable). `resultats/` reste local (sorties de `npm run essai`).

## Auditer un rapport (quand on te le demande)

1. Prendre le fichier le plus récent (ou celui nommé). Lire `bilan` : couverture = `classees / lues`, causes, erreurs d'appel, version.
2. **Avant de toucher aux règles** : tirer 100 cartes `cause: "classee"` au hasard (graine fixée, notée), hors `test/reference-wikipedia.json`, et juger chacune (étiquettes justes ? mot responsable piégé ?). Précision = justes / 100. Ne jamais réutiliser un témoin déjà vu pour valider une règle écrite d'après lui.
3. Relever les erreurs (mot fautif, carte, étiquette attendue) et les cartes récupérables : « est + nom sans article », sans règle, ambiguës.
4. Rendre : chiffres (couverture, précision du témoin), erreurs par mot, gains probables, risques de sur-apprentissage. Les jugements sont ceux de Claude : le dire, demander à la personne d'en vérifier ~20.
5. Ensuite seulement : un cas réel par carte dans `test/classement.test.js`, puis la règle, puis la mutation (`CLAUDE.md`, « Changer le code »). Comparer au rapport précédent de ce dossier et noter les chiffres dans `docs/suivi-wikipedia.md`.
