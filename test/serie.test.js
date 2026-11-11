// Ouvrir tous les paquets restants, une seule confirmation (ticket #17), sur le faux site de la page /pulls.
// Règle 8 : chaque test regarde les clics faits sur la page (site.actions), pas seulement le résultat.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerSite } = require('./faux-site');

const types = (site) => site.actions.map((a) => a.type);
const UN_PAQUET = ['ouvrir', 'fleche', 'fleche', 'fleche', 'fleche', 'continuer'];
const attendreQue = async (cond, ms = 5000) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { if (cond()) return true; await new Promise((r) => setTimeout(r, 10)); }
  return cond();
};
const serie = (site, opts) => site.wmr.ouvrirSerie({ reglages: { raretes: [], interets: [] }, surArret: async () => 'arreter', ...opts });

test('série de 3 paquets sans arrêt : un seul clic Ouvrir par paquet, compteur à 0, plus de paquet', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 3, animation: 0 });
  const r = await serie(site);
  assert.deepEqual(types(site), [...UN_PAQUET, ...UN_PAQUET, ...UN_PAQUET]);
  assert.equal(site.paquets(), 0);
  assert.deepEqual([r.etat, r.ouverts, r.restants], ['epuise', 3, 0]);
  site.fermer();
});

test('2 s entre deux paquets (échelle de test), aucune pause entre deux cartes', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0 });
  await serie(site);
  const t = site.actions.map((a) => a.quand);
  const entreCartes = Math.max(...[2, 3, 4].map((i) => t[i] - t[i - 1])); // flèche -> flèche
  const entrePaquets = t[6] - t[5]; // Continuer du paquet 1 -> Ouvrir du paquet 2
  assert.ok(entrePaquets >= 38, `pause entre paquets trop courte : ${entrePaquets} ms (attendu ~40 ms = 2 s × 0,02)`);
  assert.ok(entreCartes < entrePaquets, `les cartes s'enchaînent sans pause (${entreCartes} ms contre ${entrePaquets} ms)`);
  site.fermer();
});

test('arrêt de la personne au 1er paquet : la série ne continue pas, le paquet reste ouvert', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 5 });
  const r = await serie(site, { reglages: { raretes: ['R'], interets: [] } });
  assert.equal(r.etat, 'arret');
  assert.equal(r.carte.t, 'Football');
  assert.deepEqual([r.ouverts, r.restants], [0, 4], 'le paquet laissé ouvert n est pas compté dans les restants');
  await site.attente(200);
  assert.deepEqual(types(site), ['ouvrir', 'fleche', 'fleche', 'fleche']);
  site.fermer();
});

test('« Continuer » après un arrêt : la série reprend jusqu\'au prochain arrêt, puis jusqu\'à la fin', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0 });
  const arrets = [];
  const r = await serie(site, { reglages: { raretes: ['R', 'UR'], interets: [] }, surArret: async (c) => { arrets.push(c.t); return 'continuer'; } });
  assert.deepEqual(arrets, ['Football', 'France', 'Football', 'France']);
  assert.deepEqual([r.etat, r.ouverts, r.restants], ['epuise', 2, 0]);
  assert.deepEqual(types(site), [...UN_PAQUET, ...UN_PAQUET]);
  site.fermer();
});

test('0 paquet disponible au départ : arrêt avec message, aucun clic', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 0 });
  const r = await serie(site);
  assert.deepEqual([r.etat, r.ouverts, r.restants], ['epuise', 0, 0]);
  assert.deepEqual(site.actions, []);
  site.fermer();
});

test('plafond : N paquets au plus, N lu sur la page au départ, même si le site en régénère un', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0 });
  const r = await serie(site, { surCarte: async () => { site.regenerer(); } });
  assert.deepEqual([r.etat, r.ouverts], ['termine', 2]);
  assert.ok(r.restants >= 1, 'il en reste : on ne vide pas ce que le site régénère');
  assert.equal(types(site).filter((t) => t === 'ouvrir').length, 2);
  site.fermer();
});

test('erreur du site à l\'ouverture du 2e paquet : arrêt bruyant, paquets déjà ouverts dits, plus aucun clic', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 4, animation: 0, erreurAuPaquet: 2 });
  await assert.rejects(serie(site), (e) => /carte 1 .*n'est pas apparue/.test(e.message) && /1 paquet ouvert/.test(e.message));
  const avant = types(site);
  assert.deepEqual(avant, [...UN_PAQUET, 'ouvrir']);
  await site.attente(200);
  assert.deepEqual(types(site), avant, 'la série n\'insiste pas');
  assert.equal(site.paquets(), 3);
  site.fermer();
});

test('compteur illisible sur la page : échec bruyant, rien de cliqué', async () => {
  const site = await creerSite({ page: 'pulls' });
  site.document.querySelectorAll('#site div').forEach((d) => { d.textContent = ''; });
  await assert.rejects(serie(site), /compteur de paquets/i);
  assert.deepEqual(site.actions, []);
  site.fermer();
});

test('compteur absent après un paquet ouvert (site à 0) : fin de série, pas d erreur', async () => {
  // Hypothèse non observée sur le vrai site (docs/wikimasters.md) : à 0, la page n'affiche plus « N / 10 paquets disponibles ».
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0, compteurAbsentA0: true });
  const r = await serie(site);
  assert.deepEqual([r.etat, r.ouverts, r.restants], ['epuise', 2, 0]);
  assert.deepEqual(types(site), [...UN_PAQUET, ...UN_PAQUET]);
  site.fermer();
});


