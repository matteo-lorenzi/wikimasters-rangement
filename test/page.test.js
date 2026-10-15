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

// Le panneau du script, dans son shadow root (relu à chaque fois : la page peut avoir été rechargée).
const panneau = (site) => {
  site.wmr.monterUI();
  const p = {
    // pendant un rechargement, plus de panneau : un élément vide en attendant
    get root() { return site.document.getElementById('wmr-host')?.shadowRoot || site.document.createElement('div'); },
    statut: () => p.root.querySelector('.st')?.textContent || '',
    journal: () => p.root.querySelector('.log')?.textContent || '',
    cliquer: (sel) => p.root.querySelector(sel).click(),
    ranger: () => p.root.querySelector('[data-a=ranger]').click(),
    appliquer: () => p.root.querySelector('[data-go]').click(),
  };
  return p;
};
const BILAN = /✅|⚠️|Terminé, mais/;
// Lance « Ranger » puis « Appliquer », et attend le bilan final.
const rangerTout = async (site) => {
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]') || /⚠️/.test(p.statut())), 'aperçu : ' + p.statut());
  assert.ok(p.root.querySelector('[data-go]'), p.statut());
  p.appliquer();
  assert.ok(await attendreQue(() => BILAN.test(p.statut()), 60000), 'bilan : ' + p.statut());
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

