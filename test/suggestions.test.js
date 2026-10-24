// Mode Suggestions : les mots que les règles ne connaissent pas encore, repérés sur les cartes restées sans domaine,
// avec le domaine que portent les cartes déjà étiquetées. Le script propose ; la personne et Claude décident (HANDOFF).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerSite } = require('./faux-site');

const attendreQue = async (cond, ms = 15000) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) { if (cond()) return true; await new Promise((r) => setTimeout(r, 10)); }
  return cond();
};
const serie = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const nationalites = ['mexicaine', 'colombienne', 'brésilienne', 'vénézuélienne', 'argentine', 'chilienne'];

// Cartes inventées, mais avec des descriptions du genre de celles de la collection.
const collection = () => [
  // sans étiquette, sans règle : « zarzuela » absent des règles
  ...serie(6, (i) => ({ t: `Novela ${i}`, d: `zarzuela ${nationalites[i]}` })),
  // déjà étiquetées à la main : toutes en Cinéma & TV
  ...serie(6, (i) => ({ t: `Novela rangée ${i}`, d: `zarzuela ${nationalites[i]}`, tags: ['Cinéma & TV'] })),
  // mot ambigu seul (joueur) : à traiter ; 5 sans étiquette, 2 déjà marquées « !À traiter »
  ...serie(3, (i) => ({ t: `Bouliste ${i}`, d: 'joueur de pétanque' })),
  ...serie(2, (i) => ({ t: `Bouliste femme ${i}`, d: 'joueuse de pétanque' })),
  ...serie(2, (i) => ({ t: `Bouliste suivi ${i}`, d: 'joueur de pétanque', tags: ['!À traiter'] })),
  // étiquetées sans majorité nette : 3 Sport, 2 Fiction & Jeux (60 %)
  ...serie(3, (i) => ({ t: `Pétanque sport ${i}`, d: 'tournoi de pétanque', tags: ['Sport'] })),
  ...serie(2, (i) => ({ t: `Pétanque jeu ${i}`, d: 'pétanque de salon', tags: ['Fiction & Jeux'] })),
  // un gros groupe que rien ne range : nouvelle étiquette ?
  ...serie(30, (i) => ({ t: `Manhwa ${i}`, d: 'manhwa coréen' })),
  // seuil de 3 cartes : « webtoon » proposé, « fanzine » non
  ...serie(3, (i) => ({ t: `Webtoon ${i}`, d: 'webtoon' })),
  ...serie(2, (i) => ({ t: `Fanzine ${i}`, d: 'fanzine' })),
  // jamais proposés : un pays ; « politique », refusé par la personne (2026-10-13)
  { t: 'Endroit A', d: "défilé situé dans l'Ain, France" },
  { t: 'Endroit B', d: 'fonction en France' },
  { t: 'Endroit C', d: 'titre honorifique en France' },
  { t: 'Politique au Danemark' }, { t: 'Politique à Malte' }, { t: 'Politique au Groenland' },
  // ignorées volontairement, et rangeables par les règles actuelles
  ...serie(3, (i) => ({ t: `Dupont ${i}`, d: "page d'homonymie de Wikimédia" })),
  ...serie(2, (i) => ({ t: `Footeux ${i}`, d: 'footballeur français' })),
].map((c, i) => ({ r: 'Commune', tags: [], obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c }));

test('suggestions : compteur des cartes sans domaine, mots inconnus des règles, domaine proposé par les cartes étiquetées', async () => {
  const site = await creerSite({ cartes: [] });
  const s = site.wmr.suggestions(collection());
  assert.deepEqual({ ...s.compteur }, { sansEtiquette: 57, rangeables: 2, inconnues: 47, aTraiter: 5, ignorees: 3, marqueesATraiter: 2 });
  const vus = Object.fromEntries(s.candidats.map((c) => [c.mot, c]));
  assert.deepEqual(Array.from(s.candidats, (c) => c.mot), ['manhwa', 'pétanque', 'zarzuela', 'webtoon'], 'triés par nombre de cartes ; ni mots vides, ni mots connus, ni pays, ni mots refusés, ni expressions déjà couvertes par un mot');
  assert.deepEqual([vus.manhwa.n, vus['pétanque'].n, vus.zarzuela.n], [30, 7, 6], '« !À traiter » compte avec les cartes sans étiquette');
  assert.equal(vus.zarzuela.dom, 'Cinéma & TV');
  assert.equal(vus.zarzuela.part, 1);
  assert.equal(vus['pétanque'].dom, null, '60 % : pas de majorité nette');
  assert.equal(vus['pétanque'].tete, 'Sport');
  assert.equal(vus.manhwa.dom, null);
  assert.equal(vus.manhwa.nouvelle, true, '30 cartes sans domaine connu');
  assert.equal(vus.zarzuela.nouvelle, false);
  assert.equal(vus['pétanque'].nouvelle, false);
  assert.equal(vus.zarzuela.exemples.length, 3);
  assert.ok(vus.zarzuela.exemples.every((c) => !c.tags.length), 'exemples pris parmi les cartes à ranger');
  site.fermer();
});