test('démontage demandé pendant la pause entre deux paquets : plus aucun clic, drapeau levé', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 3, animation: 0 });
  const r = await serie(site, { annule: () => types(site).includes('continuer') });
  assert.equal(r.etat, 'abandon');
  assert.equal(r.ouverts, 1);
  await site.attente(150);
  assert.deepEqual(types(site), UN_PAQUET, 'pas de 2e Ouvrir');
  assert.equal(site.wmr.store.get('paquet_en_cours', null), null);
  site.fermer();
});

test('démontage demandé en pleine lecture d un paquet : pas une flèche de plus, drapeau levé', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0 });
  const r = await serie(site, { annule: () => types(site).includes('ouvrir') });
  assert.equal(r.etat, 'abandon');
  await site.attente(150);
  assert.deepEqual(types(site), ['ouvrir']);
  assert.equal(site.wmr.store.get('paquet_en_cours', null), null);
  site.fermer();
});

test('« paquet en cours » reste posé pendant toute la série, pause entre deux paquets comprise', async () => {
  const site = await creerSite({ page: 'pulls', paquets: 2, animation: 0 });
  const vu = [];
  await serie(site, { annule: () => { if (types(site).includes('continuer')) vu.push(site.wmr.store.get('paquet_en_cours', null)); return false; } });
  assert.ok(vu.length >= 1 && vu.every((v) => v), 'drapeau posé à la fin de la pause');
  assert.equal(site.wmr.store.get('paquet_en_cours', null), null, 'levé à la fin de la série');
  site.fermer();
});

// ── par le panneau ──
const panneau = async (opts = {}) => {
  const site = await creerSite({ page: 'pulls', animation: 0, ...opts });
  site.wmr.monterUI();
  const racine = () => site.document.getElementById('wmr-host').shadowRoot;
  const q = (s) => racine().querySelector(s);
  const visible = (s) => { const e = q(s); return !!e && !e.hidden && e.style.display !== 'none'; };
  return { site, q, visible, clic: (s) => q(`[data-paquets=${s}]`).click(), etat: () => q('.etat-paquet').textContent };
};

test('panneau : une seule confirmation (« N paquets au plus »), puis la série dit combien ouverts et combien restent', async () => {
  const p = await panneau({ paquets: 2 });
  p.clic('lancer');
  assert.match(p.q('.conf-texte').textContent, /2 paquets au plus/);
  assert.match(p.q('.conf-texte').textContent, /première carte qui t'intéresse/);
  p.clic('confirmer');
  for (const nom of ['Football', 'France', 'Football', 'France']) {
    assert.ok(await attendreQue(() => p.visible('.arret-paquet') && p.q('.arret-texte').textContent.includes(nom)), nom);
    p.clic('continuer');
    await attendreQue(() => !p.visible('.arret-paquet'));
  }
  assert.ok(await attendreQue(() => /2 paquets ouverts/.test(p.etat())), p.etat());
  assert.match(p.etat(), /0 restant/);
  assert.match(p.etat(), /plus de paquet/i);
  assert.equal(types(p.site).filter((t) => t === 'ouvrir').length, 2);
  p.site.fermer();
});

test('panneau : le statut en cours dit où en est la série', async () => {
  const p = await panneau({ paquets: 3 });
  p.clic('lancer'); p.clic('confirmer');
  assert.ok(await attendreQue(() => p.visible('.arret-paquet')));
  assert.match(p.etat(), /paquet 1 sur 3/i);
  p.clic('arreter');
  assert.ok(await attendreQue(() => /laissé ouvert/.test(p.etat())));
  assert.match(p.etat(), /0 paquet ouvert/);
  assert.match(p.etat(), /2 restants/);
  p.site.fermer();
});

test('panneau : 0 paquet, pas de confirmation, message en français', async () => {
  const p = await panneau({ paquets: 0 });
  p.clic('lancer');
  assert.equal(p.visible('.conf-paquets'), false);
  assert.match(p.etat(), /plus de paquet/i);
  assert.deepEqual(p.site.actions, []);
  p.site.fermer();
});

test('panneau : une erreur du site s\'affiche avec le nombre de paquets déjà ouverts', async () => {
  const p = await panneau({ paquets: 3, erreurAuPaquet: 2 });
  for (const r of ['R', 'UR', 'L']) { const c = p.q(`[data-rarete=${r}]`); c.checked = false; c.dispatchEvent(new p.site.window.Event('change')); }
  p.clic('lancer'); p.clic('confirmer');
  assert.ok(await attendreQue(() => /⚠️/.test(p.etat())), p.etat());
  assert.match(p.etat(), /1 paquet ouvert/);
  p.site.fermer();
});

test('panneau démonté (changement de page) sur un arrêt : la série s arrête, aucun clic, drapeau levé', async () => {
  const p = await panneau({ paquets: 3 });
  p.clic('lancer'); p.clic('confirmer');
  assert.ok(await attendreQue(() => p.visible('.arret-paquet')));
  const avant = types(p.site);
  p.site.wmr.demonterUI(p.site.document.getElementById('wmr-host'));
  await p.site.attente(300);
  assert.deepEqual(types(p.site), avant, 'ni flèche ni Ouvrir après le démontage');
  assert.equal(p.site.wmr.store.get('paquet_en_cours', null), null);
  p.site.fermer();
});
