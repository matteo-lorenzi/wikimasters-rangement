// Écrit le Panneau tel qu'il s'affiche après « Ranger » (faux site, cartes sans description lues sur Wikipédia)
// dans des pages HTML autonomes, à ouvrir dans un vrai navigateur : jsdom n'applique pas le CSS du Panneau,
// donc débordements, coupures et lisibilité ne se voient que là. Détails dans docs/tests.md, « Voir le rendu ».
//
//   node scripts/capture.js [dossier]     (défaut : le dossier temporaire du système)
//   écrit paquets.html (page Paquets), paquets-confirmation.html et paquets-arret.html (ouverture d'un paquet), rangement.html, rangement-ouvert.html (Sections dépliées) et diagnostic.html
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { creerSite } = require('../test/faux-site');

const dossier = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'wmr-capture'));
fs.mkdirSync(dossier, { recursive: true });

const nom = (i) => { let x = (i + 1) * 2654435761 % 4294967296, s = ''; for (let k = 0; k < 8; k++) { s += 'bcdfghjklmnprstvz'[x % 17] + 'aeiou'[Math.floor(x / 32) % 5]; x = Math.floor(x / 7) + k * 977; } return s[0].toUpperCase() + s.slice(1); };
const titres = Array.from({ length: 40 }, (_, i) => nom(i));
const phrase = (t, i) => i % 3 === 0 ? `${t} est une espèce de plantes herbacées de la famille des Zingiberaceae, originaire du Sud de l'Île de Taïwan.`
  : i % 3 === 1 ? `${t} est un zoblix, genre éteint de bryozoaires appartenant à la famille des Theonoidae.` : `${t} est une commune du nord-est de la Slovénie située dans la région de la Basse-Styrie.`;
const cartes = titres.map((t, i) => ({ t, d: '', obtenu: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString() }));
const articles = Object.fromEntries(titres.map((t, i) => [t, phrase(t, i)]));

const page = (root, ouvert, onglet) => {
  const pan = root.querySelector('.pan'); pan.hidden = false; pan.style.display = '';
  if (onglet === 'diagnostic') {
    for (const t of root.querySelectorAll('[role=tab]')) t.setAttribute('aria-selected', String(t.dataset.onglet === 'diagnostic'));
    for (const c of root.querySelectorAll('[role=tabpanel]')) { const on = c.dataset.cadre === 'diagnostic'; c.hidden = !on; c.style.display = on ? '' : 'none'; }
  }
  if (ouvert) root.querySelectorAll('.out details').forEach((d) => d.setAttribute('open', ''));
  return `<!doctype html><meta charset="utf-8"><title>Panneau</title><body style="margin:0;height:100vh;background:#2b2f36">${root.innerHTML}`;
};

(async () => {
  const site = await creerSite({ cartes, wikipedia: { articles } });
  site.wmr.monterUI();
  const racine = () => site.document.getElementById('wmr-host').shadowRoot;
  racine().querySelector('[data-a=ranger]').click();
  const fin = Date.now() + 60000;
  while (Date.now() < fin && !racine().querySelector('[data-go]')) await new Promise((r) => setTimeout(r, 20));
  if (!racine().querySelector('[data-go]')) { console.error('Aperçu non obtenu : ' + racine().querySelector('.st').textContent); process.exit(1); }
  fs.writeFileSync(path.join(dossier, 'rangement.html'), page(racine(), false, 'rangement'));
  fs.writeFileSync(path.join(dossier, 'rangement-ouvert.html'), page(racine(), true, 'rangement'));
  fs.writeFileSync(path.join(dossier, 'diagnostic.html'), page(racine(), false, 'diagnostic'));
  site.fermer();
  // Page Paquets : l'onglet seul, avec quelques centres d'intérêt et une case changée
  const pq = await creerSite({ page: 'pulls' });
  pq.wmr.monterUI();
  const rp = pq.document.getElementById('wmr-host').shadowRoot;
  for (const m of ['Poitiers', 'Bruce Lee', 'Saint-Étienne']) { rp.querySelector('[data-paquets=champ]').value = m; rp.querySelector('[data-paquets=ajouter]').click(); }
  rp.querySelector('[data-paquets=champ]').value = 'de'; rp.querySelector('[data-paquets=ajouter]').click();
  rp.querySelectorAll('[data-rarete]').forEach((c) => c.checked && c.setAttribute('checked', '')); // le HTML écrit ne garde que les attributs
  fs.writeFileSync(path.join(dossier, 'paquets.html'), page(rp, false, 'paquets'));
  rp.querySelector('[data-paquets=lancer]').click();
  fs.writeFileSync(path.join(dossier, 'paquets-confirmation.html'), page(rp, false, 'paquets'));
  rp.querySelector('[data-paquets=confirmer]').click();
  const finArret = Date.now() + 10000;
  while (Date.now() < finArret && rp.querySelector('.arret-paquet').hidden) await new Promise((r) => setTimeout(r, 20));
  fs.writeFileSync(path.join(dossier, 'paquets-arret.html'), page(rp, false, 'paquets'));
  pq.fermer();
  console.log('Pages écrites dans ' + dossier);
})();