test('chargement en échec : la lecture s\'arrête avec un message au lieu de finir en silence', async () => {
  const site = await creerSite({ cartes: serie(120, (i) => ({ t: `Carte ${i}`, d: 'x', obtenu: date(i) })), chargementsEnEchec: [2] });
  await assert.rejects(site.wmr.lireVue(), /n'a pas pu charger.*Recharge la page/s);
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

test('pose lente : « Terminé » arrive après ~50 s, le script l\'attend sans croire à un refus', async () => {
  // 1 000 ms ici = 50 s pour le script (attentes × 0,02) : plus que son réessai (3 s + 30 s), moins que sa limite (90 s)
  const site = await creerSite({ cartes: [{ t: 'Joueur', d: 'footballeur' }], etiquettes: ['Sport'], pose: 1000 });
  await choisir(site, ['Joueur']);
  const bilan = await site.wmr.poserEtiquette('Sport');
  assert.deepEqual({ ...bilan }, { poses: 1, deja: 0 });
  assert.deepEqual(site.actions.filter((a) => a.type === 'pose').length, 1);
  site.fermer();
});

test('pose refusée une fois par le site : le script réessaie et réussit', async () => {
  const site = await creerSite({ cartes: [{ t: 'Joueur', d: 'footballeur' }], etiquettes: ['Sport'], echecsPose: 1 });
  await choisir(site, ['Joueur']);
  const bilan = await site.wmr.poserEtiquette('Sport');
  assert.equal(bilan.poses, 1);
  assert.deepEqual(site.cartes[0].tags, ['Sport']);
  site.fermer();
});

test('pose refusée deux fois : arrêt rapide avec un message qui dit quoi faire, fenêtre fermée', async () => {
  const site = await creerSite({ cartes: [{ t: 'Joueur', d: 'footballeur' }], etiquettes: ['Sport'], echecsPose: 2 });
  await choisir(site, ['Joueur']);
  const debut = Date.now();
  await assert.rejects(site.wmr.poserEtiquette('Sport'), /refusé.*rien n'a été posé.*relance/s);
  assert.ok(Date.now() - debut < 1500, 'sans attendre la limite de 90 s');
  assert.ok(!/Appliquer une étiquette/.test(site.document.body.innerText), 'fenêtre fermée');
  assert.deepEqual(site.cartes[0].tags, []);
  site.fermer();
});

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

// ── sélection : le moins de clics possible, jamais une carte de trop ──

const pageMixte = (n) => serie(50, (i) => ({ t: `Carte ${i}`, d: i < n ? 'footballeur' : 'xyz sans règle', obtenu: date(i) }));
const planDe = (site, cartes) => new Map(cartes.filter((c) => c.d === 'footballeur').map((c) => [site.wmr.cle({ t: c.t, d: c.d, r: 'C' }), ['Sport']]));
const clics = (site) => site.actions.filter((a) => a.type === 'clic').length;

test('plus de la moitié de la page à poser : tout cocher puis décocher le reste (11 clics au lieu de 40)', async () => {
  const cartes = pageMixte(40);
  const site = await creerSite({ cartes, etiquettes: ['Sport'] });
  await site.wmr.appliquerSurPage(planDe(site, cartes), new Set(), () => {});
  assert.equal(clics(site), 11, '1 « Tout sélectionner (page) » + 10 cartes décochées');
  assert.equal(site.poses().length, 1);
  assert.deepEqual(site.poses()[0].titres.length, 40);
  for (const c of site.cartes) assert.deepEqual(c.tags, c.d === 'footballeur' ? ['Sport'] : [], c.t);
  site.fermer();
});

test('moins de la moitié de la page à poser : une carte cochée par clic', async () => {
  const cartes = pageMixte(10);
  const site = await creerSite({ cartes, etiquettes: ['Sport'] });
  await site.wmr.appliquerSurPage(planDe(site, cartes), new Set(), () => {});
  assert.equal(clics(site), 10);
  for (const c of site.cartes) assert.deepEqual(c.tags, c.d === 'footballeur' ? ['Sport'] : [], c.t);
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
  assert.ok(!site.actions.some((a) => a.type === 'recherche'), 'petit stock : page par page, sans recherche');
  sansIncident(site);
  site.fermer();
});

// Des titres variés, comme de vrais noms : aucun mot de titre commun à tout un groupe.
const nom = (i) => { let x = (i + 1) * 2654435761 % 4294967296, s = ''; for (let k = 0; k < 8; k++) { s += 'bcdfghjklmnprstvz'[x % 17] + 'aeiou'[Math.floor(x / 32) % 5]; x = Math.floor(x / 7) + k * 977; } return s[0].toUpperCase() + s.slice(1); };

// Gros stock (≥ 200 cartes à ranger) : 230 rangeables + des intrus que la recherche ramène aussi.
const grosStock = () => [
  ...serie(100, (i) => ({ t: nom(i), d: ['footballeur français', 'footballeur brésilien', 'footballeuse anglaise'][i % 3], obtenu: date(i * 3) })),
  ...serie(70, (i) => ({ t: nom(100 + i), d: "espèce d'insectes", obtenu: date(i * 3 + 1) })),
  ...serie(40, (i) => ({ t: nom(200 + i), d: 'homme politique', obtenu: date(i * 3 + 2) })),
  ...serie(20, (i) => ({ t: nom(300 + i), d: 'astéroïde', obtenu: date(400 + i) })),
  ...serie(30, (i) => ({ t: nom(400 + i), d: 'xyz sans règle', obtenu: date(500 + i) })),
  // intrus : la recherche « footballeur » les trouve par le titre, mais le moteur ne leur donne rien (ou autre chose)
  { t: 'Footballeurland', d: 'xyz sans règle', obtenu: date(600) },
  { t: 'Footballeur (homonymie)', d: "page d'homonymie de Wikimédia", obtenu: date(601) },
  { t: 'Le Footballeur', d: 'film de 1974', obtenu: date(602) },
];

test('Ranger, gros stock : recherches groupées d\'abord, puis page par page ; chaque carte reçoit ses étiquettes, les intrus aucune autre', async () => {
  const site = await creerSite({ cartes: grosStock(), etiquettes: ['Sport', 'Nature'] });
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]')), p.statut());
  assert.match(p.root.querySelector('.out').textContent, /Rangement groupé/);
  p.appliquer();
  assert.ok(await attendreQue(() => /✅|⚠️|Terminé, mais/.test(p.statut()), 60000), p.statut());
  assert.match(p.statut(), /✅ 231 carte\(s\) rangée\(s\)/);
  const tags = (t) => site.cartes.find((c) => c.t === t).tags;
  assert.deepEqual(tags(nom(4)), ['Sport']);
  assert.deepEqual(tags(nom(109)), ['Nature']);
  assert.deepEqual(tags(nom(200)), ['Politique & Droit']);
  assert.deepEqual(tags(nom(303)), ['Espace']);
  assert.deepEqual(tags(nom(401)), [], 'sans règle : reste sans étiquette');
  assert.deepEqual(tags('Footballeurland'), [], 'intrus sans règle : jamais coché');
  assert.deepEqual(tags('Footballeur (homonymie)'), []);
  assert.deepEqual(tags('Le Footballeur'), ['Cinéma & TV'], 'intrus d\'un autre domaine : seulement son propre domaine');
  assert.ok(site.actions.some((a) => a.type === 'recherche' && /footba/i.test(a.q)), 'recherche groupée lancée');
  assert.ok(site.poses().some((x) => x.n === 50), 'une page entière étiquetée d\'un coup');
  assert.equal(site.etat.q, '', 'la recherche est vidée à la fin');
  sansIncident(site);
  site.fermer();
});

test('Doublons : chaque exemplaire d\'une carte possédée en double reçoit !Doublon, rien d\'autre ne bouge', async () => {
  const site = await creerSite({
    cartes: [
      { t: 'Olanchito', d: 'municipalité du Honduras', tags: ['Géographie'] }, { t: 'Olanchito', d: 'municipalité du Honduras' },
      { t: 'Rome', d: 'capitale de l\'Italie', r: 'C' }, { t: 'Rome', d: 'capitale de l\'Italie', r: 'R' }, // rareté différente : pas un doublon
      { t: 'Olanchito (homonymie)', d: '' },
      { t: 'Déjà', d: 'x', tags: ['!Doublon'] }, { t: 'Déjà', d: 'x', tags: ['!Doublon'] },
    ],
  });
  const p = panneau(site);
  p.cliquer('[data-a=doublons]');
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]')), p.statut());
  assert.match(p.statut(), /1 carte\(s\) en double/);
  p.appliquer();
  assert.ok(await attendreQue(() => BILAN.test(p.statut()), 60000), p.statut());
  assert.match(p.statut(), /✅ 1 carte\(s\)/);
  const tags = (t, r = 'C') => site.cartes.filter((c) => c.t === t && c.r === r).map((c) => c.tags);
  assert.deepEqual(tags('Olanchito'), [['Géographie', '!Doublon'], ['!Doublon']]);
  assert.deepEqual([...tags('Rome'), ...tags('Rome', 'R'), ...tags('Olanchito (homonymie)')], [[], [], []]);
  assert.equal(site.etat.q, '', 'la recherche est vidée à la fin');
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

// Cas de la personne (v1.9.2, 2026-10-13) : 186 cartes rangeables par les nouvelles règles, jamais relues par Ranger.
test('Ranger : les règles ont changé depuis le dernier rangement, toutes les cartes sans étiquette sont relues', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'] });
  await rangerTout(site);
  // une règle ajoutée depuis : les 15 cartes « xyz sans règle » restées sans étiquette sont relues
  site.wmr.store.set('ranger_regles', 'empreinte des anciennes règles');
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => /^\d+ carte/.test(p.statut())), p.statut());
  assert.match(p.statut(), /^15 carte\(s\) sans étiquette/);
  // relues avec les règles d'aujourd'hui : la prochaine fois, seulement les nouvelles cartes
  site.wmr.ui().out.querySelector('[data-go]')?.click();
  assert.ok(await attendreQue(() => /✅|⚠️|^15 carte/.test(p.statut())), p.statut());
  p.ranger();
  assert.ok(await attendreQue(() => /nouvelle/.test(p.statut())), p.statut());
  site.fermer();
});

test('Ranger : API illisible, lecture par l\'écran', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], apiIllisible: true });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  site.fermer();
});