// Le panneau, dans son shadow root.
const panneau = (site) => {
  site.wmr.monterUI();
  const root = () => site.document.getElementById('wmr-host').shadowRoot;
  return {
    root, statut: () => root().querySelector('.st').textContent,
    texte: () => root().querySelector('.out').textContent,
    bouton: (re) => [...root().querySelectorAll('.out button')].find((b) => re.test(b.textContent)),
  };
};

test('Suggestions : lecture de la collection par l\'API, compteur et texte à copier pour Claude', async () => {
  const site = await creerSite({ cartes: collection() });
  const p = panneau(site);
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.root().querySelector('.out textarea')), 'statut : ' + p.statut());
  assert.match(p.texte(), /57 sans étiquette/);
  assert.match(p.texte(), /47 sans règle/);
  const copie = p.root().querySelector('.out textarea').value;
  assert.match(copie, /^zarzuela — 6 cartes — Cinéma & TV \(100 %\) — ex\. : Novela \d — zarzuela \S+ ; /m);
  assert.match(copie, /^manhwa — 30 cartes — nouvelle étiquette \? — ex\./m);
  assert.match(copie, /^pétanque — 7 cartes — \? \(Sport 60 %\) — ex\./m);
  // toutes les cartes à revoir, pour que Claude propose des règles aussi aux cartes isolées
  const cartes = p.root().querySelector('.out textarea[data-cartes]').value;
  assert.match(cartes, /^Cartes sans règle \(47\)/m);
  assert.match(cartes, /^Fanzine 0 — fanzine$/m);
  assert.match(cartes, /^Politique au Danemark$/m, 'carte sans description : le titre seul');
  assert.match(cartes, /^Cartes avec un mot ambigu seul \(7\)/m);
  assert.match(cartes, /^Bouliste suivi 0 — joueur de pétanque$/m);
  assert.doesNotMatch(cartes, /Dupont|Footeux|Novela rangée/, 'ni ignorées, ni rangeables, ni déjà étiquetées');
  assert.ok(p.bouton(/Copier les cartes sans règle/));
  assert.ok(!site.actions.some((a) => ['filtre', 'page', 'recherche', 'pose', 'clic'].includes(a.type)), 'lecture seule, par l\'API');
  assert.ok(site.wmr.store.get('lecture2', null), 'lecture gardée pour la prochaine fois (et pour Migration)');
  site.fermer();
});

test('Suggestions : après un Ranger, la lecture gardée est périmée et la relire est recommandé', async () => {
  const site = await creerSite({ cartes: collection(), etiquettes: ['Sport', 'Cinéma & TV', 'Fiction & Jeux', '!À traiter'] });
  const p = panneau(site);
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.root().querySelector('.out textarea')), 'statut : ' + p.statut());
  // Ranger pose Sport sur les 2 footballeurs et « !À traiter » sur les 5 boulistes
  p.root().querySelector('[data-a=ranger]').click();
  assert.ok(await attendreQue(() => p.root().querySelector('[data-go]')), 'aperçu : ' + p.statut());
  p.root().querySelector('[data-go]').click();
  assert.ok(await attendreQue(() => /✅|⚠️/.test(p.statut()), 60000), 'bilan : ' + p.statut());
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.bouton(/Relire \(recommandé\)/)), 'choix proposé : ' + p.texte());
  assert.match(p.texte(), /étiquettes ont été posées depuis/);
  // réutiliser : l'ancien compteur
  p.bouton(/Réutiliser/).click();
  assert.ok(await attendreQue(() => /57 sans étiquette/.test(p.texte())), p.texte());
  // relire : le nouveau
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.bouton(/Relire/)));
  p.bouton(/Relire/).click();
  assert.ok(await attendreQue(() => /50 sans étiquette/.test(p.texte())), p.texte());
  assert.match(p.texte(), /7 portent « !À traiter »/);
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.bouton(/Réutiliser/)));
  assert.ok(!p.bouton(/recommandé/), 'lecture à jour : rien de recommandé');
  site.fermer();
});

