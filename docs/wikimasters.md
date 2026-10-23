# Fiche du site WikiMasters

Ce que le script doit savoir de wiki-masters.com. Chaque **piège** ci-dessous a causé un bug livré : tout code qui touche la page le respecte, et `test/faux-site.js` le rejoue.

Vocabulaire : une **vue** est la liste affichée pour un filtre d'étiquette (« Toutes les étiquettes », « Sans étiquette », « #Sport »…) et un tri, découpée en pages de 50 cartes.

## Explorer le vrai site

- Le Chrome de la personne s'utilise en lecture seule ; toute action (clic, étiquetage) attend son accord explicite dans la conversation.
- Réseau : armer `read_network_requests` **puis recharger** la page, la surveillance ne capte que la suite.
- Crochet de débogage du script installé : `localStorage.setItem('wmr_debug','true')`, recharger, puis `window.__WMR`.
- Un onglet en arrière-plan est fortement ralenti par Chrome : garder l'onglet de la Collection au premier plan.
- Claude in Chrome ne fonctionne pas dans Opera GX (« No group with id » à chaque appel : pas de groupes d'onglets) : utiliser Chrome. Quand Opera GX et Chrome sont connectés tous les deux, `list_connected_browsers` puis `select_browser` sur Chrome (le plus récemment connecté, le 2026-10-13).
- La réponse de l'outil JavaScript est coupée vers 1 000 caractères : pour rapatrier un export, le faire télécharger en fichier (Blob), avec l'accord de la personne, ou le renvoyer par morceaux avec une somme de contrôle.

## API de lecture

La même que la page Collection, avec les cookies de session de la page. Lecture seule (règle 1 de `CODING_STANDARDS.md`).

`GET /api/my-collection?sort=<rarity|added>&page=<n>&stats=0[&untagged=1][&tag_id=<id>][&q=<texte>]`

- `page` commence à **0** ; **50** cartes par page ; ~**5 s** par requête ; **3** requêtes en parallèle au maximum.
- **Erreurs 500 passagères** (vues le 2026-10-12, aussi bien sur la liste que sur `stats`) : relire la même page quelques secondes plus tard a toujours suffi. Toujours vérifier `r.ok`.
- `sort=added` : la plus récente d'abord. La page Collection, elle, demande `sort=rarity` par défaut.
- `q` = la barre de recherche (« Rechercher par titre ou catégorie… »), filtrée côté serveur, combinable avec `untagged=1` (vérifié : `q=footballeur&untagged=1` → 17 cartes). C'est une **sous-chaîne** du titre ou de la catégorie, **sans casse ni accents** (vérifié : `espece` = `espèce`, `cinema` = `cinéma`, `FOOTBALL` = `football` donnent exactement les mêmes cartes ; `football` en trouve 59, `footballeur` 17).
- Réponse : `collection[]` avec `obtained_at`, `tags[{id,name,color}]`, `card{wikipedia_title, category, rarity}`. Titre = `wikipedia_title`, description = `category`. La clé `titre|description|rareté` identifie la carte affichée, dans le même ordre que l'écran.

`GET /api/my-collection/stats?<mêmes filtres>` → `{ total, rarityCounts, tagOptions }`.

## Pièges de l'interface

**Pagination**
- « Page X / Y » arrive plusieurs secondes **après** les cartes, et son total est faux (64 pages annoncées, 53 réelles). Une vue se termine sur la première page incomplète ou vide.
- Changer de page prend ~6 s ; « Chargement… » remplace l'indicateur. La page a changé quand l'**empreinte** (titres affichés, dans l'ordre) a changé.
- Après un étiquetage, la liste se recharge et peut revenir en page 1. Dans « Sans étiquette », les cartes étiquetées disparaissent et les suivantes remontent.
- Le total « Y » vient de `/api/my-collection/stats`. Quand cette requête échoue (500), la pagination **reste celle de la vue précédente** (« Page 1 / 38 » affiché sur une recherche de 2 pages) ou **disparaît** entièrement, alors que les cartes sont là.
- Une vue d'une seule page (moins de 50 cartes, ex. une recherche) n'a **aucune** barre de pagination.
- Juste après l'ouverture (ou le rechargement) de la page, le menu des étiquettes peut s'ouvrir **sans ses options** : « Sans étiquette » n'y était pas encore (journal des bugs de la personne, 2026-10-12). Attendre les options, refermer et rouvrir au besoin.
- Un rechargement peut aussi s'annoncer par une roue et « Actualisation… » dans la barre de sélection, sans le texte « Chargement… » (vu après avoir vidé la recherche).

**Recherche**
- Champ `input[placeholder*="Rechercher"]` (« Rechercher par titre ou catégorie… »). Se combine avec le filtre d'étiquette (« Sans étiquette » + `footballeur` → 17 cartes) ; le filtre garde son libellé.
- La requête part ~0,3 s après la saisie (« Chargement… ») ; la liste filtrée arrive **7 à 10 s** après. Retaper la **même** valeur ne relance rien : pour réessayer, changer la valeur (la recherche ignore la casse : `album` → `ALBUM` donne les mêmes cartes).
- Le serveur **rate des recherches** au hasard, environ une toutes les 2 à 3 minutes pendant un rangement (journal des bugs de la personne, 2026-10-12 : `album`, `musicien`, `espece`) ; la même recherche relancée passe en général.
- **Échec de chargement** : « Le chargement de la collection a échoué. Réessaie dans un instant. » au-dessus d'une liste vide (« Aucune carte trouvée avec ces filtres. », ou sans filtre « Aucune carte pour l'instant. Ouvrez un paquet ! ») et d'une pagination périmée. Ça ressemble à une vue vide : chercher ce texte avant de conclure qu'une vue est terminée.
- La recherche, le filtre et le mode sélection **restent en place après un étiquetage** ; seule la sélection est vidée. Un rechargement de l'onglet remet tout à zéro (« Toutes les étiquettes », recherche vide).

**Carte**
- Bloc `div[class*="glow-"]` : `h3` = titre, `p` = description (**absent** si vide), badge de rareté `div.absolute.top-2.left-2`, étiquettes `span.rounded-full` (2 visibles + « +N »).

**Sélection**
- En mode sélection, c'est **la carte** qui reçoit le clic ; le calque `ring-4` qui l'entoure est purement visuel (il dit si elle est cochée).
- Hors mode sélection, un clic sur une carte ouvre sa fiche, avec « Défausser » : vérifier le mode avant chaque clic.
- En mode sélection, une barre en bas de page affiche « N carte(s) sélectionnée(s) » (le nombre et le texte sont sur deux lignes : `\s*` entre eux) et les boutons « Tout sélectionner (page) » (devient « Désélectionner la page »), « Étiqueter », « Retirer l'étiquette », « Mettre en favori (N) », « Retirer des favoris (N) », « Défausser (+N) ».
- « Tout sélectionner (page) » coche toutes les cartes affichées, et seulement elles (vérifié sur 50/50 et 17/17).
- **La sélection ne survit pas à un changement de page** : 2 cartes cochées en page 1 → page 2 « 0 carte sélectionnée » → retour page 1, plus rien de coché.
- Après une pose suivie d'un échec de `stats`, le bouton du haut (« Sélectionner » / « Quitter la sélection ») a **disparu** alors que la barre du bas restait affichée ; il n'est pas revenu après fermeture du bandeau. Cause non établie.
- La page peut être défilée : relire la position d'un élément (`getBoundingClientRect`) avant tout clic par coordonnées.

**Étiqueter**
- « Étiqueter » ouvre la fenêtre « Appliquer une étiquette » : champ « Chercher ou créer une étiquette… » (setter natif de `value` + événement `input`), un bouton par étiquette, sinon « Créer <nom> » (créer applique aussi).
- Après application, la fenêtre affiche « N carte(s) étiquetée(s). (M déjà étiquetée) » et **« Terminé »**, parfois après plusieurs secondes.
- Observé le 2026-10-12 : la fenêtre **se ferme ensuite toute seule**, ~5 s après le bilan, en même temps que la liste se recharge ; un bandeau « Étiquette appliquée à N cartes. » reste en haut de page, avec un bouton de fermeture `aria-label="Fermer"` (le même libellé que la croix de la fenêtre). Chronométré du clic sur l'étiquette : 50 cartes → bilan à 6,8 s, liste rechargée à 11,9 s ; 17 cartes → 5,5 s et 10,7 s. Le temps dépend donc peu du nombre de cartes.
- Une pose = **une** requête du site pour toute la sélection (`POST …/rest/v1/user_card_tags?on_conflict=user_card_id,tag_id`, Supabase). Observée dans le réseau seulement : le script ne l'appelle jamais (règle 1).
- **Échec de pose** : la requête a répondu une fois 503 → « Impossible d'appliquer l'étiquette » en rouge dans la fenêtre, qui reste ouverte avec la sélection, sans « Terminé » ; rien n'est écrit. Un second clic sur l'étiquette a réussi.
- Le champ filtre les étiquettes par sous-chaîne : « Sport » propose « Sport » **et** « Transports ». Choisir le bouton au texte exact.

**Retirer l'étiquette** (observé le 2026-10-13 sur une carte, « Cour d'appel de Besançon », avec l'accord de la personne)
- « Retirer l'étiquette » (barre du bas, mode sélection) ouvre la fenêtre « Retirer une étiquette » / « Sur N carte(s) sélectionnée(s). » : champ « Chercher une étiquette… » et **un bouton par étiquette portée par la sélection**, texte « nom » puis le nombre de cartes sélectionnées qui la portent (`innerText` : `!À traiter\n1`). Pas d'élément `role=dialog`. Le bouton est grisé quand la sélection ne porte aucune étiquette.
- Un clic sur l'étiquette la retire **tout de suite**, sans `confirm` natif : bilan « N carte désétiquetée. » et bouton « Terminé » ; bandeau « Étiquette retirée des cartes sélectionnées. » en haut ; « Actualisation… » dans la barre du bas.
- Contrairement à « Étiqueter », la fenêtre **ne se ferme pas seule** (encore ouverte après 7 s) : cliquer « Terminé ». Après « Terminé », la **sélection est gardée** (« 1 carte sélectionnée »).
- La requête d'écriture n'est pas apparue dans la surveillance réseau (seulement la relecture des étiquettes, `GET …/rest/v1/tags`). Le script ne l'appelle jamais (règle 1).
- Utilisé par Ranger depuis la v1.9.7 pour retirer `!À traiter` (et elle seule) : le bouton de la fenêtre est cherché au texte exact `!À traiter`, éventuellement suivi d'un saut de ligne et du nombre. Le script quitte le mode sélection juste après « Terminé » pour vider la sélection gardée par le site (cartes sorties de la vue comprises). Le faux site rejoue tout cela (`ouvrirRetirer`).
- **À vérifier au premier usage réel** : la forme des `tagOptions` de `/api/my-collection/stats` (le script cherche `name` ou `tag.name`, et `id`, `tag_id` ou `tag.id`). Si l'id est introuvable, Ranger saute les cartes `!À traiter` et le dit dans son journal.

**Filtres et étiquettes**
- Le bouton du filtre actif affiche « #Nom (n) » : comparer les libellés sans le « (n) ».
- Supprimer une étiquette (« Gérer les étiquettes… ») déclenche un **`window.confirm` natif**. Son texte exact n'a jamais été relevé sur le vrai site : le noter ici dès qu'on le voit.
