// Règle d'arrêt d'une carte tirée sur la page Paquets (ticket #15) : rareté cochée ou centre d'intérêt retrouvé.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chargerRegles } = require('./charger');

const R = chargerRegles();
const arret = (carte, reglages) => { const r = R.raisonArret(carte, reglages); return r && { ...r }; };
const GARD = { t: 'Aigaliers', d: 'commune française du département du Gard', rarete: 'C' };

test('une commune du Gard en rareté C s\'arrête sur le mot « Gard »', () => {
  assert.deepEqual(arret(GARD, { raretes: ['UR'], interets: ['Gard'] }), { type: 'mot', valeur: 'Gard', texte: 'mot « Gard »' });
});

test('la même carte sans le mot ne s\'arrête pas', () => {
  assert.equal(arret({ ...GARD, d: 'commune française du département de l\'Hérault' }, { raretes: ['UR'], interets: ['Gard'] }), null);
});

test('rareté cochée → motif rareté ; R décochée → pas d\'arrêt', () => {
  const carte = { t: 'Carte', d: 'sans rapport', rarete: 'R' };
  assert.deepEqual(arret(carte, { raretes: ['R', 'UR'], interets: [] }), { type: 'rarete', valeur: 'R', texte: 'rareté R' });
  assert.equal(arret(carte, { raretes: ['UR'], interets: [] }), null);
});

test('les deux motifs sont indépendants : le mot arrête une rareté décochée ; les deux présents → la rareté est dite', () => {
  assert.equal(arret(GARD, { raretes: [], interets: ['gard'] }).type, 'mot');
  assert.equal(arret({ ...GARD, rarete: 'UR' }, { raretes: ['UR'], interets: ['Gard'] }).type, 'rarete');
});

test('sans casse ni accents, dans le titre comme dans la description', () => {
  assert.equal(arret({ t: 'Nîmes', d: '', rarete: 'C' }, { raretes: [], interets: ['nimes'] }).valeur, 'nimes');
  assert.equal(arret({ t: 'Arènes', d: 'monument de NÎMES', rarete: 'C' }, { raretes: [], interets: ['Nîmes'] }).type, 'mot');
  assert.equal(arret({ t: 'X', d: '', rarete: 'C' }, { raretes: [], interets: ['NIMES'] }), null);
});

test('un mot vide ou d\'espaces est ignoré et n\'arrête jamais tout ; le vrai mot qui suit déclenche', () => {
  assert.equal(arret(GARD, { raretes: [], interets: ['', '   ', null] }), null);
  assert.equal(arret(GARD, { raretes: [], interets: ['', 'Gard'] }).valeur, 'Gard');
});

test('réglages ou carte incomplets ne plantent pas', () => {
  assert.equal(arret({ t: 'A' }, {}), null);
  assert.equal(arret({}, { raretes: ['C'], interets: ['x'] }), null);
});
