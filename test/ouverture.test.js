// Ouvrir un paquet et s'arrêter sur la carte (ticket #16), sur le faux site de la page /pulls.
// Règle 8 : chaque test regarde les clics faits sur la page (site.actions), pas seulement le résultat.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerSite } = require('./faux-site');

const plat = (x) => JSON.parse(JSON.stringify(x));
const types = (site) => site.actions.map((a) => a.type);
const FLECHES = (n) => Array(n).fill('fleche');
const attendreQue = async (cond, ms = 3000) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { if (cond()) return true; await new Promise((r) => setTimeout(r, 10)); }
  return cond();
};
// « Continuer » / « Arrêter » du panneau : une décision écrite d'avance, dans l'ordre
const decisions = (...liste) => { const vues = []; return { vues, surArret: async (carte, raison) => { vues.push({ titre: carte.t, rarete: carte.rarete, raison: plat(raison) }); return liste.shift() || 'arreter'; } }; };
const lancer = (site, opts) => site.wmr.ouvrirPaquet({ reglages: { raretes: [], interets: [] }, surArret: async () => 'arreter', ...opts });

test('sans aucun arrêt : 5 cartes lues une par une, flèche droite ×4, « Continuer » du site, retour à /pulls', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 10 });
  const lues = [];
  const r = await lancer(site, { surCarte: async (c) => { lues.push(c.t); } });
  assert.deepEqual(lues, ['Aigaliers', 'Uzès', 'Lac Léman', 'Football', 'France']);
  assert.deepEqual(types(site), ['ouvrir', ...FLECHES(4), 'continuer'], 'seuls Ouvrir, la flèche droite et Continuer sont touchés');
  assert.equal(site.paquets(), 9);
  assert.match(site.document.body.innerText, /9 \/ 10 paquets disponibles/);
  assert.equal(r.etat, 'termine');
  site.fermer();
});

test('arrêt sur rareté : le panneau reçoit la carte et le motif ; « Continuer » reprend à la suivante sans relire les précédentes', async () => {
  const site = await creerSite({ page: 'pulls' });
  const lues = [];
  const d = decisions('continuer', 'continuer');
  const r = await lancer(site, { reglages: { raretes: ['R', 'UR'], interets: [] }, surArret: d.surArret, surCarte: async (c) => { lues.push(c.t); } });
  assert.deepEqual(d.vues, [
    { titre: 'Football', rarete: 'R', raison: { type: 'rarete', valeur: 'R', texte: 'rareté R' } },
    { titre: 'France', rarete: 'UR', raison: { type: 'rarete', valeur: 'UR', texte: 'rareté UR' } },
  ]);
  assert.deepEqual(lues, ['Aigaliers', 'Uzès', 'Lac Léman', 'Football', 'France'], 'chaque carte lue une seule fois, dans l\'ordre');
  assert.deepEqual(types(site), ['ouvrir', ...FLECHES(4), 'continuer']);
  assert.equal(r.etat, 'termine');
  assert.equal(site.paquets(), 9);
  site.fermer();
});

test('arrêt sur mot, carte de rareté C : on s\'arrête sur la 1re carte sans avoir touché la flèche', async () => {
  const site = await creerSite({ page: 'pulls' });
  const d = decisions('arreter');
  const r = await lancer(site, { reglages: { raretes: [], interets: ['Gard'] }, surArret: d.surArret });
  assert.deepEqual(d.vues.map((v) => [v.titre, v.raison.texte]), [['Aigaliers', 'mot « Gard »']]);
  assert.equal(r.etat, 'arret');
  assert.equal(r.n, 1);
  assert.deepEqual(types(site), ['ouvrir']);
  site.fermer();
});

test('« Arrêter » ne clique plus rien : le paquet reste ouvert sur la carte, le compteur n\'a pas bougé', async () => {
  const site = await creerSite({ page: 'pulls' });
  const r = await lancer(site, { reglages: { raretes: ['R'], interets: [] }, surArret: async () => 'arreter' });
  assert.equal(r.etat, 'arret');
  assert.equal(r.carte.t, 'Football');
  const avant = types(site);
  assert.deepEqual(avant, ['ouvrir', ...FLECHES(3)]);
  await site.attente(200);
  assert.deepEqual(types(site), avant, 'plus aucun clic après l\'arrêt');
  assert.equal(site.paquets(), 10, 'le paquet n\'est pas refermé');
  assert.match(site.document.body.innerText, /Carte 4 \/ 5/);
  site.fermer();
});

