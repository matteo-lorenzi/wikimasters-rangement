// Le rapport de mesure Wikipédia (stockage wmr_wp_rapport, bouton « Copier le rapport Wikipédia (JSON) »)
// et l'outil hors navigateur `npm run essai` (scripts/essai-wikipedia.js). Format : docs/tests.md, « Mesure Wikipédia ».
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { creerSite } = require('./faux-site');

const RACINE = path.join(__dirname, '..');
const attendreQue = async (cond, ms = 15000) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { if (cond()) return true; await new Promise((r) => setTimeout(r, 10)); }
  return cond();
};
const date = (i) => new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString();
const cartesSansDescription = (titres) => titres.map((t, i) => ({ t, d: '', obtenu: date(i) }));
const panneau = (site) => {
  site.wmr.monterUI();
  return { get root() { return site.document.getElementById('wmr-host').shadowRoot; } };
};
const apercu = async (site) => {
  const p = panneau(site);
  p.root.querySelector('.out').innerHTML = '';
  p.root.querySelector('[data-a=ranger]').click();
  const st = () => p.root.querySelector('.st').textContent;
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]') || /à ranger|⚠️/.test(st()), 30000), st());
  return p;
};
// lu dans la page (un autre « monde ») puis recopié, pour que deepEqual compare les valeurs
const rapport = (site) => { const r = site.wmr.store.get('wp_rapport', null); return r && JSON.parse(JSON.stringify(r)); };
const parTitre = (r) => Object.fromEntries(r.cartes.map((c) => [c.titre, c]));

// Une carte par cause que le faux Wikipédia sait rejouer.
const ARTICLES = {
  'Marcel Dubois': 'Marcel Dubois, né en 1920, est le premier chirurgien français à avoir réalisé une greffe du rein.',
  'Mary Butters': 'Mary Butters ( c. 1770 - c. 1850) est une chiffonnière irlandaise connue sous le surnom de la dame de Carnmoney.',
  'Pierre Fehlmann': 'Pierre Fehlmann, né en 1942 à Morges, est un navigateur suisse, célèbre par ses participations aux courses autour du monde.',
  Tessier: 'Tessier est un joueur de football ou un chirurgien.',
  'Hanabie.': 'Hanabie.',
  Bourboulon: 'Le nom propre Bourboulon prend différentes significations.',
};
const TITRES = ['Marcel Dubois', 'Mary Butters', 'Pierre Fehlmann', 'Pierre F.', 'Tessier', 'Titre Absent', 'Hanabie.', 'Bourboulon'];
const siteCauses = (o = {}) => creerSite({ cartes: cartesSansDescription(TITRES), wikipedia: { articles: ARTICLES, homonymies: ['Tessier'], redirections: { 'Pierre F.': 'Pierre Fehlmann' }, ...o } });

