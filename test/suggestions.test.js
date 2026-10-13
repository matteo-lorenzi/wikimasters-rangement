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
  // sans étiquette, sans règle : « telenovela » absent des règles (cas de « Qué bonito amor »)
  ...serie(6, (i) => ({ t: `Novela ${i}`, d: `telenovela ${nationalites[i]}` })),
  // déjà étiquetées à la main : toutes en Cinéma & TV
  ...serie(6, (i) => ({ t: `Novela rangée ${i}`, d: `telenovela ${nationalites[i]}`, tags: ['Cinéma & TV'] })),
  // mot ambigu seul (joueur) : à traiter ; 5 sans étiquette, 2 déjà marquées « !À traiter »
  ...serie(3, (i) => ({ t: `Bouliste ${i}`, d: 'joueur de pétanque' })),
  ...serie(2, (i) => ({ t: `Bouliste femme ${i}`, d: 'joueuse de pétanque' })),
  ...serie(2, (i) => ({ t: `Bouliste marqué ${i}`, d: 'joueur de pétanque', tags: ['!À traiter'] })),
  // étiquetées sans majorité nette : 3 Sport, 2 Fiction & Jeux (60 %)
  ...serie(3, (i) => ({ t: `Pétanque sport ${i}`, d: 'tournoi de pétanque', tags: ['Sport'] })),
  ...serie(2, (i) => ({ t: `Pétanque jeu ${i}`, d: 'pétanque de salon', tags: ['Fiction & Jeux'] })),
  // un gros groupe que rien ne range : nouvelle étiquette ?
  ...serie(30, (i) => ({ t: `Manhwa ${i}`, d: 'manhwa coréen' })),
  // sous le seuil de 5 cartes
  ...serie(4, (i) => ({ t: `Webtoon ${i}`, d: 'webtoon' })),
  // ignorées volontairement, et rangeables par les règles actuelles
  ...serie(3, (i) => ({ t: `Dupont ${i}`, d: "page d'homonymie de Wikimédia" })),
  ...serie(2, (i) => ({ t: `Footeux ${i}`, d: 'footballeur français' })),
].map((c, i) => ({ r: 'Commune', tags: [], obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), ...c }));

test('suggestions : compteur des cartes sans domaine, mots inconnus des règles, domaine proposé par les cartes étiquetées', async () => {
  const site = await creerSite({ cartes: [] });
  const s = site.wmr.suggestions(collection());
  assert.deepEqual({ ...s.compteur }, { sansEtiquette: 50, rangeables: 2, inconnues: 40, aTraiter: 5, ignorees: 3, marqueesATraiter: 2 });
  const vus = Object.fromEntries(s.candidats.map((c) => [c.mot, c]));
  assert.deepEqual(Array.from(s.candidats, (c) => c.mot), ['manhwa', 'pétanque', 'telenovela'], 'triés par nombre de cartes ; ni mots vides, ni mots connus, ni expressions déjà couvertes par un mot');
  assert.deepEqual([vus.manhwa.n, vus['pétanque'].n, vus.telenovela.n], [30, 7, 6], '« !À traiter » compte avec les cartes sans étiquette');
  assert.equal(vus.telenovela.dom, 'Cinéma & TV');
  assert.equal(vus.telenovela.part, 1);
  assert.equal(vus['pétanque'].dom, null, '60 % : pas de majorité nette');
  assert.equal(vus['pétanque'].tete, 'Sport');
  assert.equal(vus.manhwa.dom, null);
  assert.equal(vus.manhwa.nouvelle, true, '30 cartes sans domaine connu');
  assert.equal(vus.telenovela.nouvelle, false);
  assert.equal(vus['pétanque'].nouvelle, false);
  assert.equal(vus.telenovela.exemples.length, 3);
  assert.ok(vus.telenovela.exemples.every((c) => !c.tags.length), 'exemples pris parmi les cartes à ranger');
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
  assert.match(p.texte(), /50 sans étiquette/);
  assert.match(p.texte(), /40 sans règle/);
  const copie = p.root().querySelector('.out textarea').value;
  assert.match(copie, /^telenovela — 6 cartes — Cinéma & TV \(100 %\) — ex\. : Novela \d — telenovela \S+ ; /m);
  assert.match(copie, /^manhwa — 30 cartes — nouvelle étiquette \? — ex\./m);
  assert.match(copie, /^pétanque — 7 cartes — \? \(Sport 60 %\) — ex\./m);
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
  assert.ok(await attendreQue(() => /50 sans étiquette/.test(p.texte())), p.texte());
  // relire : le nouveau
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.bouton(/Relire/)));
  p.bouton(/Relire/).click();
  assert.ok(await attendreQue(() => /43 sans étiquette/.test(p.texte())), p.texte());
  assert.match(p.texte(), /7 portent « !À traiter »/);
  p.root().querySelector('[data-a=suggestions]').click();
  assert.ok(await attendreQue(() => p.bouton(/Réutiliser/)));
  assert.ok(!p.bouton(/recommandé/), 'lecture à jour : rien de recommandé');
  site.fermer();
});