// Mots manquants de la personne (Ranger v1.9.10, 2026-10-23) : mots courants jamais proposés, exemplaires comptés une fois
const carteSugg = (c, i) => ({ r: 'Commune', tags: [], d: '', obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c });
test('suggestions : les mots courants (nom, but, fonction, jour, vers…) ne sont jamais proposés', async () => {
  const site = await creerSite({ cartes: [] });
  const cartes = [
    { t: 'Reparti i Operacioneve Speciale', d: 'unité des forces spéciales albanaise fondée en février 77 sous le nom de code 77' },
    { t: 'Čech', d: 'figure mythique qui a donné son nom aux Tchèques' },
    { t: 'Mary Butters', d: 'sorcière irlandaise connue sous nom de la sorcière de Carnmoney' },
    { t: 'Corporation', d: 'réunion durable de personnes poursuivant un but commun' },
    { t: 'Bureau de normalisation du Québec', d: 'organisme public québécois fondé en 1961 qui a pour but d\'élaborer des normes' },
    { t: 'Taille cible corrigée', d: 'taille théorique en fonction de la taille de son père' },
    { t: 'Pré-majorité', d: 'statut intermédiaire qui a pour fonction de s\'adapter aux adolescents' },
    { t: 'Fonction de Mayer-f', d: 'fonction qui apparait souvent dans les développements en séries' },
    { t: 'Programme double', d: 'deux matchs disputés le même jour par les mêmes équipes' },
    { t: 'Avant-scène', d: 'partie d\'une scène qui s\'étend au-delà du cadre de scène vers l\'auditorium' },
    { t: 'Paraíso de San José' }, { t: 'BRP Enrique Jurado', d: 'patrouilleur de classe Jose Andrada' }, { t: 'Hurricane Electric', d: 'fournisseur à San Jose' },
    { t: 'Cité Leroy (Paris)', d: 'cité de Paris, en France' }, { t: 'Jour de colère (manifestation)', d: 'manifestation en 2014 à Paris' }, { t: 'Rue inventée', d: 'rue de Paris' },
  ].map(carteSugg);
  const mots = Array.from(site.wmr.suggestions(cartes).candidats, (c) => c.mot);
  for (const m of ['nom', 'but', 'fonction', 'jour', 'vers', 'sous', 'josé', 'paris']) assert.ok(!mots.includes(m), `« ${m} » proposé : ${mots.join(', ')}`);
  site.fermer();
});

test('suggestions : « opération » et « technique » jamais proposés, refusés le 2026-10-23 (plusieurs sens)', async () => {
  const site = await creerSite({ cartes: [] });
  const cartes = [
    { t: 'Opération Kreml' }, { t: 'Intervention cubaine en Angola', d: 'Operation carlota' },
    { t: 'Uvulo-palato-pharyngoplastie', d: 'opération sous anesthésie générale' },
    { t: 'Expérience des Petits Danois', d: 'opération administrative danoise de 1951' },
    { t: 'Culture en terrasses', d: 'technique agricole consistant à cultiver sur des terrains aménagés' },
    { t: 'Zoom numérique', d: 'technique photographique' },
    { t: 'Extraction électromembranaire', d: 'technique d\'extraction liquide-liquide miniaturisée' },
    { t: 'Sertissage', d: 'technique de joaillerie' },
  ].map(carteSugg);
  const mots = Array.from(site.wmr.suggestions(cartes).candidats, (c) => c.mot);
  for (const m of ['opération', 'technique']) assert.ok(!mots.includes(m), `« ${m} » proposé : ${mots.join(', ')}`);
  site.fermer();
});

test('suggestions : un exemplaire en double ne compte qu\'une fois (3 cartes distinctes au moins)', async () => {
  const site = await creerSite({ cartes: [] });
  const deux = [
    { t: 'Le Pâtre', d: 'fantaisie burlesque zorglub' }, { t: 'Le Pâtre', d: 'fantaisie burlesque zorglub' }, // le même exemplaire, deux fois
    { t: 'Autre pièce', d: 'fantaisie burlesque zorglub' },
  ].map(carteSugg);
  assert.ok(!Array.from(site.wmr.suggestions(deux).candidats, (c) => c.mot).includes('zorglub'), '2 cartes distinctes : pas proposé');
  const trois = [...deux, { t: 'Troisième pièce', d: 'fantaisie burlesque zorglub' }].map(carteSugg);
  assert.ok(Array.from(site.wmr.suggestions(trois).candidats, (c) => c.mot).includes('zorglub'), '3 cartes distinctes : proposé');
  site.fermer();
});