test('rapport Wikipédia : écrit dans le stockage après l\'aperçu de Ranger, une ligne par carte concernée, la bonne cause pour chacune', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  await apercu(site);
  const r = rapport(site);
  assert.ok(r, 'wmr_wp_rapport écrit');
  assert.ok(site.window.localStorage.getItem('wmr_wp_rapport'), 'sous la clé wmr_wp_rapport');
  assert.equal(r.version, '?');
  assert.equal(r.essai, false);
  assert.ok(!Number.isNaN(Date.parse(r.date)), 'date ISO');
  assert.equal(r.requetes, 1, 'une requête pour 8 titres');
  assert.equal(r.lots.length, 1);
  assert.equal(r.lots[0].titres, 8);
  assert.equal(r.lots[0].ok, true);
  assert.ok(typeof r.lots[0].ms === 'number' && typeof r.dureeMs === 'number');
  assert.deepEqual(r.erreurs, []);
  assert.equal(r.cartes.length, 8);
  const c = parTitre(r);
  assert.equal(c['Marcel Dubois'].cause, 'classee');
  assert.deepEqual(c['Marcel Dubois'].domaines, ['Sciences']);
  assert.ok(c['Marcel Dubois'].mots.includes('chirurgien'), 'le mot du moteur qui a déclenché : ' + c['Marcel Dubois'].mots);
  assert.equal(c['Marcel Dubois'].phrase, 'chirurgien français à avoir réalisé une greffe du rein');
  assert.equal(c['Marcel Dubois'].rarete, 'C');
  assert.equal(c['Mary Butters'].cause, 'phrase-sans-regle');
  assert.deepEqual(c['Mary Butters'].domaines, []);
  assert.equal(c['Pierre Fehlmann'].cause, 'phrase-ambigue');
  assert.equal(c['Pierre F.'].cause, 'phrase-ambigue');
  assert.equal(c['Pierre F.'].redirection, 'Pierre Fehlmann', 'la redirection suivie est notée');
  assert.equal(c['Pierre Fehlmann'].redirection, undefined);
  assert.equal(c.Tessier.cause, 'homonymie');
  assert.equal(c['Titre Absent'].cause, 'titre-absent');
  assert.equal(c['Hanabie.'].cause, 'extrait-vide-ou-stub');
  assert.equal(c.Bourboulon.cause, 'pas-de-est-un');
  assert.match(c.Bourboulon.extrait, /^Le nom propre Bourboulon/, 'le début de l\'extrait, pour voir pourquoi');
  for (const x of r.cartes) assert.equal(x.etape, 'reseau', x.titre);
  for (const x of r.cartes) if (x.cause !== 'classee') assert.deepEqual(x.domaines, [], x.titre);
  assert.equal(r.bilan.parCause.classee, 1);
  assert.equal(r.bilan.parCause['phrase-ambigue'], 2);
  assert.equal(r.bilan.parCause.homonymie, 1);
  assert.deepEqual({ ...r.bilan.couverture }, { classees: 1, lues: 8, taux: 0.125 });
  assert.equal(r.bilan.precision, null, 'pas d\'étiquettes de vérité dans le navigateur');
  site.fermer();
});

test('rapport Wikipédia : bouton « Copier le rapport Wikipédia (JSON) » et tableau des causes dans l\'aperçu', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  const p = await apercu(site);
  const bouton = p.root.querySelector('[data-copier-wp]');
  assert.ok(bouton, 'le bouton existe');
  assert.equal(bouton.textContent, 'Copier le rapport Wikipédia (JSON)');
  const zone = p.root.querySelector('[data-wp-rapport]');
  assert.deepEqual(JSON.parse(zone.value), JSON.parse(JSON.stringify(rapport(site))), 'le texte copié est le rapport stocké');
  // une ligne par carte : le JSON reste lisible et raisonnable
  const lignes = zone.value.split('\n').filter((l) => /"titre":/.test(l));
  assert.equal(lignes.length, 8);
  for (const l of lignes) JSON.parse(l.trim().replace(/,$/, ''));
  assert.ok(!/</.test(zone.value), 'pas de HTML dans le JSON');
  const o = p.root.querySelector('.out').textContent;
  assert.match(o, /Couverture : 1 \/ 8/);
  assert.match(o, /phrase-ambigue\s*2/);
  assert.doesNotMatch(o, /Précision/, 'pas de précision sans vérité');
  let copie = null;
  Object.defineProperty(site.window.navigator, 'clipboard', { value: { writeText: async (t) => { copie = t; } }, configurable: true });
  bouton.click();
  assert.ok(await attendreQue(() => copie !== null));
  assert.equal(copie, zone.value);
  site.fermer();
});

test('rapport Wikipédia : 2e Ranger, les cartes viennent du cache (étape « cache », aucune requête)', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  await apercu(site);
  await apercu(site);
  const r = rapport(site);
  assert.equal(r.requetes, 0);
  assert.deepEqual(r.lots, []);
  for (const x of r.cartes) assert.equal(x.etape, 'cache', x.titre);
  assert.equal(parTitre(r)['Marcel Dubois'].cause, 'classee');
  site.fermer();
});

