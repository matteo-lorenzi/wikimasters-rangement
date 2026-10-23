# Glossaire

Les mots que la personne et Claude emploient pour parler des cartes.

**Domaine** : une étiquette thématique de la liste `DOMAINES` (Sport, Musique, Sciences…). Une carte en porte 5 au plus.

**Étiquette** : ce que le site affiche sur une carte. C'est un domaine, une étiquette de gestion (`!À vendre`, `!À garder`, `!Doublon`, `!À traiter`) ou une collection (`★Village Polonais`).

**Carte sans règle** : une carte qu'aucun mot du moteur ne range. Elle reste « Sans étiquette ».

**Carte ambiguë** : une carte dont seul un mot qui ne suffit pas a été trouvé (« groupe », « navigateur »…). Le script lui pose `!À traiter`.

**Carte ignorée** : une page d'homonymie, une liste, un nom de famille ou un prénom. Elle reste volontairement sans étiquette, et n'est jamais envoyée à Wikipédia.

**Lot** : un groupe de cartes traité en une fois, le temps d'un « Ranger ».

**Couverture (Wikipédia)** : la part des cartes lues dans Wikipédia que leur phrase range dans un domaine. Cartes classées d'après Wikipédia / cartes concernées lues (celles laissées de côté par l'essai ne comptent pas ; un appel bloqué compte comme un échec). Les « 68 % » mesurés par la personne (434 sur ~640) sont une couverture. Elle ne dit pas si les domaines sont justes.

**Précision (Wikipédia)** : la part des cartes classées d'après Wikipédia dont les domaines sont justes, d'après une vérité (`test/reference-wikipedia.json`). Elle ne se calcule qu'avec cette vérité, donc par `npm run essai`, pas dans le navigateur. Essai du 2026-10-23 : 20 justes sur 23 classées (~87 %).

**Phrase Wikipédia** : le morceau de la première phrase d'un article qui suit « est un / une / le / la » (« sorcière irlandaise… »). Le moteur la lit comme une description pour ranger une carte qui n'en a pas.