test('suggestions : « ben » (particule d\'un nom arabe) jamais proposé, refusé le 2026-10-23', async () => {
  const site = await creerSite({ cartes: [] });
  const cartes = [{ t: 'Fulful ben Sa\'id' }, { t: 'Mohamed Ben Kanoun' }, { t: 'Nasir ad-Din al-Qasri Muhammad ben Ahmad' }]
    .map((c, i) => ({ r: 'Commune', tags: [], d: '', obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c }));
  const mots = Array.from(site.wmr.suggestions(cartes).candidats, (c) => c.mot);
  assert.ok(!mots.includes('ben'), `« ben » proposé : ${mots.join(', ')}`);
  site.fermer();
});

test('suggestions : jamais les mots refusés le 2026-10-14 (plusieurs sens, prénom, dates)', async () => {
  const site = await creerSite({ cartes: [] });
  // descriptions et titres de cartes réelles de la personne (lecture API du 2026-10-14)
  const cartes = [
    { t: 'Classe Turbine' }, { t: 'Classe Tromp' }, { t: 'CIE classe 501' },
    { t: 'Formation de Kaili' }, { t: 'Formation de classes' }, { t: 'Centre international de formation à distance' },
    { t: 'Plastic Head Distribution' }, { t: 'Distribution q-exponentielle' }, { t: 'Distribution de Bose' },
    { t: 'Thomas de La Marche' }, { t: 'Thomas McFarland' }, { t: 'Thomas Hale' },
    { t: '974', d: 'année' }, { t: '975', d: 'année' }, { t: '976', d: 'année' },
    { t: 'Septembre 2008 en France' }, { t: 'Septembre 2009 en France' }, { t: 'Septembre 2010 en France' },
    { t: '25 octobre 2014', d: 'samedi en octobre 2014' }, { t: '1er novembre 2014', d: 'samedi en novembre 2014' },
    { t: '8 novembre 2014', d: 'samedi en novembre 2014' },
  ].map((c, i) => ({ r: 'Commune', tags: [], d: '', obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c }));
  const mots = Array.from(site.wmr.suggestions(cartes).candidats, (c) => c.mot);
  for (const m of ['classe', 'formation', 'distribution', 'thomas', 'année', 'septembre', 'octobre', 'novembre', 'samedi']) {
    assert.ok(!mots.includes(m), `« ${m} » proposé : ${mots.join(', ')}`);
  }
  site.fermer();
});

test('suggestions : jamais les mots refusés le 2026-10-23 (prénoms, mots trop larges)', async () => {
  const site = await creerSite({ cartes: [] });
  // titres de cartes de la forme réelle du 5e tour, trois cartes par mot
  const cartes = [
    { t: 'Jacques Dupuis' }, { t: 'Jacques Martin' }, { t: 'Jacques Rey' },
    { t: 'Albert Camus' }, { t: 'Albert Lebrun' }, { t: 'Albert Roux' },
    { t: 'Alexandre Petit' }, { t: 'Alexandre Moreau' }, { t: 'Alexandre Noel' },
    { t: 'Hubert Falco' }, { t: 'Hubert Reeves' }, { t: 'Hubert Faure' },
    { t: 'John Smith' }, { t: 'John Dewey' }, { t: 'John Lewis' },
    { t: 'The Irish Press' }, { t: 'The Stranglers' }, { t: 'The Wailers' },
    { t: 'San Marcos' }, { t: 'San Rafael' }, { t: 'San Gabriel' },
    { t: 'Nord de Kerlan' }, { t: 'Nord de Brest' }, { t: 'Nord de Lille' },
    { t: 'XIe siècle av. Kyrion' }, { t: 'XIIe siècle Kyrion' }, { t: 'XIIIe siècle Kyrion' },
    { t: 'Action de Zerbon' }, { t: 'Action de Merlon' }, { t: 'Action de Tarvin' },
    { t: 'Ligne Orvane' }, { t: 'Ligne Dolmir' }, { t: 'Ligne Trebax' },
    { t: 'Georges Ier' }, { t: 'Louis Ier' }, { t: 'Pierre Ier' },
    { t: 'Campagne de Kolven' }, { t: 'Campagne de Rastan' }, { t: 'Campagne de Mirtel' },
  ].map((c, i) => ({ r: 'Commune', tags: [], d: '', obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c }));
  const mots = Array.from(site.wmr.suggestions(cartes).candidats, (c) => c.mot);
  for (const m of ['jacques', 'albert', 'alexandre', 'hubert', 'john', 'the', 'san', 'nord', 'siècle', 'action', 'ligne', 'ier', 'campagne']) {
    assert.ok(!mots.includes(m), `« ${m} » proposé : ${mots.join(', ')}`);
  }
  site.fermer();
});
