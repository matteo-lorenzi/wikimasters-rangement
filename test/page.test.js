// Le userscript sur le faux site (test/faux-site.js) : ce que la personne voit et ce qui arrive à ses cartes.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerSite } = require('./faux-site');

const attendreQue = async (cond, ms = 15000) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { if (cond()) return true; await new Promise((r) => setTimeout(r, 10)); }
  return cond();
};
const serie = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const date = (i) => new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString();

// Le panneau du script, dans son shadow root.
const panneau = (site) => {
  site.wmr.monterUI();
  const root = site.document.getElementById('wmr-host').shadowRoot;
  return {
    root,
    statut: () => root.querySelector('.st').textContent,
    cliquer: (sel) => root.querySelector(sel).click(),
    ranger: () => root.querySelector('[data-a=ranger]').click(),
    appliquer: () => root.querySelector('[data-go]').click(),
  };
};
// Lance « Ranger » puis « Appliquer », et attend le bilan final.
const rangerTout = async (site) => {
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]') || /⚠️/.test(p.statut())), 'aperçu : ' + p.statut());
  assert.ok(p.root.querySelector('[data-go]'), p.statut());
  p.appliquer();
  assert.ok(await attendreQue(() => /✅|⚠️|Terminé, mais/.test(p.statut()), 60000), 'bilan : ' + p.statut());
  return p;
};
const sansIncident = (site) => {
  assert.deepEqual(site.actions.filter((a) => a.type === 'fiche' || a.type === 'DÉFAUSSER'), [], 'aucune fiche ouverte, aucune défausse');
};

// ── panneau ──

test('le panneau s\'ouvre et se ferme', async () => {
  const site = await creerSite({ cartes: [] });
  const p = panneau(site);
  const pan = p.root.querySelector('.pan');
  assert.equal(pan.style.display, 'none');
  p.cliquer('.fab');
  assert.equal(pan.style.display, '');
  p.cliquer('.x');
  assert.equal(pan.style.display, 'none');
  site.fermer();
});

// ── lecture par l'écran ──

test('lecture d\'une vue : pagination tardive au total faux, cartes sans description', async () => {
  const cartes = serie(120, (i) => ({ t: `Carte ${i}`, d: i % 7 ? `description ${i}` : '', r: 'C', obtenu: date(i) }));
  const site = await creerSite({ cartes, pagesFantomes: 3 });
  const lues = await site.wmr.lireVue();
  assert.equal(lues.length, 120);
  assert.equal(lues.filter((c) => c.d === '').length, 18);
  assert.equal(site.pagesVisitees(), 2, 'pages 2 et 3, jamais les pages fantômes annoncées');
  site.fermer();
});

test('une vue de 100 cartes se termine sur la page vide qui suit', async () => {
  const site = await creerSite({ cartes: serie(100, (i) => ({ t: `Carte ${i}`, d: 'x', obtenu: date(i) })), pagesFantomes: 4 });
  const lues = await site.wmr.lireVue();
  assert.equal(lues.length, 100);
  assert.ok(site.pagesVisitees() <= 2);
  site.fermer();
});

// ── filtres ──

test('filtre d\'étiquette : le compteur « (n) » du libellé ne trompe pas le script', async () => {
  const cartes = serie(12, (i) => ({ t: `Joueur ${i}`, d: 'footballeur', tags: ['Sport'] }));
  const site = await creerSite({ cartes, etiquettes: ['Sport', 'Nature'] });
  await site.wmr.choisirFiltre('Sport');
  assert.equal(site.document.querySelector('[aria-label="Filtrer par étiquette"]').textContent, '#Sport (12)');
  const menus = site.actions.filter((a) => a.type === 'menu').length;
  await site.wmr.choisirFiltre('Sport');
  assert.equal(site.actions.filter((a) => a.type === 'menu').length, menus, 'déjà sur #Sport : le menu n\'est pas rouvert');
  assert.equal(site.actions.filter((a) => a.type === 'filtre').length, 1);
  const noms = (await site.wmr.listerEtiquettes()).map((e) => e.nom).sort();
  assert.deepEqual([...noms], ['Nature', 'Sport']);
  site.fermer();
});

// ── étiquetage ──

const choisir = async (site, titres) => {
  await site.wmr.modeSelection(true);
  for (const el of site.wmr.cartesDom()) if (titres.includes(el.h.textContent)) { el.card.click(); await site.attente(5); }
};

for (const fermetureAuto of [false, true]) {
  test(`pose : le bilan est lu et la fenêtre fermée (fenêtre qui se ferme seule : ${fermetureAuto})`, async () => {
    const cartes = serie(5, (i) => ({ t: `Joueur ${i}`, d: 'footballeur', tags: i === 0 ? ['Sport'] : [] }));
    const site = await creerSite({ cartes, etiquettes: ['Sport'], fermetureAuto });
    await choisir(site, ['Joueur 0', 'Joueur 1', 'Joueur 2']);
    const bilan = await site.wmr.poserEtiquette('Sport');
    assert.deepEqual({ ...bilan }, { poses: 2, deja: 1 });
    assert.ok(!/Appliquer une étiquette/.test(site.document.body.innerText), 'fenêtre fermée');
    assert.deepEqual(site.cartes.filter((c) => c.tags.includes('Sport')).map((c) => c.t), ['Joueur 0', 'Joueur 1', 'Joueur 2']);
    site.fermer();
  });
}

