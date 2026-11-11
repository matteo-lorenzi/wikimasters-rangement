// Lisibilité du Panneau : tailles, interligne, hauteur des boutons, contraste WCAG des couleurs déclarées dans le CSS.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { SRC } = require('./charger');

const CSS = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8').match(/const CSS = `([\s\S]*?)`;/)[1];

// Déclarations d'une règle dont le sélecteur est exactement `sel` (plusieurs règles du même sélecteur fusionnées).
const regle = (sel) => {
  const d = {};
  for (const m of CSS.matchAll(/(?<=^|\})\s*([^{}]+)\{([^}]*)\}/g)) {
    if (m[1].trim() !== sel) continue;
    for (const p of m[2].split(';')) { const i = p.indexOf(':'); if (i > 0) d[p.slice(0, i).trim()] = p.slice(i + 1).trim(); }
  }
  return d;
};
const hex = (sel, prop) => {
  const v = regle(sel)[prop];
  assert.match(v || '', /^#[0-9a-f]{6}$/i, `${sel} { ${prop} } absent ou non hexadécimal : ${v}`);
  return v;
};
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const rapport = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('le calcul WCAG est juste (noir/blanc = 21, même couleur = 1)', () => {
  assert.equal(Math.round(rapport('#000000', '#ffffff')), 21);
  assert.equal(rapport('#336699', '#336699'), 1);
});

const FOND = hex('.pan', 'background');
// [sélecteur du texte, propriété, fond sur lequel il est posé]
const PAIRES = [
  ['.pan', 'color', FOND],
  ['.x', 'color', FOND],
  ['.st', 'color', FOND],
  ['.hint', 'color', FOND],
  ['.cpt', 'color', FOND],
  ['.pied', 'color', FOND],
  ['td.n', 'color', FOND],
  ['.li', 'color', FOND],
  ['summary', 'color', FOND],
  ['h4', 'color', FOND],
  ['.sec h4', 'color', FOND],
  ['.opt', 'color', FOND],
  ['.msg-paquets', 'color', FOND],
  ['.mot', 'color', hex('.mot', 'background')],
  ['.mot button', 'color', hex('.mot', 'background')],
  ['input[type=text]', 'color', hex('input[type=text]', 'background')],
  ['.ok', 'color', FOND],
  ['.ko', 'color', FOND],
  ['[role=tab]', 'color', FOND],
  ['[role=tab][aria-selected=true]', 'color', FOND],
  ['.log', 'color', hex('.log', 'background')],
  ['textarea', 'color', hex('textarea', 'background')],
  ['button.b', 'color', hex('button.b', 'background')],
  ['button.b.p', 'color', hex('button.b.p', 'background')],
  ['button.b.d', 'color', hex('button.b', 'background')],
  ['.fab', 'color', hex('.fab', 'background')],
  ['.pastille', 'color', hex('.pastille', 'background')],
  [':focus-visible', 'outline', FOND],
];

for (const [sel, prop, fond] of PAIRES) {
  test(`contraste ≥ 4,5:1 : ${sel} sur ${fond}`, () => {
    const v = regle(sel)[prop];
    const couleur = (v && v.match(/#[0-9a-f]{6}/i) || [])[0];
    assert.ok(couleur, `${sel} { ${prop} } sans couleur hexadécimale : ${v}`);
    const r = rapport(couleur, fond);
    assert.ok(r >= 4.5, `${sel} : ${couleur} sur ${fond} = ${r.toFixed(2)}:1`);
  });
}

test('tailles : texte 14 px, aides et listes 13 px, interligne 1,45', () => {
  const px = (sel) => parseFloat(regle(sel)['font-size']);
  assert.equal(px('.pan'), 14);
  for (const s of ['.hint', '.li', '.opt', '.pied', 'button.b']) assert.ok(px(s) >= 13, `${s} : ${px(s)}px`);
  assert.equal(regle('.pan')['line-height'], '1.45');
});

test('boutons : au moins 32 px de haut', () => {
  assert.ok(parseFloat(regle('button.b')['min-height']) >= 32);
  assert.ok(parseFloat(regle('[role=tab]')['min-height']) >= 32);
});