test('jamais de clic sur favori, Défausser ni « Encore N cartes », même en passant tout le paquet', async () => {
  const site = await creerSite({ page: 'pulls' });
  await lancer(site);
  const interdits = site.actions.filter((a) => ['favori', 'defausser', 'encore', 'clic'].includes(a.type));
  assert.deepEqual(interdits, []);
  site.fermer();
});

test('animation qui ne finit pas : échec bruyant qui nomme la carte attendue, sans autre clic', async () => {
  const site = await creerSite({ page: 'pulls', animationBloquee: true });
  await assert.rejects(lancer(site), /carte 2 \/ 5 n'est pas apparue/i);
  assert.deepEqual(types(site), ['ouvrir', 'fleche'], 'le script n\'insiste pas');
  site.fermer();
});

test('pas de bouton « Ouvrir » : échec bruyant, rien de cliqué', async () => {
  const site = await creerSite({ page: 'pulls' });
  site.document.querySelector('#site button').remove();
  await assert.rejects(lancer(site), /bouton « Ouvrir »/);
  assert.deepEqual(site.actions, []);
  site.fermer();
});

test('surCarte reçoit { t, d, rarete } et peut remplacer la description jugée (Wikipédia, ticket #17)', async () => {
  const site = await creerSite({ page: 'pulls', paquet: [{ t: 'Nîmes', d: '', r: 'C' }, { t: 'Autre', d: 'rien', r: 'C' }] });
  const vues = [];
  const d = decisions('arreter');
  await lancer(site, {
    reglages: { raretes: [], interets: ['Gard'] },
    surArret: d.surArret,
    surCarte: async (c, info) => { vues.push([plat(c), info.n, info.total]); return c.t === 'Nîmes' ? { ...c, d: 'commune du Gard' } : c; },
  });
  assert.deepEqual(vues[0], [{ t: 'Nîmes', d: '', rarete: 'C' }, 1, 2]);
  assert.equal(d.vues[0].raison.texte, 'mot « Gard »');
  site.fermer();
});

test('l\'arrêt est enregistré (carte, motif, suite donnée) pour le journal', async () => {
  const site = await creerSite({ page: 'pulls' });
  await lancer(site, { reglages: { raretes: ['R'], interets: [] }, surArret: async () => 'arreter' });
  const [a] = plat(site.wmr.store.get('paquets_arrets', []));
  assert.deepEqual([a.titre, a.description, a.rarete, a.motif, a.suite], ['Football', 'sport collectif', 'R', 'rareté R', 'arreter']);
  assert.ok(a.quand);
  site.fermer();
});

// ── par le panneau ──
const panneau = async (opts = {}) => {
  const site = await creerSite({ page: 'pulls', ...opts });
  site.wmr.monterUI();
  const racine = () => site.document.getElementById('wmr-host').shadowRoot;
  const q = (s) => racine().querySelector(s);
  const visible = (s) => { const e = q(s); return !!e && !e.hidden && e.style.display !== 'none'; };
  return { site, racine, q, visible, clic: (s) => q(`[data-paquets=${s}]`).click(), etat: () => q('.etat-paquet').textContent };
};

test('Lancer demande confirmation dans le panneau, sans rien cliquer sur la page ; Annuler laisse tout tel quel', async () => {
  const p = await panneau();
  p.clic('lancer');
  assert.ok(p.visible('.conf-paquets'));
  assert.match(p.q('.conf-texte').textContent, /R, UR, L/);
  assert.match(p.q('.conf-texte').textContent, /favoris.*Défausser|Défausser.*favoris/);
  assert.deepEqual(p.site.actions, []);
  p.clic('annuler');
  assert.equal(p.visible('.conf-paquets'), false);
  await p.site.attente(100);
  assert.deepEqual(p.site.actions, []);
  p.site.fermer();
});

test('panneau : confirmer ouvre le paquet, dit la carte et pourquoi, « Continuer » puis « Arrêter »', async () => {
  const p = await panneau();
  p.clic('lancer'); p.clic('confirmer');
  assert.equal(p.visible('.conf-paquets'), false);
  assert.ok(await attendreQue(() => p.visible('.arret-paquet')), 'le panneau s\'arrête');
  assert.match(p.q('.arret-texte').textContent, /Football/);
  assert.match(p.q('.arret-texte').textContent, /rareté R/);
  assert.deepEqual(types(p.site), ['ouvrir', ...FLECHES(3)]);
  p.clic('continuer');
  assert.ok(await attendreQue(() => /France/.test(p.q('.arret-texte').textContent)), 'arrêt suivant sur France');
  assert.match(p.q('.arret-texte').textContent, /rareté UR/);
  p.clic('arreter');
  assert.ok(await attendreQue(() => !p.visible('.arret-paquet')));
  assert.ok(await attendreQue(() => /laissé ouvert/.test(p.etat())));
  assert.deepEqual(types(p.site), ['ouvrir', ...FLECHES(4)], 'ni Continuer du site ni autre clic');
  assert.equal(p.site.paquets(), 10);
  p.site.fermer();
});

test('panneau : un échec du site s\'affiche en français, sans exception non gérée', async () => {
  const p = await panneau({ animationBloquee: true });
  p.clic('lancer'); p.clic('confirmer');
  assert.ok(await attendreQue(() => /pas apparue/.test(p.etat())));
  p.site.fermer();
});

// ── Wikipédia en renfort pour une carte sans description (ticket #19) ──
const SANS_DESCRIPTION = [
  { t: 'Aigaliers', d: '', r: 'C' },
  { t: 'Rome', d: 'capitale de l\'Italie', r: 'C' },
];
const ARTICLES = { Aigaliers: 'Aigaliers est une commune française située dans le département du Gard, en région Occitanie.' };

test('carte avec description : aucun appel Wikipédia', async () => {
  const site = await creerSite({ page: 'pulls', paquet: [{ t: 'Rome', d: 'capitale de l\'Italie', r: 'C' }], wikipedia: { articles: ARTICLES } });
  await lancer(site, { reglages: { raretes: [], interets: ['Gard'] } });
  assert.deepEqual(site.wikipedia(), []);
  site.fermer();
});

test('carte sans description : la phrase Wikipédia est testée et le motif dit que le mot vient de Wikipédia', async () => {
  const site = await creerSite({ page: 'pulls', paquet: SANS_DESCRIPTION, wikipedia: { articles: ARTICLES } });
  const d = decisions('arreter');
  const r = await lancer(site, { reglages: { raretes: [], interets: ['Gard'] }, surArret: d.surArret });
  assert.deepEqual(site.titresWikipedia(), ['Aigaliers']);
  assert.equal(r.etat, 'arret');
  assert.equal(d.vues[0].titre, 'Aigaliers');
  assert.equal(d.vues[0].raison.type, 'mot');
  assert.match(d.vues[0].raison.texte, /« Gard ».*Wikipédia/);
  assert.deepEqual(types(site), ['ouvrir', 'wikipedia'], 'seul Ouvrir est cliqué, puis la lecture Wikipédia');
  site.fermer();
});

test('mot déjà dans le titre : le motif ne parle pas de Wikipédia', async () => {
  const site = await creerSite({ page: 'pulls', paquet: SANS_DESCRIPTION, wikipedia: { articles: ARTICLES } });
  const d = decisions('arreter');
  await lancer(site, { reglages: { raretes: [], interets: ['Aigaliers'] }, surArret: d.surArret });
  assert.equal(d.vues[0].raison.texte, 'mot « Aigaliers »');
  site.fermer();
});

test('Wikipédia sans réponse (bloquée) : repli sur le titre, message en français, le paquet continue', async () => {
  const site = await creerSite({ page: 'pulls', paquet: SANS_DESCRIPTION, wikipedia: { bloque: true } });
  const dits = [];
  const r = await lancer(site, { reglages: { raretes: [], interets: ['Gard'] }, dire: (t) => dits.push(t) });
  assert.equal(r.etat, 'termine', 'pas d\'arrêt du script');
  assert.ok(dits.some((t) => /Wikipédia n'a pas pu être lue.*« Aigaliers » est testée sur son titre seul/.test(t)), dits.join('\n'));
  assert.ok(site.wikipedia().length >= 1, 'chemin pris : Wikipédia a bien été appelée');
  site.fermer();
});

test('titre absent de Wikipédia : repli sur le titre, message en français, titre seul encore testé', async () => {
  const site = await creerSite({ page: 'pulls', paquet: [{ t: 'Zorglub', d: '', r: 'C' }], wikipedia: { articles: {} } });
  const dits = [];
  const d = decisions('arreter');
  const r = await lancer(site, { reglages: { raretes: [], interets: ['zorg'] }, surArret: d.surArret, dire: (t) => dits.push(t) });
  assert.ok(dits.some((t) => /pas de phrase exploitable pour « Zorglub »/.test(t)), dits.join('\n'));
  assert.equal(r.etat, 'arret', 'le titre seul est testé');
  assert.equal(d.vues[0].raison.texte, 'mot « zorg »');
  site.fermer();
});