test('pose : une étiquette absente est créée', async () => {
  const site = await creerSite({ cartes: [{ t: 'Comète X', d: 'comète' }], etiquettes: ['Sport'] });
  await choisir(site, ['Comète X']);
  await site.wmr.poserEtiquette('Espace');
  assert.deepEqual(site.cartes[0].tags, ['Espace']);
  site.fermer();
});

test('le site revient en page 1 après un étiquetage : le script retourne sur sa page et finit', async () => {
  // « Toutes les étiquettes » : les cartes étiquetées restent en place
  const cartes = serie(80, (i) => ({ t: `Carte ${i}`, d: i < 50 ? 'x' : i % 2 ? 'footballeur' : 'comète' }));
  const site = await creerSite({ cartes, etiquettes: ['Sport', 'Espace'], retourPage1: true });
  await site.wmr.changerPage(1);
  const plan = new Map();
  for (const c of cartes.slice(50)) plan.set(site.wmr.cle({ t: c.t, d: c.d, r: 'C' }), [c.d === 'comète' ? 'Espace' : 'Sport']);
  await site.wmr.appliquerSurPage(plan, new Set(), () => {}, 2);
  for (const c of site.cartes.slice(50)) assert.deepEqual(c.tags, [c.d === 'comète' ? 'Espace' : 'Sport'], c.t);
  assert.ok(site.cartes.slice(0, 50).every((c) => !c.tags.length));
  sansIncident(site);
  site.fermer();
});

// ── mode Ranger ──

// 150 cartes déjà rangées, plus récentes ; puis 90 sans étiquette, dont 30 sans règle.
const collection = () => [
  ...serie(150, (i) => ({ t: `Déjà ${i}`, d: 'footballeur', tags: ['Sport'], obtenu: date(1000 + i) })),
  ...serie(90, (i) => {
    const d = ['footballeur français', "espèce d'insectes", 'xyz sans règle', 'commune française', 'chanteur et acteur américain', 'homme politique'][i % 6];
    return { t: `Nouvelle ${i}`, d, obtenu: date(i) };
  }),
];
const attendues = { 'footballeur français': ['Sport'], "espèce d'insectes": ['Nature'], 'xyz sans règle': [], 'commune française': ['Géographie'], 'chanteur et acteur américain': ['Musique', 'Cinéma & TV'], 'homme politique': ['Politique & Droit'] };

test('Ranger : chaque carte reçoit ses étiquettes, dans « Sans étiquette », en 2 changements de page au plus', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'] });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  for (const c of site.cartes.filter((x) => x.t.startsWith('Nouvelle'))) assert.deepEqual(c.tags, attendues[c.d], c.t);
  assert.ok(site.actions.some((a) => a.type === 'filtre' && a.filtre === ''), 'passe 1 dans « Sans étiquette »');
  const pages1 = site.actions.findIndex((a) => a.type === 'filtre' && a.filtre === 'Musique');
  assert.ok(site.actions.slice(0, pages1).filter((a) => a.type === 'page').length <= 2, 'passe 1 : 2 changements de page au plus');
  sansIncident(site);
  site.fermer();
});

test('Ranger : lecture API complète, puis seulement les cartes obtenues depuis', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'] });
  await rangerTout(site);
  site.cartes.push({ id: 9001, t: 'Plus récente', d: 'astéroïde', r: 'C', tags: [], obtenu: date(5000) });
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => /nouvelle/.test(p.statut())), p.statut());
  assert.match(p.statut(), /^1 carte\(s\) nouvelle\(s\), dont 1 à ranger/);
  assert.ok(site.actions.some((a) => a.type === 'api' && /untagged=1/.test(a.url)));
  site.fermer();
});

test('Ranger : sans API, lecture par l\'écran', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], apiEnPanne: true });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  site.fermer();
});

// ── suppression d'étiquette (Migration) ──

test('suppression : la confirmation native qui nomme l\'étiquette est acceptée', async () => {
  const site = await creerSite({ cartes: [{ t: 'A', d: 'x', tags: ['Vieux'] }], etiquettes: ['Vieux', 'Sport'] });
  assert.equal(await site.wmr.supprimerEtiquette('Vieux'), 'supprimée');
  assert.deepEqual(site.cartes[0].tags, []);
  assert.deepEqual([...site.etiquettes], ['Sport']);
  site.fermer();
});

test('suppression : une confirmation inattendue est refusée', async () => {
  const site = await creerSite({ cartes: [{ t: 'A', d: 'x', tags: ['Vieux'] }], etiquettes: ['Vieux'], messageConfirm: 'Vider la corbeille ?' });
  await assert.rejects(site.wmr.supprimerEtiquette('Vieux'), /Confirmation inattendue/);
  assert.deepEqual(site.cartes[0].tags, ['Vieux']);
  site.fermer();
});