test('rapport Wikipédia : essai de 40 cartes, les autres sont « non-lue-essai » et sortent du calcul de la couverture', async () => {
  const titres = Array.from({ length: 45 }, (_, i) => `Joueur Numéro ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + Math.floor(i / 26))}`);
  const site = await creerSite({ cartes: cartesSansDescription(titres), wikipedia: { articles: Object.fromEntries(titres.map((t) => [t, `${t} est un joueur de football français.`])) } });
  await apercu(site);
  const r = rapport(site);
  assert.equal(r.essai, true);
  assert.equal(r.cartes.length, 45);
  const non = r.cartes.filter((c) => c.cause === 'non-lue-essai');
  assert.equal(non.length, 5);
  for (const c of non) assert.equal(c.etape, 'non-lue-essai');
  assert.equal(r.bilan.parCause.classee, 40);
  assert.deepEqual({ ...r.bilan.couverture }, { classees: 40, lues: 40, taux: 1 });
  assert.deepEqual(r.lots.map((l) => l.titres), [20, 20]);
  site.fermer();
});

test('rapport Wikipédia : appel bloqué, chaque carte « appel-bloque » et le message d\'erreur noté', async () => {
  const site = await siteCauses({ bloque: true });
  site.wmr.store.set('wiki_essai', false);
  await apercu(site);
  const r = rapport(site);
  assert.equal(r.erreurs.length, 1);
  assert.match(r.erreurs[0], /Failed to fetch/);
  assert.equal(r.requetes, 1);
  assert.equal(r.lots[0].ok, false);
  for (const c of r.cartes) { assert.equal(c.etape, 'appel-bloque', c.titre); assert.equal(c.cause, 'appel-bloque', c.titre); }
  site.fermer();
});

test('rapport Wikipédia : Ranger sans carte concernée n\'écrase pas le rapport et ne montre pas le bouton', async () => {
  const site = await creerSite({ cartes: [{ t: 'Zidane', d: 'footballeur français', obtenu: date(1) }], wikipedia: { articles: {} } });
  site.wmr.store.set('wp_rapport', { ancien: true });
  const p = await apercu(site);
  assert.deepEqual({ ...rapport(site) }, { ancien: true });
  assert.equal(p.root.querySelector('[data-copier-wp]'), null);
  site.fermer();
});

test('rapport Wikipédia : l\'extrait d\'une carte sans phrase est gardé sur 500 caractères (pas 250), pour rejouer l\'extraction hors navigateur', async () => {
  const long = 'Alpha '.repeat(75).trim(); // 449 caractères, aucun « est un »
  const site = await creerSite({ cartes: cartesSansDescription(['Long Texte']), wikipedia: { articles: { 'Long Texte': long } } });
  site.wmr.store.set('wiki_essai', false);
  await apercu(site);
  const c = parTitre(rapport(site))['Long Texte'];
  assert.equal(c.cause, 'pas-de-est-un');
  assert.equal(c.extrait, long, 'l\'extrait entier, jusqu\'à 500 caractères');
  site.fermer();
});

// La mesure est un diagnostic : si elle plante, Ranger continue (aperçu, bouton Appliquer) et le journal des bugs le dit.
test('rapport Wikipédia : la construction du rapport lève une exception, l\'aperçu arrive quand même avec « Appliquer »', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  // seul le rapport date ses résultats avec toISOString : il lève, rien d'autre n'est touché
  const iso = site.window.Date.prototype.toISOString;
  site.window.Date.prototype.toISOString = () => { throw new Error('date du rapport impossible'); };
  const p = await apercu(site);
  assert.ok(p.root.querySelector('[data-go]'), 'le bouton Appliquer est là');
  assert.match(p.root.querySelector('.out').textContent, /Classées d'après Wikipédia \(3\)/, 'l\'aperçu de Wikipédia est complet');
  assert.equal(rapport(site), null, 'pas de rapport');
  assert.equal(p.root.querySelector('[data-copier-wp]'), null);
  const bugs = site.wmr.store.get('bugs', []);
  assert.equal(bugs.length, 1);
  assert.match(bugs[0].contexte + ' ' + bugs[0].message, /rapport Wikipédia.*date du rapport impossible/s);
  // la mesure suivante repart de zéro (wikiMesure remis à null)
  site.window.Date.prototype.toISOString = iso;
  await apercu(site);
  assert.equal(rapport(site).requetes, 0, 'aucune requête comptée en trop');
  site.fermer();
});

