// ═══════════════════════════════════════════════════════════════════
//  ANCIENNES ÉTIQUETTES — utilisé par le mode Migration
//  d : domaines à donner aux cartes qui portent cette étiquette
//  r : mots que la recherche doit trouver pour qu'on puisse la supprimer
//  remplacee : l'étiquette est copiée telle quelle sous un nouveau nom
// ═══════════════════════════════════════════════════════════════════

const ANCIENNES = {
  'Acteur': { d: ['Cinéma & TV'], r: ['acteur', 'actrice', 'comédien'] },
  'Allemand': { d: [], r: ['allemand'] },
  'Alpiniste': { d: ['Sport'], r: ['alpiniste'] },
  'Américain': { d: [], r: ['américain'] },
  'Anglais': { d: [], r: ['anglais'] },
  'Artiste': { d: ['Arts'], r: ['artiste'] },
  'Astéroïde': { d: ['Espace'], r: ['astéroïde'] },
  'Australie': { d: [], r: ['australie', 'australien'] },
  'Auteur': { d: ['Littérature'], r: ['auteur', 'autrice'] },
  'Aviatrice': { d: ['Histoire'], r: ['aviatrice', 'aviateur'] },
  'Avocat': { d: ['Politique & Droit'], r: ['avocat'] },
  'BaseBall': { d: ['Sport'], r: ['baseball'] },
  'Basket Ball': { d: ['Sport'], r: ['basket'] },
  'Belgique': { d: [], r: ['belge', 'belgique'] },
  'Boxeur': { d: ['Sport'], r: ['boxe'] },
  'Brésil': { d: [], r: ['brésil'] },
  'Canadien': { d: [], r: ['canad'] },
  'Chanteur': { d: ['Musique'], r: ['chanteur', 'chanteuse'] },
  'Chartreux': { d: ['Nature'], r: ['chartreux'] },
  'Château': { d: ['Patrimoine'], r: ['château'] },
  'Chinois': { d: [], r: ['chinois', 'chine'] },
  'Chorégraphe': { d: ['Arts'], r: ['chorégraphe'] },
  'Cinéaste': { d: ['Cinéma & TV'], r: ['cinéaste', 'réalisateur', 'réalisatrice'] },
  'Comédien': { d: ['Cinéma & TV'], r: ['comédien'] },
  'Commune': { d: ['Géographie'], r: ['commune'] },
  'Compositeur': { d: ['Musique'], r: ['compositeur', 'compositrice'] },
  'Constellation': { d: ['Espace'], r: ['constellation'] },
  'Corée du Sud': { d: [], r: ['sud-coréen', 'corée du sud'] },
  'Corse': { d: [], r: ['corse'] },
  'Cycliste': { d: ['Sport'], r: ['cycliste', 'cyclisme'] },
  'Danse': { d: ['Arts'], r: ['danse', 'danseur', 'danseuse'] },
  'Dinosaure': { d: ['Nature'], r: ['dinosaure'] },
  'Doublon': { remplacee: '!Doublon' },
  'Drapeau': { d: ['Géographie'], r: ['drapeau'] },
  'Ecrivain': { d: ['Littérature'], r: ['écrivain'] },
  'Editeur': { d: ['Littérature'], r: ['éditeur', 'éditrice'] },
  'Eglise': { d: ['Religion & Mythes', 'Patrimoine'], r: ['église'] },
  'Entraineur': { d: ['Sport'], r: ['entraîneur', 'entraineur', 'entraîneuse'] },
  'Erudit': { d: ['Sciences'], r: ['érudit'] },
  'Espagne': { d: [], r: ['espagnol', 'espagne'] },
  'Exploratrice': { d: ['Histoire'], r: ['exploratrice', 'explorateur'] },
  'Film': { d: ['Cinéma & TV'], r: ['film'] },
  'Footballeur': { d: ['Sport'], r: ['football'] },
  'Français': { d: [], r: ['français', 'france'] },
  'Galaxie': { d: ['Espace'], r: ['galaxie'] },
  'Gare': { d: ['Transports'], r: ['gare'] },
  'Groupe de musique': { d: ['Musique'], r: ['groupe de musique', 'groupe musical'] },
  'Hockeyeur': { d: ['Sport'], r: ['hockey'] },
  'Homme d\'affaires': { d: ['Économie'], r: ['affaires'] },
  'Homme politique': { d: ['Politique & Droit'], r: ['politique'] },
  'Hongrois': { d: [], r: ['hongrois'] },
  'Humoriste': { d: ['Médias'], r: ['humoriste'] },
  'Illustrateur': { d: ['Arts'], r: ['illustrateur', 'illustratrice'] },
  'Interprète': { d: ['Musique'], r: ['interprète'] },
  'Irlande': { d: [], r: ['irlandais', 'irlande'] },
  'Italien': { d: [], r: ['italien'] },
  'Japon': { d: [], r: ['japon'] },
  'Jeux Olympique': { d: ['Sport'], r: ['olympique'] },
  'Journaliste': { d: ['Médias'], r: ['journaliste'] },
  'Juriste': { d: ['Politique & Droit'], r: ['juriste'] },
  'Les Simpson': { d: ['Fiction & Jeux'], r: ['simpson'] },
  'Limitation de vitesse': { d: ['Transports'], r: ['limitation de vitesse'] },
  'Musicien': { d: ['Musique'], r: ['musicien'] },
  'Mythologie grecque': { d: ['Religion & Mythes'], r: ['mythologie grecque'] },
  'Nébuleuse': { d: ['Espace'], r: ['nébuleuse'] },
  'Néerlandais (Pays-Bas)': { d: [], r: ['néerlandais', 'pays-bas'] },
  'Nigérian': { d: [], r: ['nigéria'] },
  'Nom de famille': { d: [], r: ['nom de famille'] },
  'Parolier': { d: ['Musique'], r: ['parolier', 'parolière'] },
  'Pays': { d: ['Géographie'], r: ['pays'] },
  'Peintre': { d: ['Arts'], r: ['peintre'] },
  'Philosophe': { d: ['Sciences'], r: ['philosophe'] },
  'Photographe': { d: ['Arts'], r: ['photographe'] },
  'Pianiste': { d: ['Musique'], r: ['pianiste'] },
  'Poète': { d: ['Littérature'], r: ['poète', 'poétesse'] },
  'Pologne': { d: [], r: ['polonais', 'pologne'] },
  'Portugal': { d: [], r: ['portugais', 'portugal'] },
  'Producteur': { d: [], r: ['producteur', 'productrice'] },
  'Professeur': { d: [], r: ['professeur'] },
  'Psychologue': { d: ['Sciences'], r: ['psychologue'] },
  'Rappeur': { d: ['Musique'], r: ['rappeur', 'rappeuse'] },
  'Réalisateur': { d: ['Cinéma & TV'], r: ['réalisateur', 'réalisatrice'] },
  'Réunionnais': { d: [], r: ['réunion'] },
  'Rivière / Ruisseau France': { d: ['Géographie'], r: ['rivière', 'ruisseau'] },
  'Rugby': { d: ['Sport'], r: ['rugby'] },
  'Russie': { d: [], r: ['russe', 'russie'] },
  'Saché': { d: ['Géographie'], r: ['saché'] },
  'Scénariste': { d: ['Cinéma & TV'], r: ['scénariste'] },
  'Sculpteur': { d: ['Arts'], r: ['sculpteur', 'sculptrice'] },
  'Série télévisé': { d: ['Cinéma & TV'], r: ['série télévisée'] },
  'Soul (Musci)': { d: ['Musique'], r: ['soul'] },
  'Station de Métro': { d: ['Transports'], r: ['station de métro', 'station du métro'] },
  'Suisse': { d: [], r: ['suisse'] },
  'Tennis': { d: ['Sport'], r: ['tennis'] },
  'Train / Wagon / Locomotive': { d: ['Transports'], r: ['train', 'wagon', 'locomotive', 'automotrice'] },
  'Ukraine': { d: [], r: ['ukrainien', 'ukraine'] },
  'Université': { d: ['Sciences'], r: ['université'] },
  'Village Britannique': { d: ['Géographie'], r: ['village'] },
  'Village Polonais': { remplacee: '★Village Polonais' },
  'Voie ferrée': { d: ['Transports'], r: ['voie ferrée', 'ferroviaire'] },
  'Volley Ball': { d: ['Sport'], r: ['volley'] },
  'Wagon': { d: ['Transports'], r: ['wagon'] },
};