// ── ratés du site : réessai, rechargement et reprise, journal des bugs ──

const toutRange = (site) => {
  for (const c of site.cartes.filter((x) => x.t.startsWith('Nouvelle'))) assert.deepEqual(c.tags, attendues[c.d], c.t);
};
const journalBugs = async (p) => {
  p.cliquer('[data-a=bugs]');
  const zone = p.root.querySelector('.out textarea'); // journal vide : « Aucun bug noté », sans zone de texte
  return zone ? zone.value : p.root.querySelector('.out').textContent;
};

test('lecture API : une erreur passagère est réessayée, sans lecture par l\'écran', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], apiEchecs: 2 });
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => p.root.querySelector('[data-go]')), p.statut());
  assert.match(p.statut(), /dont 75 à ranger/);
  assert.ok(!site.actions.some((a) => a.type === 'filtre'), 'lecture par l\'API, pas par l\'écran : ' + p.journal());
  assert.equal(site.rechargements(), 0);
  site.fermer();
});

test('lecture API en panne prolongée : la page est rechargée et la lecture relancée', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], apiEchecs: 3 });
  const p = panneau(site);
  p.ranger();
  assert.ok(await attendreQue(() => site.rechargements() === 1 && p.root.querySelector('[data-go]')), 'aperçu après rechargement : ' + p.statut());
  assert.match(p.statut(), /dont 75 à ranger/);
  p.appliquer();
  assert.ok(await attendreQue(() => BILAN.test(p.statut()), 60000), p.statut());
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  toutRange(site);
  site.fermer();
});

test('raté du site pendant le rangement : rechargement, reprise automatique, et tout est rangé', async () => {
  // chargement n° 6 de la liste : en pleine passe 1
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], chargementsEnEchec: [6] });
  const p = await rangerTout(site);
  assert.equal(site.rechargements(), 1);
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  toutRange(site); // y compris la 2e étiquette des cartes à deux domaines : ce qui était fait n'est pas perdu
  const bugs = await journalBugs(p);
  assert.match(bugs, /chargement de la collection a échoué/);
  assert.match(bugs, /rechargement automatique 1\/3/);
  sansIncident(site);
  site.fermer();
});

