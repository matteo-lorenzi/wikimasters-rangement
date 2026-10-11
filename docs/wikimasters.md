# Fiche du site WikiMasters

Ce que le script doit savoir de wiki-masters.com. Chaque **piège** ci-dessous a causé un bug livré : tout code qui touche la page le respecte, et `test/faux-site.js` le rejoue.

Vocabulaire : une **vue** est la liste affichée pour un filtre d'étiquette (« Toutes les étiquettes », « Sans étiquette », « #Sport »…) et un tri, découpée en pages de 50 cartes.

## Explorer le vrai site

- Le Chrome de la personne s'utilise en lecture seule ; toute action (clic, étiquetage) attend son accord explicite dans la conversation.
- Réseau : armer `read_network_requests` **puis recharger** la page, la surveillance ne capte que la suite.
- Crochet de débogage du script installé : `localStorage.setItem('wmr_debug','true')`, recharger, puis `window.__WMR`.
- Un onglet en arrière-plan est fortement ralenti par Chrome : garder l'onglet de la Collection au premier plan.

## API de lecture

La même que la page Collection, avec les cookies de session de la page. Lecture seule (règle 1 de `CODING_STANDARDS.md`).

`GET /api/my-collection?sort=<rarity|added>&page=<n>&stats=0[&untagged=1][&tag_id=<id>][&q=<texte>]`

- `page` commence à **0** ; **50** cartes par page ; ~**5 s** par requête ; **3** requêtes en parallèle au maximum.
- `sort=added` : la plus récente d'abord.
- `q` = la barre de recherche (« Rechercher par titre ou catégorie… »), filtrée côté serveur, combinable avec `untagged=1` (vérifié : `q=footballeur&untagged=1` → 17 cartes).
- Réponse : `collection[]` avec `obtained_at`, `tags[{id,name,color}]`, `card{wikipedia_title, category, rarity}`. Titre = `wikipedia_title`, description = `category`. La clé `titre|description|rareté` identifie la carte affichée, dans le même ordre que l'écran.

`GET /api/my-collection/stats?<mêmes filtres>` → `{ total, rarityCounts, tagOptions }`.

## Pièges de l'interface

**Pagination**
- « Page X / Y » arrive plusieurs secondes **après** les cartes, et son total est faux (64 pages annoncées, 53 réelles). Une vue se termine sur la première page incomplète ou vide.
- Changer de page prend ~6 s ; « Chargement… » remplace l'indicateur. La page a changé quand l'**empreinte** (titres affichés, dans l'ordre) a changé.
- Après un étiquetage, la liste se recharge et peut revenir en page 1. Dans « Sans étiquette », les cartes étiquetées disparaissent et les suivantes remontent.

**Carte**
- Bloc `div[class*="glow-"]` : `h3` = titre, `p` = description (**absent** si vide), badge de rareté `div.absolute.top-2.left-2`, étiquettes `span.rounded-full` (2 visibles + « +N »).

**Sélection**
- En mode sélection, c'est **la carte** qui reçoit le clic ; le calque `ring-4` qui l'entoure est purement visuel (il dit si elle est cochée).
- Hors mode sélection, un clic sur une carte ouvre sa fiche, avec « Défausser » : vérifier le mode avant chaque clic.

**Étiqueter**
- « Étiqueter » ouvre la fenêtre « Appliquer une étiquette » : champ « Chercher ou créer une étiquette… » (setter natif de `value` + événement `input`), un bouton par étiquette, sinon « Créer <nom> » (créer applique aussi).
- Après application, la fenêtre **reste** ouverte et affiche « N carte(s) étiquetée(s). (M déjà étiquetée) » puis **« Terminé »**, parfois après plusieurs secondes.

**Filtres et étiquettes**
- Le bouton du filtre actif affiche « #Nom (n) » : comparer les libellés sans le « (n) ».
- Supprimer une étiquette (« Gérer les étiquettes… ») déclenche un **`window.confirm` natif**. Son texte exact n'a jamais été relevé sur le vrai site : le noter ici dès qu'on le voit.
