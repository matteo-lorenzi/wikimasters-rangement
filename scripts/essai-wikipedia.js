#!/usr/bin/env node
// Essai Wikipédia hors navigateur : rejoue le moteur actuel (src/regles.js) sur les phrases d'un rapport,
// sans réseau, puis mesure la couverture et la précision. Format : docs/tests.md, « Mesure Wikipédia ».
//
//   npm run essai                              rapport resultats/rapport-wikipedia.json (sinon la référence)
//   npm run essai -- fichier.json              un autre rapport (copié depuis l'aperçu de Ranger)
//   npm run essai -- fichier.json --verite v.json --sortie dossier
//
// Code de sortie 1 si la référence (rapport = vérité) a une précision sous REGLAGES.wikipedia.precisionMinimale.

// Écrit resultats/essai-<AAAA-MM-JJ-HHMM>.json et imprime un résumé.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { sourceScript } = require('../test/charger.js');

const RACINE = path.join(__dirname, '..');
const DEFAUT = path.join('resultats', 'rapport-wikipedia.json');
const REFERENCE = path.join('test', 'reference-wikipedia.json');

const args = process.argv.slice(2);
const option = (nom, def) => { const i = args.indexOf(nom); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const fichierVerite = option('--verite', REFERENCE);
const dossierSortie = option('--sortie', path.join(RACINE, 'resultats'));
// Le minimum de précision vient de REGLAGES (src/regles.js), lu par une petite évaluation vm ; --minimum 0.9 pour l'essayer autrement.
const minimum = +option('--minimum', vm.runInContext(
  fs.readFileSync(path.join(process.env.WMR_SRC || path.join(RACINE, 'src'), 'regles.js'), 'utf8') + '\n;REGLAGES.wikipedia.precisionMinimale;', vm.createContext({})));
let source = args[0] || DEFAUT;

const lireJson = (f) => {
  try { return JSON.parse(fs.readFileSync(path.resolve(RACINE, f), 'utf8')); }
  catch (e) { console.error(`Impossible de lire ${f} : ${e.message}`); process.exit(1); }
};
if (!args[0] && !fs.existsSync(path.resolve(RACINE, source))) {
  console.log(`Pas de rapport dans ${DEFAUT} (colle-y le JSON copié depuis l'aperçu de Ranger) : essai sur la référence ${REFERENCE}.`);
  source = REFERENCE;
}

// Le userscript complet, comme le build l'assemble, dans un contexte vm sans page : seules les fonctions pures servent.
const stockage = {};
const fenetre = { __WMR_TEST__: true };
vm.runInContext(sourceScript(), vm.createContext({
  window: fenetre, console, setTimeout, clearTimeout, navigator: {},
  localStorage: { getItem: (k) => (k in stockage ? stockage[k] : null), setItem: (k, v) => { stockage[k] = String(v); } },
}));
const W = fenetre.__WMR;
const monde = (x) => JSON.parse(JSON.stringify(x)); // les objets du contexte vm, recopiés dans celui-ci
const nfc = (s) => String(s || '').normalize('NFC').trim();

const debut = Date.now();
const rapport = lireJson(source);
if (!Array.isArray(rapport.cartes)) { console.error(`${source} : pas de liste « cartes ».`); process.exit(1); }
const ref = lireJson(fichierVerite);
const verite = {};
for (const c of ref.cartes || []) if (Array.isArray(c.attendu)) verite[nfc(c.titre)] = { attendu: c.attendu, acceptables: c.acceptables || [] };

// Chaque carte : la phrase rejouée dans le moteur actuel ; sans phrase, la cause lue dans le rapport.
const cartes = rapport.cartes.map((c) => {
  const x = { titre: c.titre, rarete: c.rarete ?? null, etape: c.etape || 'reference' };
  // sans phrase mais avec un extrait : l'extraction actuelle (morceauWikipedia) est rejouée sur l'extrait
  const phrase = c.phrase || (c.extrait ? W.morceauWikipedia(c.extrait) : null);
  // une page de dates (C4) sort du dénominateur de la couverture : ni phrase classée, ni échec
  if (W.pageDeDate(c.titre, c.phrase || c.extrait || '')) Object.assign(x, { cause: 'page-ignoree', domaines: [] });
  else if (phrase) Object.assign(x, { phrase }, monde(W.classerPhrase({ t: c.titre, d: '' }, phrase)));
  else Object.assign(x, { cause: c.cause, domaines: [] }, c.extrait ? { extrait: c.extrait } : {});
  if (!W.CAUSES_WIKIPEDIA.includes(x.cause)) { console.error(`${c.titre} : cause inconnue « ${x.cause} ».`); process.exit(1); }
  if (c.redirection) x.redirection = c.redirection;
  if (c.cause && c.cause !== x.cause) x.avant = c.cause; // le moteur actuel ne donne plus le résultat du rapport
  const v = verite[nfc(c.titre)];
  if (v && x.cause === 'classee') x.jugement = W.jugerWikipedia(x.domaines, v);
  return x;
});
const bilan = monde(W.bilanWikipedia(cartes, verite));
// Les anciens rapports (avant la prochaine version) coupent l'extrait à 250 caractères (« … » en 250e) alors que l'extraction cherche sur 300 :
// le rejeu d'extraction y est incomplet.
const coupes = rapport.cartes.filter((c) => c.extrait && c.extrait.length === 250 && c.extrait.endsWith('…')).length;
const avertissements = coupes ? [`extraits coupés à 250 caractères dans ce rapport (${coupes} carte(s)) : le rejeu de l'extraction est incomplet, relis les cartes avec une version récente du script (extraits de 500 caractères)`] : [];

// Le mot responsable d'une carte fausse : celui qui donne un domaine que la vérité n'attend pas.
const domainesDuMot = (m) => monde(W.classerPhrase({ t: '', d: '' }, m)).domaines;
const fausses = cartes.filter((c) => c.jugement === 'fausse').map((c) => {
  const v = verite[nfc(c.titre)];
  const pasAttendus = c.domaines.filter((d) => !v.attendu.includes(d));
  return {
    titre: c.titre, phrase: c.phrase, domaines: c.domaines, attendu: v.attendu, acceptables: v.acceptables,
    motsResponsables: [...new Set(c.mots.filter((m) => domainesDuMot(m).some((d) => pasAttendus.includes(d))))],
  };
});

const pad = (n) => String(n).padStart(2, '0');
const maintenant = new Date();
const nom = `essai-${maintenant.getFullYear()}-${pad(maintenant.getMonth() + 1)}-${pad(maintenant.getDate())}-${pad(maintenant.getHours())}${pad(maintenant.getMinutes())}.json`;
const resultat = {
  outil: 'wmr-essai-wikipedia', format: 1, date: maintenant.toISOString(),
  source, verite: fichierVerite, versionRegles: require('../package.json').version,
  versionRapport: rapport.version ?? null, dateRapport: rapport.date ?? null, essai: rapport.essai ?? null,
  dureeMs: rapport.dureeMs ?? null, requetes: rapport.requetes ?? null, lots: rapport.lots || [], erreurs: rapport.erreurs || [],
  dureeEssaiMs: Date.now() - debut,
  avertissements, ...bilan, fausses, changements: cartes.filter((c) => c.avant).length, cartes,
};
fs.mkdirSync(dossierSortie, { recursive: true });
const sortie = path.join(dossierSortie, nom);
fs.writeFileSync(sortie, W.jsonRapport(resultat) + '\n');

// Le résumé
const pc = (t) => (t == null ? '—' : Math.round(t * 100) + ' %');
const cv = bilan.couverture, pr = bilan.precision;
const l = [];
l.push(`Essai Wikipédia — ${source}${rapport.version ? ` (rapport v${rapport.version}${rapport.date ? ' du ' + rapport.date : ''})` : ''}`);
l.push(`Moteur actuel (v${resultat.versionRegles}) rejoué sur ${cartes.length} carte(s), sans réseau.`);
l.push(`Couverture : ${cv.classees} / ${cv.lues} (${pc(cv.taux)}) des cartes lues classées d'après Wikipédia (hors ${bilan.pagesIgnorees} page(s) de dates).`);
if (bilan.pagesIgnorees) l.push(`Couverture brute : ${cv.classees} / ${cv.lues + bilan.pagesIgnorees} (${pc(cv.classees / (cv.lues + bilan.pagesIgnorees))}), pages de dates comprises.`);
l.push(pr ? `Précision : ${pr.justes} / ${pr.verifiees} (${pc(pr.taux)}) des cartes classées sont justes (vérité : ${fichierVerite}).`
  : `Précision : pas mesurée (aucune carte classée n'a d'étiquettes attendues dans ${fichierVerite}).`);
l.push('Par cause :');
for (const [k, n] of Object.entries(bilan.parCause)) if (n) l.push(`  ${k.padEnd(22)} ${n}`);
if (rapport.requetes != null) l.push(`Lecture : ${rapport.requetes} requête(s), ${(rapport.lots || []).length} lot(s), ${((rapport.dureeMs || 0) / 1000).toFixed(1)} s.`);
for (const e of rapport.erreurs || []) l.push(`Erreur : ${e}`);
for (const a of avertissements) l.push(`Attention : ${a}`);
if (fausses.length) {
  l.push('Cartes fausses :');
  for (const f of fausses) l.push(`  - ${f.titre} : « ${f.phrase} » → ${f.domaines.join(', ')} (attendu : ${f.attendu.join(' ou ')})`
    + (f.motsResponsables.length ? ` ; mot responsable : ${f.motsResponsables.join(', ')}` : ''));
}
if (resultat.changements) l.push(`${resultat.changements} carte(s) dont le résultat a changé depuis le rapport (champ « avant »).`);
l.push(`Résultat écrit : ${path.relative(RACINE, sortie) || sortie}`);
console.log(l.join('\n'));

// Garde-fou : la référence rejouée sur elle-même ne doit pas passer sous REGLAGES.wikipedia.precisionMinimale.
if (pr && path.resolve(RACINE, source) === path.resolve(RACINE, fichierVerite) && pr.taux < minimum) {
  console.error(`Précision ${pc(pr.taux)} sous le minimum de ${pc(minimum)} (REGLAGES.wikipedia.precisionMinimale dans src/regles.js). `
    + 'Une modification des règles ou de l\'extraction a fait baisser la précision : regarde les « Cartes fausses » ci-dessus et corrige la règle ou annule-la. '
    + 'Ne baisse le minimum que si la personne a changé un jugement de la référence ; il se relève à chaque amélioration, jusqu\'à 95 %.');
  process.exit(1);
}
