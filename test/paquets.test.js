// L'onglet « Paquets » du panneau, sur le faux site de la page /pulls (ticket #14).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerSite } = require('./faux-site');

// les tableaux du faux site viennent d'un autre « monde » (jsdom) : recopiés avant deepEqual
const plat = (x) => JSON.parse(JSON.stringify(x));

const ouvrir = async (opts = {}) => {
  const site = await creerSite({ page: 'pulls', ...opts });
  site.wmr.monterUI();
  const racine = () => site.document.getElementById('wmr-host').shadowRoot;
  const p = {
    site, racine,
    onglets: () => [...racine().querySelectorAll('[role=tab]')].map((t) => t.textContent.trim()),
    mots: () => [...racine().querySelectorAll('.mot')].map((m) => m.dataset.mot),
    message: () => racine().querySelector('.msg-paquets').textContent,
    ajouter: (texte) => {
      const champ = racine().querySelector('[data-paquets=champ]');
      champ.value = texte;
      racine().querySelector('[data-paquets=ajouter]').click();
    },
    retirer: (mot) => racine().querySelector(`.mot[data-mot="${mot}"] button`).click(),
    case: (r) => racine().querySelector(`[data-rarete="${r}"]`),
    cochees: () => [...racine().querySelectorAll('[data-rarete]')].filter((c) => c.checked).map((c) => c.dataset.rarete),
    cocher: (r, oui) => { const c = p.case(r); c.checked = oui; c.dispatchEvent(new site.window.Event('change', { bubbles: true })); },
  };
  return p;
};

test('sur /pulls, le panneau n\'a que l\'onglet Paquets, avec R, UR et L cochées', async () => {
  const p = await ouvrir();
  assert.deepEqual(p.onglets(), ['Paquets']);
  assert.equal(p.racine().querySelector('[data-a=ranger]'), null, 'aucun bouton de Rangement');
  assert.deepEqual(p.cochees(), ['R', 'UR', 'L']);
  assert.deepEqual([...p.racine().querySelectorAll('[data-rarete]')].map((c) => c.dataset.rarete), ['C', 'PC', 'R', 'SR', 'UR', 'L']);
  assert.deepEqual(p.site.actions, [], 'rien n\'est cliqué sur la page');
  p.site.fermer();
});

test('ajouter et retirer un centre d\'intérêt', async () => {
  const p = await ouvrir();
  p.ajouter('  Poitiers ');
  p.ajouter('Bruce Lee');
  assert.deepEqual(p.mots(), ['Poitiers', 'Bruce Lee']);
  p.retirer('Poitiers');
  assert.deepEqual(p.mots(), ['Bruce Lee']);
  p.site.fermer();
});

test('doublons (casse et accents) et mots vides refusés, en français', async () => {
  const p = await ouvrir();
  p.ajouter('Étienne');
  p.ajouter('etienne');
  assert.match(p.message(), /déjà/);
  p.ajouter('   ');
  assert.match(p.message(), /Tape un mot/);
  p.ajouter('de');
  assert.match(p.message(), /trop courant/);
  p.ajouter('a');
  assert.match(p.message(), /trop courant|trop court/);
  assert.deepEqual(p.mots(), ['Étienne']);
  p.site.fermer();
});

test('la liste et les cases survivent à un rechargement', async () => {
  const p = await ouvrir();
  p.ajouter('Poitiers');
  p.cocher('C', true);
  p.cocher('L', false);
  await p.site.recharger();
  const q = { ...p, racine: () => p.site.document.getElementById('wmr-host').shadowRoot };
  assert.deepEqual([...q.racine().querySelectorAll('.mot')].map((m) => m.dataset.mot), ['Poitiers']);
  assert.deepEqual([...q.racine().querySelectorAll('[data-rarete]')].filter((c) => c.checked).map((c) => c.dataset.rarete), ['C', 'R', 'UR']);
  assert.deepEqual(plat(p.site.wmr.reglagesPaquets()), { interets: ['Poitiers'], raretes: ['C', 'R', 'UR'] });
  p.site.fermer();
});

test('un navigateur qui refuse le stockage : message clair, liste gardée le temps de la page', async () => {
  const p = await ouvrir();
  p.site.window.Storage.prototype.setItem = () => { throw new Error('QuotaExceededError'); };
  p.ajouter('Poitiers');
  assert.deepEqual(p.mots(), ['Poitiers']);
  assert.match(p.message(), /ne peut pas enregistrer/);
  assert.deepEqual(plat(p.site.wmr.reglagesPaquets().interets), ['Poitiers']);
  p.site.fermer();
});

test('réglages par défaut relus sans toucher à rien', async () => {
  const p = await ouvrir();
  assert.deepEqual(plat(p.site.wmr.reglagesPaquets()), { interets: [], raretes: ['R', 'UR', 'L'] });
  p.site.fermer();
});

test('sur /collection, pas d\'onglet Paquets', async () => {
  const site = await creerSite({ cartes: [] });
  site.wmr.monterUI();
  const noms = [...site.document.getElementById('wmr-host').shadowRoot.querySelectorAll('[role=tab]')].map((t) => t.textContent.trim());
  assert.deepEqual(noms, ['Rangement', 'Diagnostic']);
  site.fermer();
});
