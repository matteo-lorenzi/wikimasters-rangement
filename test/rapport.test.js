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
  'Mary Butters': 'Mary Butters ( c. 1770 - c. 1850) est une sorcière irlandaise connue sous nom de la sorcière de Carnmoney.',
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

test('essai : référence figée (moteur v1.9.11), 20 justes sur 23 classées, couverture 23/26', () => {
  const r = essai([path.join('test', 'reference-wikipedia.json')]);
  assert.equal(r.status, 0, r.stderr);
  const x = r.resultat;
  assert.deepEqual({ ...x.couverture }, { classees: 23, lues: 26, taux: 0.885 });
  assert.deepEqual({ ...x.precision }, { verifiees: 23, justes: 20, taux: 0.87 });
  // chacune a un domaine attendu PLUS un domaine en trop
  assert.deepEqual(x.fausses.map((f) => [f.titre, f.domaines, f.motsResponsables]), [
    ['Corso di Buono', ['Arts', 'Sciences'], ['école']],
    ['Addington Palace', ['Patrimoine', 'Histoire'], ['historique']],
    ['Pilot chart', ['Patrimoine', 'Transports'], ['domaine']],
  ]);
  assert.match(r.stdout, /Couverture : 23 \/ 26 \(89 %\)/);
  assert.match(r.stdout, /Précision : 20 \/ 23 \(87 %\)/);
});

test('essai : sur la référence (test/reference-wikipedia.json), sans réseau, taux cohérents et cas sans classement jamais devinés', () => {
  const ref = JSON.parse(fs.readFileSync(path.join(RACINE, 'test', 'reference-wikipedia.json'), 'utf8'));
  assert.equal(ref.cartes.length, 26, '23 cartes de l\'essai du 2026-10-23 + 3 cas sans classement');
  assert.equal(ref.cartes.filter((c) => c.phrase).length, 23);
  const r = essai([path.join('test', 'reference-wikipedia.json')]);
  assert.equal(r.status, 0, r.stderr);
  const x = r.resultat;
  assert.equal(x.cartes.length, 26);
  assert.equal(Object.values(x.parCause).reduce((a, b) => a + b, 0), 26);
  assert.equal(x.couverture.lues, 26);
  assert.equal(x.couverture.classees, x.parCause.classee);
  assert.ok(x.precision && x.precision.verifiees === x.couverture.classees, 'chaque carte classée de la référence est vérifiée');
  assert.equal(x.precision.justes + x.fausses.length, x.precision.verifiees);
  for (const t of ['Hanabie.']) assert.equal(x.cartes.find((c) => c.titre === t).cause, 'extrait-vide-ou-stub');
  assert.ok(x.cartes.some((c) => c.cause === 'homonymie') && x.cartes.some((c) => c.cause === 'titre-absent'));
  assert.match(r.stdout, /Couverture : \d+ \/ 26/);
  assert.match(r.stdout, /Précision : \d+ \/ \d+/);
});
