# Piste 1 — étiqueter par groupes grâce à la recherche : étude de faisabilité

Étude du 2026-10-12, sur le vrai site et le compte de la personne. Aucun code de `src/` n'a été modifié.
Tout ce qui n'a pas été observé ou mesuré porte la mention **[non vérifié]**.

## En bref

- **Faisable**, et le site s'y prête mieux que prévu : la recherche se combine avec « Sans étiquette », un bouton « Tout sélectionner (page) » existe, et après la pose la recherche, le filtre et le mode sélection restent en place.
- **Gain mesuré : ×1,5 sur la passe 1** (≈ 100 min → ≈ 67 min sur le stock actuel), **pas ×2 à ×3**. Deux raisons : il n'y a que 1 112 cartes rangeables (pas ~1 300), et le mode Ranger regroupe déjà 2,3 cartes par pose en moyenne.
- **Recommandation : oui, sous conditions** (voir la fin du document) : en préalable de la passe 1 du mode Ranger, après la recréation des tests, et avec la détection des pannes du site observées pendant l'étude.

## 1. Couverture

### Méthode

1. Lecture par l'API, en GET seulement, depuis un onglet Collection du Chrome de la personne : `/api/my-collection?sort=added&untagged=1&page=<n>&stats=0`, 3 requêtes en parallèle au maximum. **1 854 cartes sans étiquette** sur 38 pages, soit exactement le `total` annoncé par `/api/my-collection/stats?untagged=1`. Durée : 93 s pour les 30 premières pages ; une erreur 500 sur un lot de 3 pages, relu ensuite page par page sans nouvelle erreur.
2. Classement local avec `classer` de `src/regles.js`, chargé dans un contexte `vm` de Node, et la même règle que `planCarte` de `src/app.js` pour une carte sans ancienne étiquette.
3. **Groupe d'un domaine** = les cartes dont c'est la **première** étiquette : celle que la passe 1 pose dans « Sans étiquette ». Les étiquettes suivantes des 72 cartes à plusieurs domaines relèvent de la passe 2, identique dans les deux modes.
4. Choix glouton, domaine par domaine : à chaque tour, le mot qui couvre le plus de cartes du groupe pas encore couvertes. Deux garde-fous :
   - **précision ≥ 0,6** : au moins 60 % des résultats du mot appartiennent au groupe. Sans cette règle, des mots comme « français » gagneraient partout en ramenant des centaines d'intrus ;
   - **au moins 5 cartes** par mot, sinon une recherche coûte plus qu'elle ne rapporte.

   Mots candidats : chaque mot de 4 lettres ou plus du titre et de la catégorie, plus ses débuts de 6 lettres ou plus (« politi », « compos », « entrepr »).
5. Vérification de **chacun des 47 mots retenus** par l'API (`q=<mot>&untagged=1`, toutes les pages). Les **intrus** sont les résultats qui ne sont pas dans le groupe du domaine.

