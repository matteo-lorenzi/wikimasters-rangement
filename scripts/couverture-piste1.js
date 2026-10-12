#!/usr/bin/env node
// Étude « piste 1 » : étiqueter par groupes grâce à la barre de recherche.
//
//   node scripts/couverture-piste1.js <export.json> [--recherches <res.json>] [--mots <sortie.json>]
//        [--min 5] [--precision 0.6] [--pose 12] [--page 6] [--recherche 9]
//
// export.json : les cartes sans étiquette, lues par l'API
//   (GET /api/my-collection?sort=added&untagged=1&page=<n>&stats=0, toutes les pages, dans l'ordre),
//   soit brutes (éléments de `collection[]`), soit déjà réduites à { t, d, r, tags, obtenu }.
// res.json : { "<mot>": [cartes] } = résultats réels de q=<mot>&untagged=1 (toutes les pages, dans l'ordre).
//   Une carte peut aussi être donnée par son rang (0, 1…) dans export.json.
//   Sans lui, la couverture est seulement estimée en local (sous-chaîne du titre ou de la catégorie).
// --mots : écrit la liste des mots retenus, à vérifier ensuite par l'API.
//
// Lecture seule : ce script ne parle ni au site ni à l'API, il lit des fichiers.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── arguments ──
const args = process.argv.slice(2);
const opt = (nom, def) => { const i = args.indexOf('--' + nom); return i < 0 ? def : args[i + 1]; };
const fichier = args.find((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--')));
if (!fichier) { console.error('Usage : node scripts/couverture-piste1.js <export.json> [--recherches res.json] [--mots sortie.json]'); process.exit(1); }
const MIN = +opt('min', 5);              // un mot doit couvrir au moins MIN cartes pour valoir une recherche
const PRECISION = +opt('precision', 0.6); // part minimale de cartes du plan parmi les résultats du mot
const T_POSE = +opt('pose', 12);          // s par « Étiqueter », du clic à la liste rechargée (mesuré : 10,7 à 11,9 s + saisie)
const T_PAGE = +opt('page', 6);           // s par changement de page
const T_RECH = +opt('recherche', 9);      // s pour saisir un mot et attendre la liste filtrée (mesuré : 7,2 à 9,7 s)
const PAR_PAGE = 50;

// ── règles : src/regles.js dans un contexte vm, comme le build ──
const regles = fs.readFileSync(path.join(__dirname, '..', 'src', 'regles.js'), 'utf8');
const R = vm.runInContext(regles + '\n;({ DOMAINES, classer, A_TRAITER });', vm.createContext({}));

// Même calcul que planCarte (src/app.js) pour une carte sans ancienne étiquette.
const planCarte = (c) => {
  const r = R.classer(c);
  const doms = r.etiquettes.filter((e) => R.DOMAINES[e]);
  const coll = r.etiquettes.filter((e) => !R.DOMAINES[e] && e !== R.A_TRAITER);
  const tags = [...new Set([...doms, ...coll])];
  if (!doms.length && r.statut === 'a_traiter') tags.push(R.A_TRAITER);
  return tags;
};

const reduire = (x) => (x.card ? {
  t: (x.card.wikipedia_title || '').trim(), d: (x.card.category || '').trim(), r: (x.card.rarity || '').trim(),
  tags: (x.tags || []).map((t) => t.name), obtenu: x.obtained_at || '',
} : x);
const cle = (c) => c.t + '|' + c.d + '|' + c.r;
// une même carte peut être possédée en double : la clé n'est pas forcément unique, on la numérote
const indexer = (cartes) => { const vu = new Map(); return cartes.map((c) => { const k = cle(c); const n = vu.get(k) || 0; vu.set(k, n + 1); return { ...c, k: n ? k + '#' + n : k }; }); };

const cartes = indexer(JSON.parse(fs.readFileSync(fichier, 'utf8')).map(reduire));
for (const c of cartes) { c.plan = planCarte(c); c.tete = c.plan[0] || null; }
const rangeables = cartes.filter((c) => c.tete);

// ── la recherche du site, simulée : sous-chaîne du titre ou de la catégorie, sans casse ni accents
// (vérifié le 2026-10-12 : « espece » = « espèce », « cinema » = « cinéma », « FOOTBALL » = « football ») ──
const bas = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const trouve = (c, mot) => bas(c.t).includes(mot) || bas(c.d).includes(mot);

// Mots candidats d'un groupe : chaque mot de 4 lettres ou plus du titre et de la catégorie,
// et ses débuts de 6 lettres ou plus (« chanteu » couvre chanteur et chanteuse).
const candidats = (groupe) => {
  const s = new Set();
  for (const c of groupe) for (const w of bas(c.t + ' ' + c.d).split(/[^a-zà-ÿœæ'-]+/)) {
    const m = w.replace(/^['-]+|['-]+$/g, '');
    if (m.length < 4) continue;
    s.add(m);
    for (let n = 6; n < m.length; n++) s.add(m.slice(0, n));
  }
  return [...s];
};

// ── choix glouton des mots, domaine par domaine ──
// Groupe d'un domaine = cartes dont c'est la PREMIÈRE étiquette (celle que la passe 1 pose dans « Sans étiquette »).
// À chaque tour : le mot qui couvre le plus de cartes du groupe pas encore couvertes, parmi les mots
// dont les résultats contiennent au moins PRECISION de cartes du groupe (sinon « français » gagnerait partout).
const groupes = new Map();
for (const c of rangeables) { if (!groupes.has(c.tete)) groupes.set(c.tete, []); groupes.get(c.tete).push(c); }
const ordre = [...groupes.keys()].sort((a, b) => groupes.get(b).length - groupes.get(a).length);

const choisir = () => {
  const choix = [];
  for (const dom of ordre) {
    const groupe = groupes.get(dom);
    const reste = new Set(groupe.map((c) => c.k));
    const cands = candidats(groupe).map((mot) => {
      const res = cartes.filter((c) => trouve(c, mot));
      return { mot, res, dansGroupe: res.filter((c) => c.tete === dom) };
    }).filter((x) => x.dansGroupe.length / x.res.length >= PRECISION);
    for (;;) {
      let best = null;
      for (const x of cands) {
        const n = x.dansGroupe.filter((c) => reste.has(c.k)).length;
        const intrus = x.res.length - x.dansGroupe.length;
        if (!best || n > best.n || (n === best.n && (intrus < best.intrus || (intrus === best.intrus && x.mot.length > best.mot.length)))) best = { ...x, n, intrus };
      }
      if (!best || best.n < MIN) break;
      for (const c of best.dansGroupe) reste.delete(c.k);
      choix.push({ dom, mot: best.mot, couvertes: best.n, intrus: best.intrus, resultats: best.res.length });
    }
  }
  return choix;
};

// ── couverture réelle, à partir des résultats de l'API ──
const reel = (choix, recherches) => {
  const couvert = new Set();
  const parMot = new Map(Object.entries(recherches).map(([m, r]) => [bas(m), r]));
  return choix.map((x) => {
    const res = parMot.get(bas(x.mot));
    if (!res) return { ...x, reel: null };
    // un résultat est une carte, ou son rang dans l'export (forme compacte)
    // (ou « X:<clé> » pour une carte que l'export ne contient pas)
    const objets = indexer(res.filter((r) => typeof r === 'object').map(reduire));
    const rs = res.map((r) => (typeof r === 'number' ? cartes[r] : typeof r === 'string' ? { k: r } : objets.shift()));
    const parCle = new Map(cartes.map((c) => [c.k, c]));
    const inconnues = rs.filter((r) => !parCle.has(r.k)).length; // carte absente de l'export (rangée entre-temps ?)
    const duGroupe = rs.filter((r) => parCle.get(r.k)?.tete === x.dom);
    const nouvelles = [...new Set(duGroupe.map((r) => r.k))].filter((k) => !couvert.has(k)).map((k) => ({ k }));
    nouvelles.forEach((r) => couvert.add(r.k));
    return { ...x, reel: { resultats: rs.length, couvertes: nouvelles.length, duGroupe: duGroupe.length, intrus: rs.length - duGroupe.length, inconnues, ordre: rs.map((r) => r.k) } };
  });
};

// ── simulation du nombre d'opérations ──
// Mode Ranger actuel, passe 1 (appliquerSurPage) : sur la page affichée de « Sans étiquette »,
// une opération par première étiquette présente, la plus fréquente d'abord ; les cartes étiquetées
// disparaissent et la page se remplit avec les suivantes ; page suivante quand la page n'a plus rien à ranger.
const simulerRanger = (liste, aFaire) => {
  let vue = liste.slice(); let num = 1; let ops = 0; let pages = 0;
  const reste = new Set(aFaire);
  while (reste.size) {
    const page = vue.slice((num - 1) * PAR_PAGE, num * PAR_PAGE);
    const parTag = new Map();
    for (const c of page) if (reste.has(c.k)) { if (!parTag.has(c.tete)) parTag.set(c.tete, []); parTag.get(c.tete).push(c.k); }
    if (parTag.size) {
      const [, ks] = [...parTag].sort((a, b) => b[1].length - a[1].length)[0];
      ks.forEach((k) => reste.delete(k));
      vue = vue.filter((c) => !ks.includes(c.k));
      ops++;
      continue;
    }
    if (page.length < PAR_PAGE) break;
    num++; pages++;
  }
  return { ops, pages, oubliees: reste.size };
};

// Piste 1 : pour chaque mot, la vue « Sans étiquette » filtrée par q=<mot> (ordre : date d'ajout).
// On coche les cartes du groupe visibles (≤ 50), une opération, elles disparaissent, on recommence ;
// page suivante seulement si la page 1 n'a plus que des intrus.
const simulerPiste1 = (choix, ordreReel) => {
  const etiquetees = new Set(); let ops = 0; let pages = 0;
  for (const x of choix) {
    const parCle = new Map(cartes.map((c) => [c.k, c]));
    const res = (ordreReel && ordreReel(x)) || cartes.filter((c) => trouve(c, x.mot)).map((c) => c.k);
    let vue = res.filter((k) => !etiquetees.has(k));
    let num = 1;
    for (;;) {
      const page = vue.slice((num - 1) * PAR_PAGE, num * PAR_PAGE);
      const cibles = page.filter((k) => parCle.get(k)?.tete === x.dom);
      if (cibles.length) { cibles.forEach((k) => etiquetees.add(k)); vue = vue.filter((k) => !etiquetees.has(k)); ops++; continue; }
      if (page.length < PAR_PAGE || !vue.slice(num * PAR_PAGE).some((k) => parCle.get(k)?.tete === x.dom)) break;
      num++; pages++;
    }
  }
  // le reste passe par le mode Ranger habituel
  const restantes = rangeables.filter((c) => !etiquetees.has(c.k)).map((c) => c.k);
  const fin = simulerRanger(cartes.filter((c) => !etiquetees.has(c.k)), restantes);
  return { recherches: choix.length, ops, pages, groupees: etiquetees.size, apres: fin };
};

// ── sortie ──
const choix = choisir();
const recherches = opt('recherches') ? JSON.parse(fs.readFileSync(opt('recherches'), 'utf8')) : null;
const lignes = recherches ? reel(choix, recherches) : choix.map((x) => ({ ...x, reel: null }));
if (opt('mots')) fs.writeFileSync(opt('mots'), JSON.stringify(choix.map((x) => x.mot), null, 1));

const multi = rangeables.filter((c) => c.plan.length > 1).length;
console.log(`# Couverture piste 1 — ${fichier}`);
console.log(`Cartes sans étiquette : ${cartes.length} ; rangeables : ${rangeables.length} ; dont ${multi} à plusieurs étiquettes (passe 2, identique dans les deux modes).`);
console.log(`Paramètres : min ${MIN} carte(s) par mot, précision ≥ ${PRECISION}, ${recherches ? 'couverture RÉELLE (API)' : 'couverture estimée en local'}.\n`);

console.log('| Domaine (1re étiquette) | Cartes | Mots retenus (couvertes / intrus) | Couvertes | Restantes |');
console.log('|---|---:|---|---:|---:|');
for (const dom of ordre) {
  const ls = lignes.filter((x) => x.dom === dom);
  const n = (x) => (x.reel ? x.reel.couvertes : x.couvertes);
  const i = (x) => (x.reel ? x.reel.intrus : x.intrus);
  const couv = ls.reduce((s, x) => s + n(x), 0);
  const mots = ls.map((x) => `${x.mot} (${n(x)}/${i(x)})`).join(', ') || '—';
  console.log(`| ${dom} | ${groupes.get(dom).length} | ${mots} | ${couv} | ${groupes.get(dom).length - couv} |`);
}
const totCouv = lignes.reduce((s, x) => s + (x.reel ? x.reel.couvertes : x.couvertes), 0);
console.log(`| **Total** | ${rangeables.length} | ${lignes.length} mot(s) | ${totCouv} | ${rangeables.length - totCouv} |\n`);

if (recherches) {
  const ecarts = lignes.filter((x) => x.reel && (x.reel.resultats !== x.resultats || x.reel.couvertes !== x.couvertes));
  console.log(`Écarts local / API : ${ecarts.length} mot(s)` + (ecarts.length ? ' — ' + ecarts.map((x) => `${x.mot} (local ${x.resultats} rés./${x.couvertes} couv., API ${x.reel.resultats}/${x.reel.couvertes})`).join(' ; ') : ''));
  const absents = lignes.filter((x) => !x.reel).map((x) => x.mot);
  if (absents.length) console.log(`Mots non vérifiés par l'API : ${absents.join(', ')}`);
  console.log();
}

const ranger = simulerRanger(cartes, rangeables.map((c) => c.k));
const p1 = simulerPiste1(lignes, recherches ? (x) => x.reel && x.reel.ordre : null);
const tR = ranger.ops * T_POSE + ranger.pages * T_PAGE;
const tP = p1.recherches * T_RECH + (p1.ops + p1.apres.ops) * T_POSE + (p1.pages + p1.apres.pages) * T_PAGE;
const min = (s) => (s / 60).toFixed(1);
console.log('## Passe 1 simulée (pose de la première étiquette dans « Sans étiquette »)\n');
console.log(`Hypothèses : ${T_POSE} s par « Étiqueter », ${T_PAGE} s par changement de page, ${T_RECH} s par recherche.\n`);
console.log('| Mode | Recherches | « Étiqueter » | Changements de page | Durée estimée |');
console.log('|---|---:|---:|---:|---:|');
console.log(`| Ranger actuel | 0 | ${ranger.ops} | ${ranger.pages} | ${min(tR)} min |`);
console.log(`| Piste 1 (${p1.groupees} cartes groupées) + Ranger pour le reste | ${p1.recherches} | ${p1.ops} + ${p1.apres.ops} | ${p1.pages} + ${p1.apres.pages} | ${min(tP)} min |`);
console.log(`\nGain : ×${(tR / tP).toFixed(2)} sur la passe 1 (${min(tR - tP)} min).`);
if (ranger.oubliees || p1.apres.oubliees) console.log(`Attention : cartes jamais atteintes par la simulation : Ranger ${ranger.oubliees}, piste 1 ${p1.apres.oubliees}.`);
