#!/bin/sh
# Vérifie les sources, lance les tests, puis assemble dist/wikimasters-rangement.user.js
# (en-tête Tampermonkey + IIFE autour de src/regles.js et src/app.js).
set -e
cd "$(dirname "$0")"

node --check src/regles.js
node --check src/app.js
npm test --silent
# une mutation dont le texte d'origine a disparu du code ne vérifie plus rien
"$(command -v python3 || command -v python)" scripts/regressions.py --ancres

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