Script : `node scripts/couverture-piste1.js <export.json> --recherches <res.json>` (voir l'annexe).

### Composition des 1 854 cartes sans étiquette

| Statut (`classer`) | Cartes |
|---|---:|
| classée (au moins un domaine) | 1 084 |
| `!À traiter` (mot ambigu seul) | 28 |
| ignorée (homonymie, liste…) | 219 |
| inconnue (aucune règle) | 523, dont beaucoup sans description (531 cartes sans description au total) |
| **rangeables** (classées + à traiter) | **1 112** |

### Mots retenus et couverture réelle (API)

« couvertes / intrus » : cartes du groupe couvertes par ce mot et pas par un mot précédent / résultats hors du groupe.

| Domaine (1re étiquette) | Cartes | Mots retenus (couvertes / intrus) | Couvertes | Restantes |
|---|---:|---|---:|---:|
| Sport | 175 | football (57/2), joueur (24/2), champion (17/0), tennis (12/0), athlete (11/0), sport (6/2) | 127 | 48 |
| Géographie | 168 | ville (29/5), village (21/0), humain (17/0), riviere (12/2), district (8/0), municipalite (6/0), montagne (7/0), canton (7/4), localite (6/0) | 113 | 55 |
| Politique & Droit | 111 | politi (63/7), electora (10/0), avocat (5/0) | 78 | 33 |
| Nature | 104 | espece (68/0), genre (20/2) | 88 | 16 |
| Sciences | 85 | historien (9/1), langue (7/0), chimique (7/1), logiciel (6/0) | 29 | 56 |
| Musique | 59 | album (22/0), compos (11/7), chanson (9/0), musicien (5/0) | 47 | 12 |
| Arts | 52 | peintre (19/2), tableau (6/0), artiste (6/0) | 31 | 21 |
| Histoire | 49 | evenement (5/0) | 5 | 44 |
| Espace | 49 | asteroide (38/1) | 38 | 11 |
| Littérature | 41 | livre (12/1), roman (8/2), ecrivain (7/4), poete (5/0) | 32 | 9 |
| Patrimoine | 39 | musee (8/1), batiment (5/0) | 13 | 26 |
| Médias | 35 | journal (16/2), revue (7/0) | 23 | 12 |
| !À traiter | 28 | — | 0 | 28 |
| Transports | 27 | route (8/1) | 8 | 19 |
| Religion & Mythes | 25 | catholique (5/1) | 5 | 20 |
| Économie | 23 | entrepr (5/0) | 5 | 18 |
| Fiction & Jeux | 22 | video (11/0) | 11 | 11 |
| Cinéma & TV | 20 | realisat (5/0), episode (5/1) | 10 | 10 |
| **Total** | **1 112** | **47 mots** | **663** | **449** |

- **Le modèle local colle à l'API.** Seuls 4 mots diffèrent, pour deux raisons. `genre`, `peintre` et `ecrivain` ont chacun 1 résultat de plus : une carte obtenue après l'export (Trichoncus, Jules Lentrein, Marjon Hoffman). `municipalite` compte 6 cartes couvertes au lieu de 7, parce que la carte Olanchito est possédée en double et que la forme compacte des résultats ne distingue pas les deux exemplaires.
- La recherche ignore **la casse et les accents** : `espece` = `espèce` (68 résultats identiques), `cinema` = `cinéma`, `FOOTBALL` = `football`. Elle cherche une sous-chaîne : `footballeur` donne 17 résultats, `football` en donne 59.
- **Sensibilité aux seuils** (temps de 12 s par pose, 9 s par recherche, 6 s par page) :

  | Seuil (cartes/mot) | Mots | Cartes couvertes | Gain sur la passe 1 |
  |---:|---:|---:|---:|
  | 3 | 80 | 774 | ×1,44 |
  | 5 | 47 | 663 | ×1,48 |
  | 8 | 26 | 540 | ×1,40 |

  Le gain plafonne vers ×1,5 : les 26 plus gros mots en apportent déjà l'essentiel.

## 2. Comportement de l'interface

Observé le 2026-10-12 dans le Chrome de la personne, avec son accord à chaque étape.

| Question | Réponse | Preuve |
|---|---|---|
| La recherche se combine-t-elle avec « Sans étiquette » ? | **Oui.** | Filtre « Sans étiquette » + `footballeur` → 17 cartes, exactement les 17 de `q=footballeur&untagged=1`. `espece` → 50 cartes en page 1, toutes parmi les 68 de l'API. Le bouton du filtre affiche toujours « Sans étiquette ». Requête observée : `/api/my-collection?sort=rarity&q=espece&untagged=1&page=0&stats=0`. |
| Combien de résultats par page ? | **50.** | `espece` : 50 cartes affichées, puis les 18 restantes après la pose. Une seule page de résultats (17 footballeurs) → **aucune** barre de pagination. |
| La sélection survit-elle à un changement de page ? | **Non.** | « Sans étiquette », 2 cartes cochées en page 1 (« 2 cartes sélectionnées ») → page 2 : « 0 carte sélectionnée » → retour page 1 : 0, aucune carte cochée. |
| Existe-t-il un « tout sélectionner » ? | **Oui : « Tout sélectionner (page) »**, qui devient « Désélectionner la page ». | Dans la barre du bas en mode sélection. Il a coché 50/50 cartes (`espece`) puis 17/17 (`footballeur`), toutes et seulement celles affichées. |
| La recherche se vide-t-elle après « Terminé » ? | **Non.** La recherche, le filtre « Sans étiquette » et le mode sélection restent ; seule la sélection est vidée. | Après la pose, champ = `espece`, puis `footballeur` ; « 0 carte sélectionnée » ; la liste s'est rechargée (18 cartes, puis « Aucune carte trouvée avec ces filtres. »). |
| Temps de pose sur 50 cartes | **6,8 s** jusqu'au bilan, **11,9 s** jusqu'à la liste rechargée. | `espece` → Nature, 50 cartes : « 50 cartes étiquetées. » à 6,8 s du clic sur l'étiquette, liste rechargée à 11,9 s. Sur 17 cartes (`footballeur` → Sport) : 5,5 s et 10,7 s. |

Constats associés :

- **La pose est une seule requête** pour toute la sélection : `POST …supabase.co/rest/v1/user_card_tags?on_conflict=user_card_id,tag_id`. Elle a été vue dans le réseau et ne doit jamais être rejouée par le script (règle 1). Son temps ne dépend presque pas du nombre de cartes : environ +1,3 s entre 17 et 50 cartes. C'est ce qui rend la piste 1 rentable. Les petites poses du mode Ranger (2 à 3 cartes) prendraient environ 10 s de cycle **[non vérifié, extrapolé de 17 et 50 cartes]**.
- **La fenêtre « Appliquer une étiquette » se ferme toute seule**, environ 5 s après le bilan et en même temps que la liste se recharge. Un bandeau « Étiquette appliquée à N cartes. » reste en haut de page. Je n'ai jamais cliqué sur « Terminé ».
- La saisie lance la recherche après environ 0,3 s (« Chargement… »). La liste filtrée arrive 7 à 10 s après la saisie (`footballeur` : 7,2 s ; `espece` : 9,7 s).
- **Pannes du site pendant l'étude**, à gérer (voir les risques) :
  - recherche en échec (« Le chargement de la collection a échoué. Réessaie dans un instant. ») avec une liste vide et une pagination périmée ;
  - `stats` en 500, donc pagination absente ou périmée ;
  - pose en 503, avec « Impossible d'appliquer l'étiquette » : rien n'est écrit, la fenêtre reste ouverte avec la sélection, et un second clic a réussi ;
  - page affichée sans styles après un rechargement.

## 3. Gain

Simulation (`scripts/couverture-piste1.js`) de la passe 1 sur les 1 854 cartes, dans l'ordre réel de « Sans étiquette » trié par date d'ajout :

- **Mode Ranger actuel** (`appliquerSurPage`) : sur la page affichée, une pose par première étiquette présente, la plus fréquente d'abord ; les cartes étiquetées disparaissent et la page se remplit ; page suivante quand il n'y a plus rien à ranger.
- **Piste 1** : pour chaque mot, une recherche ; on coche les cartes du groupe visibles, une pose, et on recommence tant que la page 1 en contient. Le reste passe ensuite par le mode Ranger habituel.

Temps retenus : **12 s par pose** (mesuré : 10,7 à 11,9 s du clic sur l'étiquette à la liste rechargée, plus environ 1 s pour ouvrir la fenêtre et saisir le nom), **9 s par recherche** (mesuré : 7,2 à 9,7 s), **6 s par changement de page** (repère de `docs/wikimasters.md`).

| Mode | Recherches | « Étiqueter » | Changements de page | Durée estimée |
|---|---:|---:|---:|---:|
| Ranger actuel | 0 | 492 | 14 | **≈ 100 min** |
| Piste 1 (663 cartes groupées) + Ranger pour les 449 autres | 47 | 50 + 244 | 0 + 14 | **≈ 67 min** |

**Gain : ×1,48, soit environ 33 min** sur le stock actuel. La passe 2 (72 cartes à plusieurs domaines) est identique dans les deux modes et n'est pas comptée.

- Le résultat tient si le temps de pose varie : ×1,29 avec 4 s par pose, ×1,45 avec 8 s, ×1,55 avec 15 s.
- Le mode Ranger coche aussi carte par carte (80 ms par clic), alors que la piste 1 coche une page en un clic. C'est environ 1,5 min de plus pour Ranger, non compté.
- Le nombre de poses du mode Ranger est **simulé**, pas mesuré sur le site **[non vérifié]**. Les retours en page 1 après un étiquetage ne sont pas simulés : ils coûtent aux deux modes, mais davantage au mode Ranger, qui change de page.
- **Pour les rangements quotidiens** (quelques dizaines de nouvelles cartes), aucun mot ne couvre 5 cartes d'un même domaine : la piste 1 n'apporte rien **[non vérifié, déduit du seuil]**. Son intérêt se limite au rattrapage du stock.

## 4. Risques

1. **Gain modeste** : ×1,5, environ 33 min gagnées une seule fois, contre un mode de plus à tester et à maintenir.
2. **Une recherche en échec ressemble à une recherche vide.** On voit « Aucune carte trouvée avec ces filtres. » (ou « Aucune carte pour l'instant. Ouvrez un paquet ! » sans filtre) avec, au-dessus, « Le chargement de la collection a échoué. Réessaie dans un instant. » et une pagination périmée. Sans détection, le script conclurait « plus rien à ranger pour ce mot » : perte silencieuse, contraire à la règle 5.
3. **Retaper la même valeur ne relance rien** : aucune requête ne part. Pour réessayer, il faut changer la valeur (vider, puis retaper, ou utiliser la forme sans accents).
4. **Pose en échec (503)** : « Impossible d'appliquer l'étiquette » dans la fenêtre, qui reste ouverte, sans « Terminé ». Aujourd'hui, `poserEtiquette` attendrait 90 s puis lancerait un message trompeur (« Le site n'a pas confirmé… ») : il faut reconnaître ce texte.
5. **Pagination absente ou périmée quand `stats` échoue** (500 observés). Avec la recherche, la vue tient presque toujours sur une page, ce qui limite le risque. Le mode Ranger, lui, y est exposé (voir `HANDOFF.md`).
6. **Intrus** : la recherche est une sous-chaîne (« compos » ramène 7 intrus, « politi » aussi). On ne coche donc **jamais** à l'aveugle : seules les cartes du plan, reconnues par leur clé. « Tout sélectionner (page) » ne sert que si toutes les cartes affichées sont dans le plan.
7. **Cartes en double** (2 exemplaires, même clé, ex. Olanchito) : les deux sont cochées et étiquetées, comme dans le mode Ranger.
8. **Le bouton « Sélectionner / Quitter la sélection » a disparu** une fois, après une pose suivie d'une panne de `stats`, alors que la barre de sélection restait affichée. Cause **[non vérifiée]**. `modeSelection` échouerait alors bruyamment, ce qui est acceptable (règle 5).
9. **Ordre des étiquettes** : la piste 1 ne pose que la première étiquette, comme la passe 1 actuelle. L'ordre « dans l'ordre de la description » est donc conservé.

## Recommandation : oui, sous conditions

Conditions :

1. **Après la recréation des tests** (`HANDOFF.md`, suite n° 1). Les comportements nouveaux de `docs/wikimasters.md` doivent d'abord être rejoués dans `test/faux-site.js` : barre de recherche, fenêtre qui se ferme seule, bandeau, messages d'échec.
2. **Comme phase préalable de la passe 1 du mode Ranger**, pas comme un mode séparé : même lecture, même aperçu, même reprise.
3. **Détection des pannes** (risques 2 à 4) écrite et testée **avant** la piste 1. Elle protège aussi le mode Ranger actuel.
4. Si la personne juge que 33 min gagnées une fois ne valent pas un mode de plus, la bonne réponse est **non** : le mode Ranger actuel fait le même travail, en plus long.

### Esquisse de conception (règles 1 à 7)

- **Lecture** (règle 1) : la lecture API actuelle de `modeRanger` suffit. On ajoute le calcul glouton du script (groupes par première étiquette, précision ≥ 0,6, au moins 5 cartes par mot), sans requête supplémentaire. La vérification `q=` de l'étude n'est pas nécessaire à l'usage : le modèle local reproduit l'API.
- **Aperçu** (règle 3) : dans le panneau, sous le résumé actuel, une section « Rangement groupé : 47 recherches pour 663 cartes ». Chaque mot y figure avec son domaine, ses cartes et le nombre de cartes ignorées (intrus). Un seul « Appliquer » lance la phase groupée puis la passe 1 et la passe 2 habituelles.
- **Application, mot par mot** (règle 1 : uniquement les boutons et le champ du site) :
  1. filtre « Sans étiquette », puis saisie du mot dans « Rechercher par titre ou catégorie… » (setter natif de `value` et événement `input`, comme pour le champ d'étiquette) ;
  2. attendre que l'empreinte change sans « Chargement… », et **échouer si** « a échoué » est affiché. On réessaie une fois en changeant la valeur, puis on s'arrête avec un message (règle 5) ;
  3. appeler `appliquerSurPage` avec un plan réduit aux cartes du groupe ({clé → [domaine]}) et `num = null`. Elle coche déjà par clé, vérifie le nombre de cartes cochées, pose et recommence tant que la page en contient. Elle couvre donc la piste 1 sans nouvelle boucle ;
  4. `poserEtiquette` doit aussi accepter que la fenêtre se ferme seule, et reconnaître « Impossible d'appliquer l'étiquette » pour s'arrêter tout de suite avec un message clair.
- **Reprise** (règle 4) : `fait` est enregistré au fil de l'eau (`clé§étiquette`). Une relance saute les mots déjà traités, puis les cartes déjà posées.
- **Pagination** (règle 6) : avec une recherche, une vue de moins de 50 cartes n'a pas de pagination, et `num = null` évite d'en dépendre. Au-delà de 50 résultats, on ne passe en page 2 que si la page 1 ne contient plus que des intrus.
- **Rien d'irréversible** (règle 2) : seulement « Étiqueter ». Jamais « Retirer l'étiquette », « Défausser » ni « Mettre en favori », qui sont dans la même barre.
- **Messages** (règle 7) : « Rangement groupé : recherche « football » (12/47) — 57 cartes à ranger en #Sport… », puis « Le site n'a pas pu afficher la recherche « canton ». Recharge la page puis relance : ce qui est fait reste fait. »
- **Test d'abord** (`test/page.test.js`) : sur le faux site, avec une barre de recherche filtrant par sous-chaîne sans accents, vérifier que des intrus ne sont jamais cochés, qu'un échec de recherche arrête le script, et qu'une recherche au résultat vide passe au mot suivant.

## Annexe — relancer l'analyse

1. **Export** : dans la console d'un onglet Collection connecté, lire toutes les pages de `/api/my-collection?sort=added&untagged=1&page=<n>&stats=0`, en GET, 3 en parallèle au maximum, jusqu'à la première page incomplète. Garder pour chaque élément `{ t: card.wikipedia_title, d: card.category, r: card.rarity, tags, obtenu: obtained_at }` et enregistrer le tableau en JSON. L'export contient la collection de la personne : il reste hors du dépôt.
2. `node scripts/couverture-piste1.js export.json --mots mots.json` → couverture estimée et liste des mots.
3. Pour chaque mot de `mots.json`, lire toutes les pages de `q=<mot>&untagged=1`, puis enregistrer `{ "<mot>": [cartes ou rang dans l'export] }`.
4. `node scripts/couverture-piste1.js export.json --recherches res.json [--pose 12 --recherche 9 --page 6 --min 5 --precision 0.6]` → couverture réelle et gain.