test('ratés à répétition : 3 rechargements au plus, puis arrêt avec un message ; le journal des bugs se copie et se vide', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], chargementsEnEchec: serie(200, (i) => i + 6) });
  const p = await rangerTout(site);
  assert.equal(site.rechargements(), 3);
  assert.match(p.statut(), /⚠️ .*chargement de la collection a échoué.*rechargé 3 fois/s);
  const bugs = await journalBugs(p);
  assert.equal((bugs.match(/^#\d+ /gm) || []).length, 4, bugs);
  assert.match(bugs, /Version : /);
  assert.match(bugs, /Filtre : Sans étiquette/);
  assert.match(bugs, /Journal :/);
  p.cliquer('[data-vider]');
  assert.match(p.root.querySelector('.out').textContent, /Aucun bug noté/);
  site.fermer();
});

// Journal des bugs de la personne, 2026-10-12 : recherches ratées par le serveur, menu vide après rechargement.

test('recherche ratée pendant le rangement groupé : relancée sur place, sans recharger la page', async () => {
  const site = await creerSite({ cartes: grosStock(), etiquettes: ['Sport', 'Nature'], echecsRecherche: 2 });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 231 carte\(s\) rangée\(s\)/);
  assert.equal(site.rechargements(), 0);
  // relancée en MAJUSCULES, et aucun mot abandonné (sinon ses cartes seraient rangées page par page)
  assert.ok(site.actions.some((a) => a.type === 'recherche' && /[A-Z]/.test(a.q) && a.q === a.q.toUpperCase()));
  assert.doesNotMatch(await journalBugs(p), /abandonnée/);
  site.fermer();
});

test('recherche toujours impossible : le mot est abandonné et noté, ses cartes sont rangées page par page', async () => {
  const site = await creerSite({ cartes: grosStock(), etiquettes: ['Sport', 'Nature'], recherchesImpossibles: ['footba'] });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 231 carte\(s\) rangée\(s\)/);
  assert.equal(site.rechargements(), 0);
  assert.deepEqual(site.cartes.find((c) => c.t === nom(7)).tags, ['Sport']);
  assert.match(await journalBugs(p), /« footba » abandonnée/);
  site.fermer();
});

test('menu des étiquettes encore vide juste après l\'ouverture de la page : le script attend ses options', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], menuTardif: 300 });
  await site.wmr.choisirFiltre('');
  assert.equal(site.document.querySelector('[aria-label="Filtrer par étiquette"]').textContent, 'Sans étiquette');
  site.fermer();
});

test('ratés espacés, avec des cartes rangées entre deux : la séance va jusqu\'au bout', async () => {
  // une séance propre fait ~15 chargements de liste ; après chaque rechargement, la reprise pose au moins une carte avant le raté suivant
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport'], chargementsEnEchec: [6, 11, 16, 21] });
  const p = await rangerTout(site);
  assert.match(p.statut(), /✅ 75 carte\(s\) rangée\(s\)/);
  assert.ok(site.rechargements() > 3, `${site.rechargements()} rechargement(s) : plus que la limite de 3 d'affilée`);
  toutRange(site);
  site.fermer();
});

// ── suppression d'étiquette (Migration) ──

test('migration : une étiquette de métier ou de lieu est supprimable dès que ses cartes ont son domaine ; une nationalité exige son mot', async () => {
  const site = await creerSite({ cartes: [] });
  const w = site.wmr;
  // cas du rapport de la personne (2026-10-13) : « Kashihara » (#Commune) et « Cherry (film, 2021) » (#Américain), sans le mot
  const cartes = [
    { t: 'Kashihara', d: 'ville du Japon', r: 'Commune' },
    { t: 'Cherry (film, 2021)', d: '', r: 'Rare' },
    { t: 'Tom Holland', d: 'acteur américain', r: 'Rare' },
    { t: 'Truc', d: 'objet', r: 'Commune' },
  ];
  const anciennes = [['Commune'], ['Américain'], ['Américain'], ['Bidule']];
  const lecture = { cartes: {}, membres: { Commune: [], 'Américain': [], Bidule: [] } };
  const plans = new Map();
  cartes.forEach((c, i) => {
    const k = w.cle(c);
    lecture.cartes[k] = c;
    for (const a of anciennes[i]) lecture.membres[a].push(k);
    plans.set(k, w.planCarte(c, anciennes[i]));
  });
  const rapport = Object.fromEntries(w.rapportSuppression(lecture, plans).map((l) => [l.nom, l]));
  assert.ok(plans.get(w.cle(cartes[0])).tags.includes('Géographie'), 'la migration donne le domaine de #Commune');
  assert.equal(rapport.Commune.ok, true, 'Commune : ' + JSON.stringify(rapport.Commune.bloque.map((b) => b.pourquoi)));
  assert.equal(rapport['Américain'].ok, false);
  assert.deepEqual(Array.from(rapport['Américain'].bloque, (b) => [b.c.t, b.pourquoi]), [['Cherry (film, 2021)', 'mot absent de la description']]);
  // étiquette non prévue (pas de domaine connu) : son nom doit se trouver sur la carte
  assert.equal(rapport.Bidule.ok, false);
  site.fermer();
});

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