test('rapport Wikipédia : l\'affichage du rapport lève une exception, l\'aperçu arrive quand même avec « Appliquer »', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  // le stockage rend un rapport illisible (« cartes » n'est pas une liste) : son affichage lève
  const proto = site.window.Storage.prototype, setItem = proto.setItem;
  proto.setItem = function (k, v) { return setItem.call(this, k, k === 'wmr_wp_rapport' ? '{"cartes":5}' : v); };
  const p = await apercu(site);
  assert.ok(p.root.querySelector('[data-go]'), 'le bouton Appliquer est là');
  assert.match(p.root.querySelector('.out').textContent, /Résultat prévu/, 'le reste de l\'aperçu est là');
  assert.equal(p.root.querySelector('[data-copier-wp]'), null);
  const bugs = site.wmr.store.get('bugs', []);
  assert.equal(bugs.length, 1);
  assert.match(bugs[0].contexte, /rapport Wikipédia/);
  site.fermer();
});

test('rapport Wikipédia : la mesure plante en pleine lecture, la lecture et Ranger continuent (journal des bugs)', async () => {
  const site = await siteCauses();
  site.wmr.store.set('wiki_essai', false);
  // seule la mesure écrit « redirections['Pierre F.'] = … » : ce titre-là la fait lever, rien d'autre n'est touché
  Object.defineProperty(site.window.Object.prototype, 'Pierre F.', { set() { throw new Error('mesure impossible'); }, configurable: true });
  const p = await apercu(site);
  delete site.window.Object.prototype['Pierre F.'];
  assert.ok(p.root.querySelector('[data-go]'), 'le bouton Appliquer est là');
  assert.match(p.root.querySelector('.out').textContent, /Classées d'après Wikipédia \(3\)/, 'chaque titre lu malgré la mesure');
  assert.equal(site.titresWikipedia().length, 8);
  const bugs = site.wmr.store.get('bugs', []);
  assert.equal(bugs.length, 1, 'un seul bug, pas un par titre');
  assert.match(bugs[0].contexte + ' ' + bugs[0].message, /mesure Wikipédia.*mesure impossible/s);
  assert.equal(rapport(site), null, 'pas de rapport faussé par une mesure incomplète');
  site.fermer();
});

// ── npm run essai (scripts/essai-wikipedia.js) ──

const essai = (args) => {
  const sortie = fs.mkdtempSync(path.join(os.tmpdir(), 'wmr-essai-'));
  const r = spawnSync(process.execPath, [path.join(RACINE, 'scripts', 'essai-wikipedia.js'), ...args, '--sortie', sortie], { cwd: RACINE, encoding: 'utf8', env: process.env });
  const fichiers = fs.existsSync(sortie) ? fs.readdirSync(sortie) : [];
  const resultat = fichiers.length === 1 ? JSON.parse(fs.readFileSync(path.join(sortie, fichiers[0]), 'utf8')) : null;
  fs.rmSync(sortie, { recursive: true, force: true });
  return { ...r, fichiers, resultat };
};

test('essai : `npm run essai` est déclaré dans package.json', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(RACINE, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.essai, 'node scripts/essai-wikipedia.js');
  assert.ok(fs.existsSync(path.join(RACINE, 'resultats', '.gitkeep')));
});

