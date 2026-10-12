#!/bin/sh
# Vérifie les sources, lance les tests, puis assemble dist/wikimasters-rangement.user.js
# (en-tête Tampermonkey + IIFE autour de src/regles.js et src/app.js).
set -e
cd "$(dirname "$0")"

node --check src/regles.js
node --check src/app.js
# sans fichier de test, node --test sort vert quand même : on exige « tests N » avec N > 0
# (« # tests N » en TAP, « ℹ tests N » avec la sortie par défaut de Node 23 et plus)
SORTIE=$(npm test --silent 2>&1) || { echo "$SORTIE"; exit 1; }
echo "$SORTIE" | grep -E '^(#|ℹ) (tests|pass|fail) '
echo "$SORTIE" | grep -qE '^(#|ℹ) tests [1-9]' || { echo "Aucun test n'a tourné : build refusé."; exit 1; }
# une mutation dont le texte d'origine a disparu du code ne vérifie plus rien
# le premier Python qui marche vraiment (sous Windows, « python3 » peut être un raccourci vers le Microsoft Store)
PY=$(for p in python3 python; do "$p" -c '' 2>/dev/null && { echo "$p"; break; }; done)
[ -n "$PY" ] || { echo "Python introuvable : build refusé."; exit 1; }
"$PY" scripts/regressions.py --ancres

VERSION=$(node -p "require('./package.json').version")
OUT=dist/wikimasters-rangement.user.js
mkdir -p dist
{
  cat <<EOF
// ==UserScript==
// @name         WikiMasters — Rangement des cartes
// @namespace    wikimasters-rangement
// @version      $VERSION
// @description  Étiquette tes cartes WikiMasters par domaine (aperçu avant application, jamais de défausse).
// @match        https://www.wiki-masters.com/*
// @match        https://wiki-masters.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
'use strict';

EOF
  cat src/regles.js
  echo
  cat src/app.js
  echo '})();'
} > "$OUT"

node --check "$OUT"
echo "Construit : $OUT (v$VERSION)"