// Étiquettes de gestion que le script ne pose ni ne retire jamais (à part !À traiter).
const GESTION = ['!Doublon', '!À vendre', '!À garder', '!À traiter'];

// ═══════════════════════════════════════════════════════════════════
//  AUTOMATISATION DE LA PAGE COLLECTION — pas besoin d'y toucher
// ═══════════════════════════════════════════════════════════════════

const NOUVELLES = new Set([...Object.keys(DOMAINES), ...COLLECTIONS.map((c) => c.etiquette), ...GESTION]);
// Échelle de temps : 1 en usage réel ; les tests la baissent pour tourner vite.
const ECHELLE = window.__WMR_ECHELLE__ || 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms * ECHELLE));
const store = {
  get(k, def) { try { const v = localStorage.getItem('wmr_' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem('wmr_' + k, JSON.stringify(v)); } catch (e) { /* stockage plein ou bloqué */ } },
};
const cle = (c) => c.t + '|' + c.d + '|' + c.r;
let STOP = false;
const arret = () => { if (STOP) throw new Error('Arrêté.'); };

// ── lecture de la page ──
// Le site est lent : le compteur « Page X / Y » arrive plusieurs secondes après les cartes,
// et son total peut être faux (pages vides en fin de collection). On ne s'y fie donc pas :
// une vue se termine sur la première page incomplète ou vide.
const PAR_PAGE = 50;
const texte = () => document.body.innerText;
const pageInfo = () => { const m = texte().match(/Page (\d+) \/ (\d+)/); return m ? [+m[1], +m[2]] : null; };
const enChargement = () => /Chargement/.test(texte());
const attendre = async (cond, ms) => {
  const fin = Date.now() + ms * ECHELLE;
  while (Date.now() < fin) { if (cond()) return true; await sleep(200); }
  return cond();
};
// Une carte = un bloc « glow-<rareté> » contenant le titre (h3). Les cartes sans description n'ont pas de <p>.
const cartesDom = () => [...document.querySelectorAll('h3')].map((h) => {
  const card = h.closest('div[class*="glow-"]');
  if (!card || card.closest('#wmr-host') || card.closest('[role=dialog]')) return null;
  return { h, card, wrap: card.parentElement };
}).filter(Boolean);
const lireCarte = (el) => {
  const p = el.card.querySelector('p');
  const r = el.card.querySelector('div.absolute.top-2.left-2');
  const tags = [...el.card.querySelectorAll('span.rounded-full')].map((s) => s.textContent.trim());
  const plus = [...el.card.querySelectorAll('span')].map((s) => s.textContent.trim()).find((t) => /^\+\d+$/.test(t));
  return { t: el.h.textContent.trim(), d: p ? p.textContent.trim() : '', r: r ? r.textContent.trim() : '', tags, plus: plus || '' };
};
const lirePage = () => cartesDom().map(lireCarte);
// Empreinte de la page affichée, pour savoir quand elle a vraiment changé.
const empreinte = () => cartesDom().map((el) => el.h.textContent.trim()).join('|');

const attendreCalme = async () => {
  let calme = 0;
  for (let i = 0; i < 400; i++) {
    await sleep(150);
    calme = enChargement() ? 0 : calme + 1;
    if (calme >= 5) return;
  }
};
const bouton = (re) => [...document.querySelectorAll('button')].find((b) => !b.closest('#wmr-host') && re.test(b.innerText.trim()));

// Attend que la page affichée soit stable (même empreinte pendant 1,5 s, rien en chargement).
const attendrePageStable = async () => {
  let prec = null, stable = 0;
  for (let i = 0; i < 300; i++) {
    await sleep(200);
    const e = empreinte();
    stable = (!enChargement() && e === prec) ? stable + 1 : 0;
    prec = e;
    if (stable >= 7) return;
  }
};

// Passe à la page suivante ou précédente. Renvoie false s'il n'y en a pas.
const changerPage = async (sens) => {
  const re = sens > 0 ? /Suivant/ : /Précédent/;
  // la barre de pagination peut mettre plusieurs secondes à apparaître
  if (!bouton(re)) await attendre(() => bouton(re), cartesDom().length >= PAR_PAGE ? 30000 : 3000);
  const b = bouton(re);
  if (!b || b.disabled) return false;
  const avant = empreinte();
  b.click();
  const ok = await attendre(() => empreinte() !== avant && cartesDom().length > 0 && !enChargement(), 90000);
  if (!ok) {
    if (!cartesDom().length && !enChargement()) return false; // page vide : fin réelle de la vue
    throw new Error('Le site ne répond plus (page bloquée sur « Chargement… »). Recharge la page puis relance : ce qui est fait reste fait.');
  }
  await attendrePageStable();
  return true;
};
const retourDebut = async () => {
  for (let i = 0; i < 200; i++) {
    arret();
    // pas besoin d'attendre la pagination si on voit déjà « Page 1 » ou une vue sur une seule page
    if (cartesDom().length >= PAR_PAGE && !pageInfo()) await attendre(() => pageInfo(), 15000);
    const pi = pageInfo();
    if (!pi || pi[0] === 1) return;
    if (!(await changerPage(-1))) return;
  }
};

// ── menus déroulants ──
const ouvrirFiltre = async () => {
  const f = document.querySelector('button[aria-label="Filtrer par étiquette"]');
  if (!f) throw new Error('Menu des étiquettes introuvable : es-tu sur la page Collection ?');
  f.click(); await sleep(450); return f;
};
const fermerMenu = async (f) => { if (bouton(/^Toutes les étiquettes$/) && f) { f.click(); await sleep(250); } };
const listerEtiquettes = async () => {
  const f = await ouvrirFiltre();
  // le bouton du filtre actif affiche aussi « #Nom (n) » : on dédoublonne
  const parNom = new Map();
  [...document.querySelectorAll('button')].filter((b) => b !== f).map((b) => b.innerText.trim())
    .map((t) => t.match(/^#(.+?)(?: \((\d+)\))?$/)).filter(Boolean)
    .forEach((m) => parNom.set(m[1], Math.max(parNom.get(m[1]) || 0, +(m[2] || 0))));
  await fermerMenu(f);
  return [...parNom].map(([nom, n]) => ({ nom, n }));
};
const libelleFiltre = (nom) => (nom === null ? 'Toutes les étiquettes' : nom === '' ? 'Sans étiquette' : '#' + nom);
const choisirFiltre = async (nom) => {
  const f = document.querySelector('button[aria-label="Filtrer par étiquette"]');
  const actuel = f ? f.innerText.trim().replace(/ \(\d+\)$/, '') : '';
  const voulu = libelleFiltre(nom);
  if (actuel !== voulu) {
    await ouvrirFiltre();
    const b = [...document.querySelectorAll('button')].find((x) => x.innerText.trim().replace(/ \(\d+\)$/, '') === voulu);
    if (!b) throw new Error('Option de filtre introuvable : ' + voulu);
    const avant = empreinte();
    b.click();
    // on attend que les cartes du nouveau filtre remplacent les anciennes
    await attendre(() => empreinte() !== avant && !enChargement(), 30000);
    await attendrePageStable();
  }
  await retourDebut();
};
const choisirTri = async (libelle) => {
  const s = document.querySelector('button[aria-label="Trier la collection"]');
  if (!s) return false;
  if (s.innerText.includes(libelle)) return true; // déjà trié ainsi
  s.click(); await sleep(400);
  const o = [...document.querySelectorAll('[role=option],[role=menuitem],[role=listbox] button,button')].find((b) => b !== s && b.innerText.trim() === libelle);
  if (!o) { s.click(); return false; }
  const avant = empreinte();
  o.click();
  await attendre(() => empreinte() !== avant, 20000);
  await attendrePageStable();
  return true;
};

// Parcourt la vue affichée page par page depuis le début.
// attendu : nombre total de cartes de la vue s'il est connu (filtre d'étiquette), sinon null.
// visiter(page, numero) est appelé sur chaque page ; il peut renvoyer false pour s'arrêter.
const parcourirVue = async (visiter, attendu = null) => {
  await retourDebut();
  let vus = 0;
  for (let num = 1; ; num++) {
    arret();
    if (attendu === 0) return;
    // attendre que la page soit remplie (le site affiche parfois les cartes par paquets)
    const voulu = attendu == null ? 1 : Math.min(PAR_PAGE, attendu - vus);
    await attendre(() => cartesDom().length >= voulu && !enChargement(), 30000);
    await attendrePageStable();
    const n = cartesDom().length;
    if (!n) return;
    if ((await visiter(num)) === false) return;
    vus += n;
    if (attendu != null ? vus >= attendu : n < PAR_PAGE) return;
    if (!(await changerPage(1))) return;
  }
};
let __lues = {};
const lireVue = async (progression, attendu = null) => {
  const cartes = [];
  __lues = {};
  await parcourirVue(async (num) => {
    const pi = pageInfo();
    progression && progression(num, pi ? pi[1] : '?');
    for (const c of lirePage()) { cartes.push(c); __lues[cle(c)] = 1; }
  }, attendu);
  return cartes;
};

// ── lecture rapide par l'API du site (la même requête que la page Collection) ──
// Lecture seule. Le site met ~5 s par page : on en demande jusqu'à 3 à la fois.
// En cas d'échec, les modes reviennent à la lecture par l'écran.
const PARALLELE = 3;
const apiCollection = async (params, page) => {
  const r = await fetch('/api/my-collection?' + new URLSearchParams({ ...params, page: String(page), stats: '0' }), { credentials: 'same-origin' });
  if (!r.ok) throw new Error('API ' + r.status);
  const j = await r.json();
  if (!Array.isArray(j.collection)) throw new Error('réponse inattendue');
  return j.collection.map((x) => ({
    t: (x.card?.wikipedia_title || '').trim(), d: (x.card?.category || '').trim(), r: (x.card?.rarity || '').trim(),
    tags: (x.tags || []).map((t) => t.name), obtenu: x.obtained_at || '',
  }));
};
const apiTotal = async (params) => {
  const r = await fetch('/api/my-collection/stats?' + new URLSearchParams(params), { credentials: 'same-origin' });
  if (!r.ok) throw new Error('API stats ' + r.status);
  const j = await r.json();
  return typeof j.total === 'number' ? j.total : null;
};
// depuis (date ISO) : ne lit que les cartes obtenues après cette date (vue triée par date d'ajout).
const lireApi = async (params, { depuis = null, progression } = {}) => {
  const cartes = [];
  if (depuis) {
    for (let page = 0; page < 500; page++) {
      arret();
      progression && progression(cartes.length);
      const lot = await apiCollection(params, page);
      const recentes = lot.filter((c) => c.obtenu > depuis);
      cartes.push(...recentes);
      if (recentes.length < lot.length || lot.length < PAR_PAGE) break;
    }
    return cartes;
  }
  const total = await apiTotal(params);
  const pages = total == null ? 500 : Math.ceil(total / PAR_PAGE);
  for (let debut = 0; debut < pages; debut += PARALLELE) {
    arret();
    progression && progression(cartes.length, total);
    const lots = await Promise.all([...Array(Math.min(PARALLELE, pages - debut)).keys()].map((i) => apiCollection(params, debut + i)));
    for (const lot of lots) cartes.push(...lot);
    if (lots.some((l) => l.length < PAR_PAGE)) break;
  }
  return cartes;
};

// ── sélection et étiquetage ──
// En mode sélection, un calque visuel (non cliquable) entoure la carte cochée ; c'est la carte qui reçoit le clic.
const calque = (el) => [...el.wrap.children].find((c) => c !== el.card && c.tagName === 'DIV');
const estSelectionnee = (el) => /\bring-4\b/.test(calque(el)?.className || '');
const enSelection = () => !!bouton(/Quitter la sélection/);
const modeSelection = async (oui) => {
  if (enSelection() === oui) return;
  const b = bouton(oui ? /^Sélectionner$/ : /Quitter la sélection/);
  if (b) { b.click(); await sleep(500); }
  if (enSelection() !== oui) throw new Error('Impossible de ' + (oui ? 'passer en' : 'quitter le') + ' mode sélection.');
};
// Hors mode sélection, cliquer une carte ouvrirait sa fiche : on vérifie avant chaque clic.
const basculer = async (el) => {
  if (!enSelection()) throw new Error('Mode sélection inactif : clic annulé.');
  el.card.click(); await sleep(80);
};
const viderSelection = async () => {
  for (const el of cartesDom()) if (estSelectionnee(el)) await basculer(el);
};
const setValeur = (inp, v) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, v);
  inp.dispatchEvent(new Event('input', { bubbles: true }));
};
const champEtiquette = () => [...document.querySelectorAll('input')].find((x) => /créer une étiquette/i.test(x.placeholder || ''));
const fenetreOuverte = () => /Appliquer une étiquette/.test(texte());
const fermerFenetre = async () => {
  const t = bouton(/^Terminé$/);
  if (t) t.click();
  else [...document.querySelectorAll('button[aria-label="Fermer"]')].find((x) => !x.closest('#wmr-host'))?.click();
  await attendre(() => !fenetreOuverte(), 10000);
};

// Pose une étiquette sur les cartes cochées. La fenêtre du site se termine par un bilan
// (« N cartes étiquetées (M déjà étiquetées) ») et un bouton « Terminé ».
const poserEtiquette = async (nom) => {
  const b = bouton(/^Étiqueter$/);
  if (!b || b.disabled) throw new Error('Bouton « Étiqueter » indisponible.');
  b.click();
  if (!(await attendre(() => champEtiquette(), 10000))) throw new Error('Fenêtre « Appliquer une étiquette » introuvable.');
  setValeur(champEtiquette(), nom);
  const choix = () => {
    const inp = champEtiquette(); if (!inp) return null;
    let f = inp; while (f && !/Appliquer une étiquette/.test(f.innerText || '')) f = f.parentElement;
    const bs = f ? [...f.querySelectorAll('button')] : [];
    return bs.find((x) => x.innerText.trim() === nom) || bs.find((x) => /^Créer/.test(x.innerText.trim()) && x.innerText.includes(nom));
  };
  if (!(await attendre(() => choix(), 10000))) { await fermerFenetre(); throw new Error('Étiquette « ' + nom + ' » introuvable dans la fenêtre.'); }
  choix().click();
  // le site peut être lent sur une grosse sélection
  if (!(await attendre(() => bouton(/^Terminé$/), 90000))) {
    await fermerFenetre();
    throw new Error('Le site n\'a pas confirmé « ' + nom + ' » après 90 s. Vérifie quelques cartes puis relance : ce qui est fait reste fait.');
  }
  const m = texte().match(/(\d+)\s*cartes?\s*étiquetées?\.?\s*(?:\((\d+)\s*déjà)?/);
  await fermerFenetre();
  await attendrePageStable();
  return m ? { poses: +m[1], deja: +(m[2] || 0) } : null;
};

// Applique, sur la page affichée, les étiquettes prévues pour les cartes visibles.
// plan : Map(clé → [étiquettes]) ; fait : Set('clé§étiquette')
// Revient à la page « num » (le site peut revenir à la page 1 après un étiquetage).
const allerA = async (num) => {
  for (let i = 0; i < 300; i++) {
    arret();
    if (!pageInfo()) await attendre(() => pageInfo(), 20000);
    const pi = pageInfo();
    if (!pi) { if (num === 1) return; throw new Error('Pagination introuvable : impossible de revenir à la page ' + num + '.'); }
    if (pi[0] === num) return;
    if (!(await changerPage(pi[0] < num ? 1 : -1))) throw new Error('Impossible de revenir à la page ' + num + '.');
  }
};

const appliquerSurPage = async (plan, fait, journal, num = null) => {
  let poses = 0;
  for (;;) {
    arret();
    const vis = cartesDom().map((el) => ({ el, c: lireCarte(el) }));
    const parTag = new Map();
    for (const { c } of vis) for (const t of plan.get(cle(c)) || []) {
      if (!fait.has(cle(c) + '§' + t)) { if (!parTag.has(t)) parTag.set(t, new Set()); parTag.get(t).add(cle(c)); }
    }
    if (!parTag.size) return poses;
    const [tag, cles] = [...parTag.entries()].sort((a, b) => b[1].size - a[1].size)[0];
    await modeSelection(true);
    await viderSelection();
    for (const el of cartesDom()) if (cles.has(cle(lireCarte(el))) && !estSelectionnee(el)) await basculer(el);
    const nb = cartesDom().filter(estSelectionnee).length;
    const attendu = cartesDom().filter((el) => cles.has(cle(lireCarte(el)))).length;
    if (nb !== attendu) throw new Error(`Sélection incohérente pour « ${tag} » (${nb} cochée(s) au lieu de ${attendu}) : rien n'a été posé.`);
    if (!nb) throw new Error('Impossible de sélectionner les cartes pour « ' + tag + ' ».');
    const avantTag = empreinte();
    const bilan = await poserEtiquette(tag);
    for (const k of cles) fait.add(k + '§' + tag);
    poses += nb;
    journal(`  ${tag} → ${bilan ? `${bilan.poses} posée(s)${bilan.deja ? `, ${bilan.deja} déjà là` : ''}` : nb + ' carte(s)'}`);
    await viderSelection();
    // le site recharge parfois la liste après un étiquetage : on vérifie qu'on est toujours sur la bonne page
    if (num != null && empreinte() !== avantTag) {
      if (!pageInfo()) await attendre(() => pageInfo(), 15000);
      const pi = pageInfo();
      if (pi && pi[0] !== num) {
        journal(`  ↺ le site est revenu page ${pi[0]} : retour page ${num}`);
        await modeSelection(false);
        await allerA(num);
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
//  CALCUL DES PLANS
// ═══════════════════════════════════════════════════════════════════

const contientMot = (c, mots) => { const t = norm(c.d + ' ' + c.t); return mots.some((m) => t.includes(norm(m))); };

// Étiquettes finales d'une carte, avec ses anciennes étiquettes éventuelles.
const planCarte = (c, anciennes = []) => {
  const r = classer(c);
  const domDesc = r.etiquettes.filter((e) => DOMAINES[e]);
  const coll = r.etiquettes.filter((e) => !DOMAINES[e] && e !== A_TRAITER);
  const domAnc = [], gestion = [];
  for (const a of anciennes) {
    const def = ANCIENNES[a];
    if (!def) continue;
    if (def.remplacee) gestion.push(def.remplacee);
    else domAnc.push(...def.d);
  }
  const doms = [...new Set([...domDesc, ...domAnc])].slice(0, MAX_DOMAINES);
  const tags = [...new Set([...doms, ...coll, ...gestion])];
  if (!doms.length && r.statut === 'a_traiter') tags.push(A_TRAITER);
  const statut = doms.length ? 'classee' : r.statut === 'a_traiter' ? 'a_traiter' : r.statut;
  return { tags, statut, source: r.source };
};

const rapportSuppression = (lecture, plans) => {
  const lignes = [];
  for (const [nom, cles] of Object.entries(lecture.membres)) {
    if (NOUVELLES.has(nom)) continue;
    const def = ANCIENNES[nom] || { d: [], r: [norm(nom)] };
    const bloque = [];
    for (const k of cles) {
      const c = lecture.cartes[k]; if (!c) continue;
      const p = plans.get(k);
      if (def.remplacee) { if (!p.tags.includes(def.remplacee)) bloque.push({ c, pourquoi: 'pas encore copiée' }); continue; }
      if (!p.tags.some((t) => DOMAINES[t])) bloque.push({ c, pourquoi: 'pas de domaine' });
      else if (!contientMot(c, def.r)) bloque.push({ c, pourquoi: 'mot absent de la description' });
    }
    lignes.push({ nom, n: cles.length, connu: !!ANCIENNES[nom], bloque, ok: !bloque.length });
  }
  return lignes.sort((a, b) => (b.ok - a.ok) || a.nom.localeCompare(b.nom));
};

// ═══════════════════════════════════════════════════════════════════
//  SUPPRESSION D'UNE ÉTIQUETTE (via « Gérer les étiquettes… »)
// ═══════════════════════════════════════════════════════════════════

const supprimerEtiquette = async (nom) => {
  // ouvre « Gérer les étiquettes… » si ce n'est pas déjà fait
  const ligneDe = (n) => [...document.querySelectorAll('button')].filter((b) => !b.closest('#wmr-host') && b.innerText.trim() === 'Supprimer').map((b) => {
    let row = b.parentElement;
    while (row && [...row.querySelectorAll('button')].filter((x) => x.innerText.trim() === 'Supprimer').length === 1 && !row.innerText.trim().startsWith(n + '\n')) row = row.parentElement;
    return row && row.innerText.trim().split('\n')[0] === n ? { row, b } : null;
  }).find(Boolean);
  const gestionOuverte = () => /Créez, renommez/.test(texte());
  if (!gestionOuverte()) {
    await ouvrirFiltre();
    const g = bouton(/^Gérer les étiquettes/);
    if (!g) throw new Error('« Gérer les étiquettes… » introuvable.');
    g.click();
    if (!(await attendre(gestionOuverte, 10000))) throw new Error('La fenêtre « Gérer les étiquettes » ne s\'ouvre pas.');
    await sleep(500);
  }
  const l = ligneDe(nom);
  if (!l) return 'absente'; // déjà supprimée (par exemple lors d'un essai précédent)

  // Le site demande une confirmation native du navigateur. Tu as déjà validé la suppression
  // dans le panneau : le script répond « OK », mais uniquement si le message parle bien de cette étiquette.
  const confirmOriginal = window.confirm;
  let message = null;
  const accepte = (m) => m.includes(nom) || /supprim/i.test(m);
  window.confirm = (m) => { message = String(m || ''); return accepte(message); };
  try {
    const avant = new Set(document.querySelectorAll('button'));
    l.b.click();
    await sleep(700);
    // au cas où le site utiliserait plutôt sa propre fenêtre de confirmation
    if (message === null) {
      const conf = [...document.querySelectorAll('button')].filter((b) => !avant.has(b) && !b.closest('#wmr-host') && /^(Supprimer|Confirmer|Oui)/.test(b.innerText.trim()));
      if (conf.length) conf[conf.length - 1].click();
    }
    const partie = await attendre(() => !ligneDe(nom), 20000);
    if (!partie) {
      if (message !== null && !accepte(message)) throw new Error(`Confirmation inattendue (« ${message.slice(0, 80)} ») : refusée par sécurité.`);
      throw new Error('« ' + nom + ' » est toujours là après 20 s.');
    }
  } finally {
    window.confirm = confirmOriginal;
  }
  return 'supprimée';
};
const fermerGestion = async () => {
  if (!/Créez, renommez/.test(texte())) return;
  [...document.querySelectorAll('button[aria-label="Fermer"]')].find((x) => !x.closest('#wmr-host'))?.click();
  await sleep(400);
};

// ═══════════════════════════════════════════════════════════════════
//  INTERFACE
// ═══════════════════════════════════════════════════════════════════

const CSS = `
:host{all:initial}
[hidden]{display:none!important}
*{box-sizing:border-box;font-family:Inter,system-ui,sans-serif}
.fab{position:fixed;right:18px;bottom:18px;z-index:2147483000;background:#10b981;color:#04130d;border:0;border-radius:999px;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.4)}
.pan{position:fixed;right:18px;bottom:66px;z-index:2147483000;width:min(420px,calc(100vw - 36px));max-height:72vh;display:flex;flex-direction:column;background:#141615;color:#e8ebe9;border:1px solid #2a2e2c;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.55);font-size:13px}
.hd{padding:12px 14px;border-bottom:1px solid #2a2e2c;display:flex;justify-content:space-between;align-items:center}
.hd b{font-size:14px}.x{background:none;border:0;color:#9aa19d;font-size:18px;cursor:pointer}
.bd{padding:12px 14px;overflow:auto;flex:1}
.row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
button.b{background:#22262a;color:#e8ebe9;border:1px solid #343a37;border-radius:8px;padding:7px 10px;font-size:12px;font-weight:600;cursor:pointer}
button.b:hover{border-color:#10b981}button.b.p{background:#10b981;color:#04130d;border-color:#10b981}
button.b.d{border-color:#7f1d1d;color:#fca5a5}button.b:disabled{opacity:.4;cursor:default}
.st{color:#9aa19d;margin:6px 0 10px;min-height:16px;white-space:pre-wrap}
h4{margin:14px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#9aa19d}
table{width:100%;border-collapse:collapse}td{padding:3px 4px;border-bottom:1px solid #222;vertical-align:top}td.n{text-align:right;color:#9aa19d;width:48px}
details{margin:4px 0}summary{cursor:pointer;color:#cfd4d1}
.li{color:#b9bfbb;font-size:12px;padding:2px 0 2px 10px}
.ok{color:#34d399}.ko{color:#fbbf24}.log{font-family:ui-monospace,monospace;font-size:11px;color:#9aa19d;white-space:pre-wrap;max-height:140px;overflow:auto;background:#0e100f;border-radius:6px;padding:6px;margin-top:8px}
.hint{font-size:12px;color:#9aa19d;margin:0 0 10px}
`;

let ui;
// Affiche ou masque un élément du panneau. Le style direct l'emporte sur toute règle CSS
// (un « display: flex » de classe annulait l'attribut hidden : panneau impossible à fermer).
const montrer = (el, oui) => { el.hidden = !oui; el.style.display = oui ? '' : 'none'; };
const monterUI = () => {
  if (document.getElementById('wmr-host')) return;
  const host = document.createElement('div'); host.id = 'wmr-host';
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${CSS}</style>
  <button class="fab">🏷 Rangement</button>
  <div class="pan" hidden style="display:none">
    <div class="hd"><b>Rangement des cartes</b><button class="x" title="Fermer">×</button></div>
    <div class="bd">
      <p class="hint">Rien n'est modifié sans que tu cliques sur « Appliquer ». Le script ne touche jamais à Défausser ni aux enchères.</p>
      <div class="row">
        <button class="b p" data-a="ranger">Ranger les nouvelles cartes</button>
        <button class="b" data-a="migration">Migration (une fois)</button>
        <button class="b d" data-a="stop" disabled>Arrêter</button>
      </div>
      <div class="st"></div>
      <div class="out"></div>
      <div class="log" hidden style="display:none"></div>
    </div>
  </div>`;
  const $ = (s) => root.querySelector(s);
  ui = {
    root, $, st: $('.st'), out: $('.out'), log: $('.log'),
    statut(t) { this.st.textContent = t; },
    journal(t) { montrer(this.log, true); this.log.textContent += t + '\n'; this.log.scrollTop = 1e9; },
    occupe(o) { root.querySelectorAll('button.b').forEach((b) => { b.disabled = b.dataset.a === 'stop' ? !o : o; }); },
  };
  $('.fab').onclick = () => montrer($('.pan'), $('.pan').hidden);
  $('.x').onclick = () => montrer($('.pan'), false);
  root.querySelector('[data-a=stop]').onclick = () => { STOP = true; ui.statut('Arrêt demandé…'); };
  root.querySelector('[data-a=ranger]').onclick = () => lancer(modeRanger);
  root.querySelector('[data-a=migration]').onclick = () => lancer(modeMigration);
  proposerReprise();
};

const lancer = async (fn) => {
  STOP = false; ui.occupe(true); ui.log.textContent = ''; montrer(ui.log, false);
  try { await fn(); } catch (e) { ui.statut('⚠️ ' + e.message); } finally {
    STOP = false; ui.occupe(false);
    try { await modeSelection(false); } catch (e) { /* rien */ }
  }
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const listeCartes = (titre, cartes, max = 300) => cartes.length ? `<details><summary>${esc(titre)} (${cartes.length})</summary>${
  cartes.slice(0, max).map((c) => `<div class="li">${esc(c.t)}${c.d ? ' — <i>' + esc(c.d) + '</i>' : ''}</div>`).join('')}${cartes.length > max ? '<div class="li">…</div>' : ''}</details>` : '';

const resumePlan = (cartes, plans) => {
  const parTag = {}, groupes = { classee: [], a_traiter: [], ignoree: [], inconnue: [] };
  for (const c of cartes) {
    const p = plans.get(cle(c));
    for (const t of p.tags) (parTag[t] = parTag[t] || []).push(c);
    groupes[p.statut].push(c);
  }
  const lignes = Object.entries(parTag).sort((a, b) => b[1].length - a[1].length)
    .map(([t, l]) => `<tr><td><details><summary>${esc(t)}</summary>${l.slice(0, 200).map((c) => `<div class="li">${esc(c.t)}</div>`).join('')}</details></td><td class="n">${l.length}</td></tr>`).join('');
  return `<h4>Résultat prévu</h4>
    <div>${groupes.classee.length} classée(s) · ${groupes.a_traiter.length} à traiter · ${groupes.ignoree.length} ignorée(s) · ${groupes.inconnue.length} sans règle</div>
    <table>${lignes}</table>
    ${listeCartes('Sans règle (restent « Sans étiquette »)', groupes.inconnue)}
    ${listeCartes('Ignorées volontairement (homonymies, listes…)', groupes.ignoree)}`;
};

// ── Mode Ranger : les nouvelles cartes sans étiquette ──
// Le script retient la date de la dernière carte rangée et ne relit que les cartes obtenues depuis.
// La dernière lecture est sauvegardée : après un rechargement de la page, on peut la reprendre.
const modeRanger = async (tout = false) => {
  const depuis = tout ? null : store.get('ranger_depuis', null);
  let cartes, viaApi = true;
  ui.statut(depuis ? `Lecture des cartes obtenues depuis le ${new Date(depuis).toLocaleString()}…` : 'Lecture de toutes les cartes sans étiquette (≈ 1 min 30, garde l\'onglet ouvert)…');
  try {
    cartes = await lireApi({ sort: 'added', untagged: '1' }, { depuis, progression: (n, tot) => ui.statut(`Lecture : ${n}${tot ? ' / ' + tot : ''} carte(s)…`) });
  } catch (e) {
    if (STOP) throw e;
    viaApi = false;
    ui.journal('Lecture rapide indisponible (' + e.message + ') : lecture par l\'écran.');
    await choisirFiltre('');
    cartes = await lireVue((p) => ui.statut(`Lecture des cartes sans étiquette : page ${p}…`));
    await choisirFiltre(null);
  }
  ui.statut(`Classement de ${cartes.length} carte(s)…`);
  await sleep(50);
  store.set('ranger_lecture', { at: Date.now(), depuis, viaApi, cartes });
  afficherRanger(cartes, depuis, viaApi);
};

const afficherRanger = (cartes, depuis, viaApi) => {
  const plans = new Map(cartes.map((c) => [cle(c), planCarte(c)]));
  const cibles = cartes.filter((c) => plans.get(cle(c)).tags.length);
  const plusRecente = cartes.reduce((m, c) => (c.obtenu && c.obtenu > m ? c.obtenu : m), depuis || '');
  ui.statut(`${cartes.length} carte(s) ${depuis ? 'nouvelle(s)' : 'sans étiquette'}, dont ${cibles.length} à ranger.`);
  ui.out.innerHTML = resumePlan(cartes, plans) + `<div class="row" style="margin-top:12px">
      ${cibles.length ? '<button class="b p" data-go>Appliquer</button>' : ''}
      ${depuis ? '<button class="b" data-tout>Revoir toutes les cartes sans étiquette</button>' : ''}</div>`;
  const marquer = () => {
    if (viaApi && plusRecente) store.set('ranger_depuis', plusRecente);
    store.set('ranger_lecture', null);
  };
  if (!cibles.length) marquer(); // rien à poser : ces cartes ne seront plus relues
  const go = ui.out.querySelector('[data-go]');
  if (go) go.onclick = () => { go.remove(); lancer(async () => { await appliquerRanger(cibles, plans); marquer(); }); };
  const tt = ui.out.querySelector('[data-tout]');
  if (tt) tt.onclick = () => lancer(() => modeRanger(true));
};

// Au chargement du panneau : proposer de reprendre une lecture interrompue par un rechargement.
const proposerReprise = () => {
  const l = store.get('ranger_lecture', null);
  if (!l || !l.cartes || Date.now() - l.at > 6 * 3600e3) return;
  ui.out.innerHTML = `<p class="hint">Une lecture de ${l.cartes.length} carte(s) faite à ${new Date(l.at).toLocaleTimeString()} n'a pas encore été appliquée.</p>
    <div class="row"><button class="b p" data-reprise>Reprendre cette lecture</button></div>`;
  ui.out.querySelector('[data-reprise]').onclick = () => lancer(async () => { afficherRanger(l.cartes, l.depuis, l.viaApi); });
};

const appliquerRanger = async (cibles, plans) => {
  // Passe 1 : dans « Sans étiquette », chaque carte reçoit sa première étiquette.
  // Les cartes rangées disparaissent de la vue et les suivantes remontent : on reste sur la page
  // tant qu'elle contient des cartes à ranger, puis on avance.
  const premier = new Map(), suite = new Map();
  for (const c of cibles) {
    const tags = plans.get(cle(c)).tags;
    premier.set(cle(c), [tags[0]]);
    if (tags.length > 1) suite.set(cle(c), { tete: tags[0], reste: tags.slice(1) });
  }
  const fait = new Set();
  const restants = () => [...premier.keys()].filter((k) => !fait.has(k + '§' + premier.get(k)[0])).length;
  await choisirFiltre('');
  await choisirTri('Date d\'ajout');
  for (let num = 1; ; ) {
    arret();
    await attendre(() => cartesDom().length > 0 && !enChargement(), 30000);
    await attendrePageStable();
    ui.statut(`Passe 1 : page ${num} — reste ${restants()} carte(s)`);
    await appliquerSurPage(premier, fait, (t) => ui.journal(`p${num} ${t}`), num);
    if (!restants() || cartesDom().length < PAR_PAGE) break;
    if (!(await changerPage(1))) break;
    num++;
  }
  // Passe 2 : les étiquettes suivantes des cartes à plusieurs domaines,
  // dans la vue (petite) de leur première étiquette.
  const parTete = new Map();
  for (const [k, { tete, reste }] of suite) {
    if (!fait.has(k + '§' + tete)) continue; // carte non retrouvée en passe 1
    if (!parTete.has(tete)) parTete.set(tete, new Map());
    parTete.get(tete).set(k, reste);
  }
  let i = 0;
  for (const [tete, plan] of parTete) {
    arret();
    i++;
    ui.statut(`Passe 2 : #${tete} (${i}/${parTete.size}) — ${plan.size} carte(s)`);
    await choisirFiltre(tete);
    await choisirTri('Date d\'ajout');
    const enAttente = () => [...plan].some(([k, tags]) => tags.some((t) => !fait.has(k + '§' + t)));
    await parcourirVue(async (num) => {
      await appliquerSurPage(plan, fait, (t) => ui.journal(`#${tete} p${num} ${t}`), num);
      return enAttente();
    });
  }
  await choisirFiltre(null);
  const manquent = cibles.filter((c) => plans.get(cle(c)).tags.some((t) => !fait.has(cle(c) + '§' + t)));
  ui.statut(manquent.length ? `Terminé, mais ${manquent.length} carte(s) non traitée(s) entièrement : relance « Ranger les nouvelles cartes ».` : `✅ ${cibles.length} carte(s) rangée(s).`);
};

// ── Mode Migration ──
const modeMigration = async () => {
  let lecture = store.get('lecture2', null);
  if (lecture && !confirm(`Une lecture du ${new Date(lecture.at).toLocaleString()} existe.\nOK = la réutiliser, Annuler = relire toute la collection (≈ 2 min).`)) lecture = null;
  if (!lecture) {
    const etiquettes = await listerEtiquettes();
    const anciennes = etiquettes.filter((e) => !NOUVELLES.has(e.nom));
    const cartes = {}, membres = {};
    for (const e of anciennes) membres[e.nom] = [];
    let toutes;
    try {
      // chaque carte arrive avec toutes ses étiquettes : une seule lecture suffit
      toutes = await lireApi({ sort: 'rarity' }, { progression: (n, tot) => ui.statut(`Lecture de la collection : ${n}${tot ? ' / ' + tot : ''} cartes…`) });
      for (const c of toutes) {
        cartes[cle(c)] = c;
        for (const t of c.tags) if (membres[t] && !membres[t].includes(cle(c))) membres[t].push(cle(c));
      }
    } catch (e) {
      if (STOP) throw e;
      ui.journal('Lecture rapide indisponible (' + e.message + ') : lecture par l\'écran (≈ 20 min).');
      await choisirFiltre(null);
      toutes = await lireVue((p) => ui.statut(`Lecture de la collection : page ${p}… (${Object.keys(__lues).length} cartes)`));
      for (const c of toutes) cartes[cle(c)] = c;
      for (const [i, e] of anciennes.entries()) {
        arret();
        ui.statut(`Lecture des étiquettes : ${i + 1}/${anciennes.length} (#${e.nom})`);
        if (!e.n) continue;
        await choisirFiltre(e.nom);
        const lues = await lireVue(null, e.n);
        membres[e.nom] = [...new Set(lues.map(cle))];
      }
      await choisirFiltre(null);
    }
    ui.journal(`Collection : ${toutes.length} cartes lues.`);
    for (const e of anciennes) if (e.n && membres[e.nom].length < e.n) ui.journal(`⚠️ #${e.nom} : ${membres[e.nom].length} carte(s) trouvée(s) sur ${e.n}`);
    lecture = { at: Date.now(), cartes, membres };
    store.set('lecture2', lecture);
  }
  // une étiquette supprimée entre-temps (à la main ou par un essai précédent) disparaît du rapport
  const existantes = new Set((await listerEtiquettes()).map((e) => e.nom));
  if (existantes.size) {
    for (const nom of Object.keys(lecture.membres)) if (!existantes.has(nom)) delete lecture.membres[nom];
    store.set('lecture2', lecture);
  }
  const anc = {};
  for (const [nom, cles] of Object.entries(lecture.membres)) for (const k of cles) (anc[k] = anc[k] || []).push(nom);
  const cartes = Object.values(lecture.cartes);
  const plans = new Map(cartes.map((c) => [cle(c), planCarte(c, anc[cle(c)] || [])]));
  const afficher = () => {
    const sup = rapportSuppression(lecture, plans);
    const applique = store.get('migration_ok2', false);
    ui.out.innerHTML = resumePlan(cartes, plans) + `
      <div class="row" style="margin-top:12px"><button class="b p" data-go>${applique ? 'Réappliquer' : 'Appliquer les étiquettes'}</button></div>
      <h4>Anciennes étiquettes</h4>
      <p class="hint">${applique ? 'Supprimable = toutes ses cartes ont leur domaine ET le mot dans leur description.' : 'La suppression se débloque une fois les étiquettes appliquées.'}</p>
      <table>${sup.map((l) => `<tr><td>${l.ok ? '<span class="ok">✔</span>' : '<span class="ko">●</span>'} #${esc(l.nom)}${l.connu ? '' : ' <i>(non prévue)</i>'}
        ${l.bloque.length ? `<details><summary>${l.bloque.length} carte(s) à garder</summary>${l.bloque.slice(0, 50).map((x) => `<div class="li">${esc(x.c.t)} — ${x.pourquoi}</div>`).join('')}</details>` : ''}</td>
        <td class="n">${l.n}</td><td class="n">${l.ok && applique ? `<button class="b d" data-del="${esc(l.nom)}">Suppr.</button>` : ''}</td></tr>`).join('')}</table>
      ${applique && sup.some((l) => l.ok) ? `<div class="row" style="margin-top:10px"><button class="b d" data-delall>Supprimer les ${sup.filter((l) => l.ok).length} sûres</button></div>` : ''}`;
    ui.out.querySelector('[data-go]').onclick = () => lancer(async () => {
      ui.out.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const plan = new Map([...plans].filter(([, p]) => p.tags.length).map(([k, p]) => [k, p.tags]));
      const fait = new Set(store.get('fait2', []));
      await choisirFiltre(null);
      await parcourirVue(async (num) => {
        ui.statut(`Application : page ${num}`);
        await appliquerSurPage(plan, fait, (t) => ui.journal(`p${num} ${t}`), num);
        store.set('fait2', [...fait]);
      });
      store.set('migration_ok2', true);
      const reel = Object.fromEntries((await listerEtiquettes()).map((e) => [e.nom, e.n]));
      const prevu = {}; for (const p of plan.values()) for (const t of p) prevu[t] = (prevu[t] || 0) + 1;
      const ecarts = Object.entries(prevu).filter(([t, n]) => (reel[t] || 0) < n);
      ui.statut(ecarts.length ? '⚠️ Écarts (prévu → réel) : ' + ecarts.map(([t, n]) => `${t} ${n}→${reel[t] || 0}`).join(', ') : '✅ Étiquettes appliquées, compteurs vérifiés.');
      afficher();
    });
    const supprimer = (noms) => lancer(async () => {
      let n = 0;
      try {
        for (const nom of noms) {
          arret();
          ui.statut(`Suppression de #${nom}… (${n + 1}/${noms.length})`);
          const r = await supprimerEtiquette(nom);
          ui.journal(r === 'absente' ? 'déjà absente : #' + nom : 'supprimée : #' + nom);
          // on note chaque suppression tout de suite, pour ne jamais rechercher une étiquette disparue
          delete lecture.membres[nom];
          store.set('lecture2', lecture);
          n++;
        }
        ui.statut(`✅ ${n} étiquette(s) supprimée(s).`);
      } finally {
        await fermerGestion();
        const statut = ui.st.textContent;
        afficher();
        ui.statut(statut);
      }
    });
    ui.out.querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { if (confirm(`Supprimer définitivement #${b.dataset.del} ?\nElle sera retirée de toutes ses cartes.`)) supprimer([b.dataset.del]); }; });
    const all = ui.out.querySelector('[data-delall]');
    if (all) all.onclick = () => {
      const noms = sup.filter((l) => l.ok).map((l) => l.nom);
      if (confirm(`Supprimer définitivement ces ${noms.length} étiquettes ?\n\n${noms.map((n) => '#' + n).join(', ')}`)) supprimer(noms);
    };
  };
  ui.statut(`${cartes.length} cartes lues.`);
  afficher();
};

// Crochet de test et de débogage : expose les fonctions internes sur window.__WMR.
// Actif dans les tests (window.__WMR_TEST__) ou quand localStorage « wmr_debug » vaut true.
if (window.__WMR_TEST__ || store.get('debug', false)) {
  window.__WMR = {
    classer, planCarte, norm, cle, store, cartesDom, lireCarte, pageInfo,
    lireVue, lireApi, parcourirVue, changerPage, choisirFiltre, choisirTri, listerEtiquettes,
    modeSelection, poserEtiquette, appliquerSurPage, appliquerRanger, modeRanger, modeMigration,
    supprimerEtiquette, rapportSuppression, monterUI, ui: () => ui, stop: () => { STOP = true; },
  };
}

// La page est une application : on surveille les changements d'URL.
if (!window.__WMR_TEST__) {
  setInterval(() => {
    const ici = /^\/collection/.test(location.pathname);
    const host = document.getElementById('wmr-host');
    if (ici && !host) monterUI();
    if (host) host.style.display = ici ? '' : 'none';
  }, 1000);
}