test('essai : sur resultats/exemple.json, rejoue le moteur, écrit resultats/essai-<date>.json et imprime un résumé en français', () => {
  const r = essai([path.join('resultats', 'exemple.json')]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.fichiers.length, 1);
  assert.match(r.fichiers[0], /^essai-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
  const x = r.resultat;
  assert.equal(x.parCause.classee, 2);
  assert.equal(x.parCause['non-lue-essai'], 1);
  assert.equal(x.parCause['phrase-ambigue'], 1);
  assert.deepEqual({ ...x.couverture }, { classees: 2, lues: 8, taux: 0.25 });
  assert.equal(x.precision, null, 'aucune carte de l\'exemple dans la référence');
  assert.equal(x.cartes.length, 9);
  assert.ok(x.cartes.every((c) => c.etape && c.cause), 'étape et résultat pour chaque carte');
  assert.ok('erreurs' in x && 'dureeMs' in x && 'requetes' in x);
  assert.match(r.stdout, /Couverture : 2 \/ 8 \(25 %\)/);
  assert.match(r.stdout, /classee/);
});

test('essai : précision avec un fichier de vérité, et le mot responsable de chaque carte fausse', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wmr-verite-'));
  const verite = path.join(dir, 'verite.json');
  fs.writeFileSync(verite, JSON.stringify({ cartes: [
    { titre: 'Jean Exemple', attendu: ['Sport'] },
    { titre: 'Paul Exemple', attendu: ['Littérature'] },
    { titre: 'Hanabie.', attendu: [] },
  ] }));
  const r = essai([path.join('resultats', 'exemple.json'), '--verite', verite]);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual({ ...r.resultat.precision }, { verifiees: 2, justes: 1, taux: 0.5 });
  assert.equal(r.resultat.fausses.length, 1);
  assert.equal(r.resultat.fausses[0].titre, 'Paul Exemple');
  assert.deepEqual(r.resultat.fausses[0].domaines, ['Arts']);
  assert.deepEqual(r.resultat.fausses[0].motsResponsables, ['peintre']);
  assert.match(r.stdout, /Précision : 1 \/ 2 \(50 %\)/);
  assert.match(r.stdout, /Paul Exemple/);
});

// Un rapport écrit dans un dossier temporaire, rejoué par l'essai (vérité par défaut : la référence).
const essaiSurRapport = (cartes, extra = {}) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wmr-rapport-'));
  const fichier = path.join(dir, 'rapport.json');
  fs.writeFileSync(fichier, JSON.stringify({ outil: 'wmr-rapport-wikipedia', format: 1, version: '1.9.12', cartes, ...extra }));
  const r = essai([fichier]);
  fs.rmSync(dir, { recursive: true, force: true });
  return r;
};

