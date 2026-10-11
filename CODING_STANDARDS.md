# Règles de relecture

Choix de conception qu'aucun test ne vérifie à lui seul. Tout ce qui se vérifie mécaniquement va dans `test/`.

1. **Écriture sur le compte : toujours par les boutons du site** (Étiqueter, Gérer les étiquettes…). L'API sert uniquement à lire. Aucun appel qui modifie des données, aucun jeton de session lu ou réutilisé.
2. **Rien d'irréversible sans confirmation de la personne dans le panneau**, avec la liste de ce qui va disparaître. Le script ne touche jamais à Défausser, aux enchères ni aux échanges.
3. **Aperçu avant application** : chaque mode lit, montre ce qu'il fera, et attend « Appliquer ».
4. **Reprise sans perte** : ce qui est fait est enregistré au fil de l'eau, une relance repart de là, et un rechargement de page ne fait pas perdre une lecture.
5. **Échec bruyant** : une situation inattendue (fenêtre absente, sélection incohérente, site bloqué) arrête le script avec un message qui dit quoi faire, plutôt que de continuer avec des données incomplètes.
6. **Ne jamais se fier au compteur de pages du site** : une vue se termine sur la première page incomplète ou vide (voir `docs/wikimasters.md`).
7. **Messages du panneau en français, adressés à la personne** : ce qui s'est passé et quoi faire ensuite, sans jargon technique.
