// Vérifie les sources, lance les tests, puis assemble dist/wikimasters-rangement.user.js
// (en-tête Tampermonkey + IIFE autour de src/regles.js et src/app.js).
// En Node plutôt qu'en shell : « sh » n'existe pas dans le PowerShell de la personne.
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const racine = path.join(__dirname, '..');
process.chdir(racine);
const echec = (msg) => { console.error(msg); process.exit(1); };

for (const f of ['src/regles.js', 'src/app.js']) execFileSync(process.execPath, ['--check', f], { stdio: 'inherit' });

// sans fichier de test, node --test sort vert quand même : on exige « tests N » avec N > 0
// (« # tests N » en TAP, « ℹ tests N » avec la sortie par défaut de Node 23 et plus)
const npm = spawnSync('npm test --silent', { shell: true, encoding: 'utf8', maxBuffer: 1 << 28 });
const sortie = (npm.stdout || '') + (npm.stderr || '');
if (npm.status !== 0) echec(sortie);
console.log(sortie.split('\n').filter((l) => /^(#|ℹ) (tests|pass|fail) /.test(l)).join('\n'));
if (!/^(#|ℹ) tests [1-9]/m.test(sortie)) echec("Aucun test n'a tourné : build refusé.");

// une mutation dont le texte d'origine a disparu du code ne vérifie plus rien
// le premier Python qui marche vraiment (sous Windows, « python3 » peut être un raccourci vers le Microsoft Store)
const py = ['python3', 'python'].find((p) => spawnSync(p, ['-c', ''], { stdio: 'ignore' }).status === 0);
if (!py) echec('Python introuvable : build refusé.');
const anc = spawnSync(py, ['scripts/regressions.py', '--ancres'], { stdio: 'inherit', env: { ...process.env, PYTHONUTF8: '1' } });
if (anc.status !== 0) process.exit(anc.status || 1);

const version = require('../package.json').version;
const sortieJs = 'dist/wikimasters-rangement.user.js';
const entete = `// ==UserScript==
// @name         WikiMasters — Rangement des cartes
// @namespace    wikimasters-rangement
// @version      ${version}
// @description  Étiquette tes cartes WikiMasters par domaine (aperçu avant application, jamais de défausse).
// @match        https://www.wiki-masters.com/*
// @match        https://wiki-masters.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
'use strict';

`;
const lire = (f) => fs.readFileSync(f, 'utf8');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(sortieJs, entete + lire('src/regles.js') + '\n' + lire('src/app.js') + '})();\n');

execFileSync(process.execPath, ['--check', sortieJs], { stdio: 'inherit' });
console.log(`Construit : ${sortieJs} (v${version})`);