test('essai : une carte sans phrase mais avec un extrait est rejouée par morceauWikipedia (« est un » entre 250 et 300 caractères)', () => {
  const extrait = 'Mot '.repeat(66) + 'est un peintre français.'; // « est un » au caractère 264
  const r = essaiSurRapport([
    { titre: 'Peintre Lointain', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait },
    { titre: 'Trop Loin', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Mot '.repeat(80) + 'est un peintre français.' }, // au-delà de 300
    { titre: 'Sans Extrait', etape: 'cache', cause: 'titre-absent', domaines: [] },
  ]);
  assert.equal(r.status, 0, r.stderr);
  const c = Object.fromEntries(r.resultat.cartes.map((x) => [x.titre, x]));
  assert.equal(c['Peintre Lointain'].cause, 'classee');
  assert.deepEqual(c['Peintre Lointain'].domaines, ['Arts']);
  assert.equal(c['Peintre Lointain'].phrase, 'peintre français');
  assert.equal(c['Peintre Lointain'].avant, 'pas-de-est-un', 'le résultat a changé depuis le rapport');
  assert.equal(c['Trop Loin'].cause, 'pas-de-est-un', 'hors de la fenêtre de 300 caractères');
  assert.equal(c['Trop Loin'].avant, undefined);
  assert.equal(c['Sans Extrait'].cause, 'titre-absent');
  assert.equal(r.resultat.couverture.classees, 1);
  assert.deepEqual([...(r.resultat.avertissements || [])], [], 'pas d\'avertissement : aucun extrait coupé à 250');
});

test('essai : l\'extraction élargie classe une carte « sont un… » / « était le… » (C1), pas une page de date', () => {
  const r = essaiSurRapport([
    { titre: 'Svendborg Rabbits', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Les Svendborg Rabbits sont un club danois de basket-ball basé à Svendborg.' },
    { titre: 'Gartnait Ier', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Gartnait mac Girom, dit Gartnait Ier, fils de Girom était le roi des Pictes entre 536 et 543.' },
    { titre: 'Guido sans article', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Guido Ventimiglia (mort en 1362), fut brièvement comte de Malte de 1360 à sa mort.' },
  ]);
  assert.equal(r.status, 0, r.stderr);
  const c = Object.fromEntries(r.resultat.cartes.map((x) => [x.titre, x]));
  assert.equal(c['Svendborg Rabbits'].cause, 'classee');
  assert.deepEqual(c['Svendborg Rabbits'].domaines, ['Sport']);
  assert.equal(c['Svendborg Rabbits'].avant, 'pas-de-est-un');
  assert.deepEqual(c['Gartnait Ier'].domaines, ['Histoire']);
  assert.equal(c['Guido sans article'].cause, 'pas-de-est-un', 'sans article, pas de phrase');
});

test('essai : les pages de dates (C4) sont « page-ignoree » : hors du dénominateur de la couverture, dans le tableau, pas des échecs', () => {
  const extraits = {
    '1869 en France': "Cette page concerne l'année 1869 du calendrier grégorien.",
    '1835 au Canada': 'Cet article traite des événements survenus en 1835 au Canada.',
    '1893 en aéronautique': "Cet article présente les faits marquants de l'année 1893 dans le domaine de l'aéronautique.",
    'Septembre 2008 en France': 'Janvier - Février - Mars - Avril - Mai - Juin - Juillet - Août - Septembre - Octobre - Novembre - Décembre 2008 2006 - 2007 - 2008 dans les DOM-TOM français',
  };
  const cartes = Object.entries(extraits).map(([titre, extrait]) => ({ titre, etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait }));
  cartes.push({ titre: '18 octobre 1965', etape: 'cache', cause: 'phrase-sans-regle', domaines: [], phrase: "291e jour de l'année 1965", mots: ["jour de l'année"] });
  cartes.push({ titre: '20 novembre 1954', etape: 'cache', cause: 'phrase-sans-regle', domaines: [], phrase: "324e jour de l'année 1954" });
  cartes.push({ titre: 'Svendborg Rabbits', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Les Svendborg Rabbits sont un club danois de basket-ball basé à Svendborg.' });
  cartes.push({ titre: 'Mot Inconnu', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: 'Le nom propre Mot Inconnu prend différentes significations selon le contexte.' });
  const r = essaiSurRapport(cartes);
  assert.equal(r.status, 0, r.stderr);
  const x = r.resultat, c = Object.fromEntries(x.cartes.map((k) => [k.titre, k]));
  for (const t of [...Object.keys(extraits), '18 octobre 1965', '20 novembre 1954']) assert.equal(c[t].cause, 'page-ignoree', t);
  assert.equal(c['Mot Inconnu'].cause, 'pas-de-est-un', 'une vraie carte sans phrase reste un échec');
  assert.equal(x.parCause['page-ignoree'], 6);
  // 1 classée sur 2 cartes lues (les 6 pages de dates ne comptent pas) ; brute : 1 sur 8
  assert.deepEqual({ ...x.couverture }, { classees: 1, lues: 2, taux: 0.5 });
  assert.equal(x.pagesIgnorees, 6);
  assert.match(r.stdout, /Couverture : 1 \/ 2 \(50 %\)/);
  assert.match(r.stdout, /Couverture brute : 1 \/ 8 \(13 %\)/);
  assert.match(r.stdout, /page-ignoree\s+6/);
});

test('rapport Wikipédia : une page de dates est « page-ignoree » dans le navigateur aussi, et sort du dénominateur de la couverture', async () => {
  const site = await creerSite({ cartes: [] });
  const W = site.wmr;
  const e = (extrait) => ({ extrait, date: Date.now() });
  assert.equal(W.causeWikipedia({ t: '1869 en France' }, e("Cette page concerne l'année 1869 du calendrier grégorien.")).cause, 'page-ignoree');
  assert.equal(W.causeWikipedia({ t: '18 octobre 1965' }, e("Le 18 octobre est le 291e jour de l'année 1965.")).cause, 'page-ignoree');
  assert.equal(W.causeWikipedia({ t: 'Mot Inconnu' }, e('Le nom propre Mot Inconnu prend différentes significations.')).cause, 'pas-de-est-un');
  const b = W.bilanWikipedia([{ titre: 'A', cause: 'classee', domaines: ['Sport'] }, { titre: 'B', cause: 'pas-de-est-un', domaines: [] },
    { titre: '1869 en France', cause: 'page-ignoree', domaines: [] }, { titre: 'C', cause: 'non-lue-essai', domaines: [] }]);
  assert.deepEqual({ ...b.couverture }, { classees: 1, lues: 2, taux: 0.5 });
  assert.equal(b.pagesIgnorees, 1);
  site.fermer();
});

test('essai : avertit quand les extraits du rapport sont coupés à 250 caractères (ancien rapport)', () => {
  const coupe = ('Mot '.repeat(70)).slice(0, 249) + '…'; // 250 caractères, finit par « … » : l'ancien format
  const r = essaiSurRapport([
    { titre: 'Coupée A', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: coupe },
    { titre: 'Coupée B', etape: 'cache', cause: 'pas-de-est-un', domaines: [], extrait: coupe },
    { titre: 'Courte', etape: 'cache', cause: 'extrait-vide-ou-stub', domaines: [], extrait: 'Courte.' },
  ]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.resultat.avertissements.length, 1);
  assert.match(r.resultat.avertissements[0], /extraits coupés à 250 caractères dans ce rapport \(2 carte\(s\)\)/);
  assert.match(r.stdout, /Attention : extraits coupés à 250 caractères dans ce rapport/);
});

test('essai : jugement, un domaine attendu PLUS un domaine non attendu est « fausse »', async () => {
  const site = await creerSite({ cartes: [] });
  const juger = site.wmr.jugerWikipedia;
  assert.equal(juger(['Arts', 'Sciences'], { attendu: ['Arts'], acceptables: [] }), 'fausse', 'Sciences en trop');
  assert.equal(juger(['Arts'], { attendu: ['Arts'], acceptables: [] }), 'juste');
  assert.equal(juger(['Histoire', 'Littérature'], { attendu: ['Histoire'], acceptables: ['Littérature'] }), 'juste', 'acceptable toléré');
  assert.equal(juger(['Littérature'], { attendu: ['Histoire'], acceptables: ['Littérature'] }), 'fausse', 'aucun domaine attendu');
  assert.equal(juger(['Patrimoine', 'Transports'], { attendu: ['Patrimoine', 'Transports'], acceptables: [] }), 'juste', 'l\'un ou l\'autre');
  assert.equal(juger([], { attendu: [] }), 'juste');
  assert.equal(juger(['Musique'], { attendu: [] }), 'fausse', 'rien ne devait être proposé');
  site.fermer();
});

// Le seuil de précision de REGLAGES.wikipedia.precisionMinimale (src/regles.js), lu comme le fait l'essai.
const precisionMinimale = () => {
  const { SRC } = require('./charger');
  return require('vm').runInContext(fs.readFileSync(path.join(SRC, 'regles.js'), 'utf8') + '\n;REGLAGES.wikipedia.precisionMinimale;', require('vm').createContext({}));
};

test('essai : référence figée (moteur après D2 et les 8 mots décidés du 2026-10-24), 190 justes sur 195 classées sur 211 cartes', () => {
  const r = essai([path.join('test', 'reference-wikipedia.json')]);
  const x = r.resultat;
  const QUOI_FAIRE = 'moteur ou règles changés : relance npm run essai, mets à jour couverture, précision et les fausses ici et dans le nom du test, relève precisionMinimale (src/regles.js) si la précision monte, puis docs/tests.md et docs/suivi-wikipedia.md';
  assert.deepEqual({ ...x.couverture }, { classees: 195, lues: 211, taux: 0.924 }, QUOI_FAIRE);
  assert.deepEqual({ ...x.precision }, { verifiees: 195, justes: 190, taux: 0.974 }, QUOI_FAIRE);
  // chacune a un domaine attendu PLUS un domaine en trop, ou un domaine hors attendu et acceptables
  // (Opsites, ProQuartet et Controverse fabriquée : fausses relevées sur les témoins de cartes neuves du lot 4, gardées dans la référence)
  assert.deepEqual(x.fausses.map((f) => [f.titre, f.domaines, f.motsResponsables]), [
    ['Téti (fils de Minhotep)', ['Politique & Droit'], ['fonctionnaire']],
    ['Ethnoprimatologie', ['Sciences'], ['sociétés humaines']],
    ['Opsites', ['Sciences'], ['historien']],
    ['ProQuartet', ['Politique & Droit'], ['loi']],
    ['Controverse fabriquée', ['Sciences'], ['scientifique']],
  ], QUOI_FAIRE);
  assert.match(r.stdout, /Couverture : 195 \/ 211 \(92 %\)/, QUOI_FAIRE);
  assert.match(r.stdout, /Précision : 190 \/ 195 \(97 %\)/, QUOI_FAIRE);
});

test('essai : garde-fou de précision, la référence ne passe pas sous REGLAGES.wikipedia.precisionMinimale', () => {
  const r = essai([path.join('test', 'reference-wikipedia.json')]);
  const min = precisionMinimale();
  assert.ok(min > 0 && min <= 0.95, 'precisionMinimale entre 0 et 0,95 : ' + min);
  assert.ok(r.resultat.precision.taux >= min,
    `précision de la référence ${r.resultat.precision.taux} sous le minimum ${min} (REGLAGES.wikipedia.precisionMinimale, src/regles.js) : `
    + 'la dernière modification des règles ou de l\'extraction a fait baisser la précision. Regarde les « Cartes fausses » de `npm run essai`, '
    + 'corrige la règle (ou annule-la) ; ne baisse le minimum que si la personne a changé un jugement de la référence.');
  assert.equal(r.status, 0, r.stderr);
});

test('essai : la référence sous le minimum de précision, l\'essai sort en code 1 avec un message qui dit quoi faire', () => {
  const r = essai([path.join('test', 'reference-wikipedia.json'), '--minimum', '0.99']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Précision 97 % sous le minimum de 99 %/);
  assert.match(r.stderr, /REGLAGES\.wikipedia\.precisionMinimale/);
  // un rapport réel (autre fichier que la vérité) ne déclenche pas le garde-fou
  const exemple = essai([path.join('resultats', 'exemple.json'), '--minimum', '0.99']);
  assert.equal(exemple.status, 0, exemple.stderr);
});

test('essai : sur la référence (test/reference-wikipedia.json), sans réseau, taux cohérents et cas sans classement jamais devinés', () => {
  const ref = JSON.parse(fs.readFileSync(path.join(RACINE, 'test', 'reference-wikipedia.json'), 'utf8'));
  assert.equal(ref.cartes.length, 211, '23 cartes de l\'essai du 2026-10-23 + 3 cas sans classement + 60 cartes du rapport du 2026-10-24 + 11 cartes de la phase 3 (P3) + 7 cartes de la phase 3 (P2) + 60 cartes de la phase 3 (C1) + 20 cartes de la phase 3 (C2) + 6 cartes de la phase 3 (C3) + 12 cartes de la phase 3 (D2)');
  assert.equal(ref.cartes.filter((c) => c.phrase).length, 208);
  const r = essai([path.join('test', 'reference-wikipedia.json')]);
  assert.equal(r.status, 0, r.stderr);
  const x = r.resultat;
  assert.equal(x.cartes.length, 211);
  assert.equal(Object.values(x.parCause).reduce((a, b) => a + b, 0), 211);
  assert.equal(x.couverture.lues, 211);
  assert.equal(x.couverture.classees, x.parCause.classee);
  assert.ok(x.precision && x.precision.verifiees === x.couverture.classees, 'chaque carte classée de la référence est vérifiée');
  assert.equal(x.precision.justes + x.fausses.length, x.precision.verifiees);
  for (const t of ['Hanabie.']) assert.equal(x.cartes.find((c) => c.titre === t).cause, 'extrait-vide-ou-stub');
  assert.ok(x.cartes.some((c) => c.cause === 'homonymie') && x.cartes.some((c) => c.cause === 'titre-absent'));
  assert.match(r.stdout, /Couverture : \d+ \/ 211/);
  assert.match(r.stdout, /Précision : \d+ \/ \d+/);
});
