// Charge les sources comme le build : src/regles.js puis src/app.js, dans un même contexte.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = process.env.WMR_SRC || path.join(__dirname, '..', 'src');
const lire = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

// Le moteur seul, dans un contexte vm séparé.
// Ses tableaux viennent d'un autre « monde » : les recopier ([...x]) avant deepEqual.
const chargerRegles = () => vm.runInContext(lire('regles.js') + '\n;({ DOMAINES, AMBIGUS, IGNORER, classer, norm, A_TRAITER });', vm.createContext({}));

// Le userscript complet, tel que le build l'assemble (IIFE autour de regles.js puis app.js).
const sourceScript = () => `(function () {\n'use strict';\n${lire('regles.js')}\n${lire('app.js')}\n})();`;

module.exports = { chargerRegles, sourceScript, SRC };
