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

// Étiquettes de gestion. Le script ne pose que !À traiter (Ranger) et !Doublon (Doublons), et ne retire que !À traiter
// (Ranger, quand les règles rangent enfin la carte) : jamais les autres.
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

// Raté passager du site (API en erreur, chargement raté, pose refusée…) : un rechargement de la page
// suffit en général. Le mode Ranger recharge alors la page et reprend où il en était (voir lancer).
class PanneSite extends Error {}
const MAX_RECHARGEMENTS = 3; // de suite, sans aucune carte rangée entre deux
const MAX_RECHARGEMENTS_SEANCE = 20;
// les tests remplacent le rechargement, que jsdom ne sait pas faire
const rechargerPage = () => (window.__WMR_RECHARGER__ ? window.__WMR_RECHARGER__() : location.reload());
const VERSION = typeof GM_info !== 'undefined' ? GM_info.script.version : '?';

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

// Un chargement raté affiche une liste vide : sans ce contrôle, il passerait pour la fin de la vue.
const echecChargement = () => /chargement de la collection a échoué/i.test(texte());
const verifierChargement = () => {
  if (echecChargement()) throw new PanneSite('Le site n\'a pas pu charger la liste (« Le chargement de la collection a échoué »). Recharge la page puis relance : ce qui est fait reste fait.');
};

// Attend que la page affichée soit stable (même empreinte pendant 1,5 s, rien en chargement).
const attendrePageStable = async () => {
  let prec = null, stable = 0;
  for (let i = 0; i < 300; i++) {
    await sleep(200);
    const e = empreinte();
    stable = (!enChargement() && e === prec) ? stable + 1 : 0;
    prec = e;
    if (stable >= 7) break;
  }
  verifierChargement();
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
    verifierChargement();
    if (!cartesDom().length && !enChargement()) return false; // page vide : fin réelle de la vue
    throw new PanneSite('Le site ne répond plus (page bloquée sur « Chargement… »). Recharge la page puis relance : ce qui est fait reste fait.');
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
    // juste après l'ouverture de la page, le menu peut rester vide un moment : on attend ses options,
    // puis on le referme et le rouvre une fois
    const option = () => [...document.querySelectorAll('button')].find((x) => x !== f && x.innerText.trim().replace(/ \(\d+\)$/, '') === voulu);
    for (let essai = 0; essai < 2 && !option(); essai++) {
      if (essai) { f.click(); await sleep(500); }
      await ouvrirFiltre();
      await attendre(option, 10000);
    }
    const b = option();
    if (!b) throw new PanneSite('Option de filtre introuvable : ' + voulu + ' (le menu des étiquettes ne s\'affiche pas).');
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
// Le serveur renvoie parfois une erreur 500 passagère : on réessaie la même requête (3 essais, 3 s d'écart).
// Une erreur serveur qui dure devient une PanneSite (rechargement puis reprise) ; une autre erreur, un repli sur l'écran.
const lireUrl = async (url) => {
  let r;
  for (let essai = 1; essai <= 3; essai++) {
    arret();
    r = await fetch(url, { credentials: 'same-origin' });
    if (r.ok || r.status < 500) break;
    if (essai < 3) await sleep(3000);
  }
  if (r.status >= 500) throw new PanneSite(`Le serveur du site répond en erreur (${r.status}) depuis 3 essais.`);
  if (!r.ok) throw new Error('API ' + r.status);
  return r.json();
};
const apiCollection = async (params, page) => {
  const j = await lireUrl('/api/my-collection?' + new URLSearchParams({ ...params, page: String(page), stats: '0' }));
  if (!Array.isArray(j.collection)) throw new Error('réponse inattendue');
  return j.collection.map((x) => ({
    t: (x.card?.wikipedia_title || '').trim(), d: (x.card?.category || '').trim(), r: (x.card?.rarity || '').trim(),
    tags: (x.tags || []).map((t) => t.name), obtenu: x.obtained_at || '',
  }));
};
const apiTotal = async (params) => {
  const j = await lireUrl('/api/my-collection/stats?' + new URLSearchParams(params));
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
  if (enSelection() !== oui) throw new PanneSite('Impossible de ' + (oui ? 'passer en' : 'quitter le') + ' mode sélection.');
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
const champRecherche = () => [...document.querySelectorAll('input')].find((x) => /Rechercher par titre/i.test(x.placeholder || ''));
// Tape un mot dans la barre de recherche du site et attend la liste filtrée (7 à 10 s sur le vrai site).
// Le serveur rate parfois une recherche : on la relance sur place, 3 essais en tout. Retaper la même valeur
// ne relancerait rien, et la recherche ignore la casse : on retape le mot en MAJUSCULES, puis avec une Majuscule.
const rechercher = async (mot) => {
  const inp = champRecherche();
  if (!inp) throw new Error('Barre de recherche introuvable : es-tu sur la page Collection ?');
  if (inp.value === mot && !echecChargement()) return;
  const variantes = [mot, mot.toUpperCase(), mot.charAt(0).toUpperCase() + mot.slice(1)];
  for (let essai = 0; ; essai++) {
    const avant = empreinte();
    setValeur(inp, variantes[essai]);
    await attendre(() => !enChargement() && (empreinte() !== avant || echecChargement()), 30000);
    try {
      await attendrePageStable();
      return;
    } catch (e) {
      if (!(e instanceof PanneSite) || !mot || essai >= 2) throw e;
      await sleep(3000);
    }
  }
};
const fenetreOuverte = () => /Appliquer une étiquette/.test(texte());
const fermerFenetre = async () => {
  const t = bouton(/^Terminé$/);
  if (t) t.click();
  else {
    // la croix de la fenêtre, pas celle du bandeau « Étiquette appliquée » qui porte le même libellé
    const croix = [...document.querySelectorAll('button[aria-label="Fermer"]')].filter((x) => !x.closest('#wmr-host'));
    (croix.find((x) => /Appliquer une étiquette/.test(x.parentElement?.innerText || '')) || croix[0])?.click();
  }
  await attendre(() => !fenetreOuverte(), 10000);
};

// Pose une étiquette sur les cartes cochées. La fenêtre du site se termine par un bilan
// (« N cartes étiquetées (M déjà étiquetées) ») et un bouton « Terminé ».
const poserEtiquette = async (nom) => {
  const b = bouton(/^Étiqueter$/);
  if (!b || b.disabled) throw new PanneSite('Bouton « Étiqueter » indisponible.');
  b.click();
  if (!(await attendre(() => champEtiquette(), 10000))) throw new PanneSite('Fenêtre « Appliquer une étiquette » introuvable.');
  setValeur(champEtiquette(), nom);
  const choix = () => {
    const inp = champEtiquette(); if (!inp) return null;
    let f = inp; while (f && !/Appliquer une étiquette/.test(f.innerText || '')) f = f.parentElement;
    const bs = f ? [...f.querySelectorAll('button')] : [];
    return bs.find((x) => x.innerText.trim() === nom) || bs.find((x) => /^Créer/.test(x.innerText.trim()) && x.innerText.includes(nom));
  };
  if (!(await attendre(() => choix(), 10000))) { await fermerFenetre(); throw new Error('Étiquette « ' + nom + ' » introuvable dans la fenêtre.'); }
  choix().click();
  // le site peut être lent sur une grosse sélection ; il peut aussi refuser (« Impossible d'appliquer l'étiquette »),
  // la fenêtre reste alors ouverte avec la sélection : on réessaie une fois
  const refus = () => /Impossible d'appliquer/.test(texte());
  if (!(await attendre(() => bouton(/^Terminé$/) || refus(), 90000))) {
    await fermerFenetre();
    throw new PanneSite('Le site n\'a pas confirmé « ' + nom + ' » après 90 s. Vérifie quelques cartes puis relance : ce qui est fait reste fait.');
  }
  if (!bouton(/^Terminé$/)) {
    await sleep(3000);
    if (choix()) choix().click();
    if (!(await attendre(() => bouton(/^Terminé$/), 30000))) {
      await fermerFenetre();
      throw new PanneSite('Le site a refusé deux fois de poser « ' + nom + ' » (« Impossible d\'appliquer l\'étiquette ») : rien n\'a été posé sur ces cartes. Attends une minute puis relance : ce qui est fait reste fait.');
    }
  }
  const m = texte().match(/(\d+)\s*cartes?\s*étiquetées?\.?\s*(?:\((\d+)\s*déjà)?/);
  await fermerFenetre();
  // la liste se recharge ensuite : c'est à l'appelant de l'attendre, une fois la pose notée
  // (un rechargement raté ne doit pas faire oublier une pose réussie)
  return m ? { poses: +m[1], deja: +(m[2] || 0) } : null;
};

// Retire une étiquette des cartes cochées (docs/wikimasters.md, « Retirer l'étiquette »). Seule !À traiter est retirée par le script.
// La fenêtre liste une étiquette par bouton, « nom » puis le nombre de cartes ; un clic retire tout de suite,
// puis « Terminé » (la fenêtre ne se ferme pas seule). Le site garde la sélection : l'appelant quitte le mode sélection.
const fenetreRetrait = () => /Retirer une étiquette/.test(texte());
const retirerEtiquette = async (nom) => {
  if (nom !== A_TRAITER) throw new Error('Le script ne retire que « ' + A_TRAITER + ' » (demandé : « ' + nom + ' »).');
  const b = bouton(/^Retirer l'étiquette$/);
  if (!b || b.disabled) throw new PanneSite('Bouton « Retirer l\'étiquette » indisponible.');
  b.click();
  if (!(await attendre(fenetreRetrait, 10000))) throw new PanneSite('Fenêtre « Retirer une étiquette » introuvable.');
  const choix = () => [...document.querySelectorAll('button')].find((x) => {
    if (x.closest('#wmr-host')) return false;
    const t = x.innerText.trim();
    return t === nom || (t.startsWith(nom) && /^\s+\d+$/.test(t.slice(nom.length)));
  });
  if (!(await attendre(choix, 10000))) { await fermerFenetre(); throw new Error('Étiquette « ' + nom + ' » absente de la fenêtre « Retirer une étiquette » : rien n\'a été retiré.'); }
  choix().click();
  if (!(await attendre(() => bouton(/^Terminé$/), 90000))) {
    await fermerFenetre();
    throw new PanneSite('Le site n\'a pas confirmé le retrait de « ' + nom + ' » après 90 s. Vérifie quelques cartes puis relance : ce qui est fait reste fait.');
  }
  const m = texte().match(/(\d+)\s*cartes?\s*désétiquetées?/);
  bouton(/^Terminé$/).click();
  await attendre(() => !fenetreRetrait(), 10000);
  await attendre(() => !/Actualisation/.test(texte()), 30000);
  return m ? +m[1] : null;
};

// Retire !À traiter des cartes visibles dont tous les domaines sont posés (prets : Set de clés), jusqu'à ce qu'il n'y en ait plus
// sur la page : les cartes retirées quittent la vue « #!À traiter » et les suivantes remontent.
const retirerSurPage = async (prets, fait, journal) => {
  let retirees = 0;
  for (;;) {
    arret();
    const cles = new Set(cartesDom().map((el) => cle(lireCarte(el))).filter((k) => prets.has(k) && !fait.has(k + '§-' + A_TRAITER)));
    // la même clé peut être affichée deux fois (doublons) : le site coche alors tous les exemplaires ensemble
    if (!cles.size) return retirees;
    await modeSelection(true);
    await viderSelection();
    for (const el of cartesDom()) if (estSelectionnee(el) !== cles.has(cle(lireCarte(el)))) await basculer(el);
    const ecarts = cartesDom().filter((el) => estSelectionnee(el) !== cles.has(cle(lireCarte(el))));
    if (ecarts.length) throw new Error(`Sélection incohérente pour le retrait de « ${A_TRAITER} » (${ecarts.length} carte(s) cochée(s) à tort ou oubliée(s), dont « ${ecarts[0].h.textContent.trim()} ») : rien n'a été retiré.`);
    const nb = cartesDom().filter(estSelectionnee).length;
    if (!nb) throw new Error('Impossible de sélectionner les cartes pour le retrait de « ' + A_TRAITER + ' ».');
    const avant = empreinte();
    const bilan = await retirerEtiquette(A_TRAITER);
    // le site garde la sélection (parfois des cartes qui ont quitté la vue) : on quitte le mode pour la vider
    await modeSelection(false);
    await attendre(() => empreinte() !== avant && !enChargement(), 30000);
    await attendrePageStable();
    // les cartes retirées ont quitté la vue ; sinon le retrait n'a pas pris, et rien n'est noté comme fait
    if (cartesDom().some((el) => cles.has(cle(lireCarte(el))))) throw new PanneSite('Le site affiche encore des cartes dont « ' + A_TRAITER + ' » devait être retirée.');
    for (const k of cles) fait.add(k + '§-' + A_TRAITER);
    retirees += nb;
    journal(`  retrait de ${A_TRAITER} → ${bilan != null ? bilan + ' retirée(s)' : nb + ' carte(s)'}`);
  }
};

// Applique, sur la page affichée, les étiquettes prévues pour les cartes visibles.
// plan : Map(clé → [étiquettes]) ; fait : Set('clé§étiquette')
// Revient à la page « num » (le site peut revenir à la page 1 après un étiquetage).
const allerA = async (num) => {
  for (let i = 0; i < 300; i++) {
    arret();
    if (!pageInfo()) await attendre(() => pageInfo(), 20000);
    const pi = pageInfo();
    if (!pi) { if (num === 1) return; throw new PanneSite('Pagination introuvable : impossible de revenir à la page ' + num + '.'); }
    if (pi[0] === num) return;
    if (!(await changerPage(pi[0] < num ? 1 : -1))) throw new PanneSite('Impossible de revenir à la page ' + num + '.');
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
    // Le moins de clics : plus de la moitié de la page à poser (fréquent en rangement groupé) → « Tout sélectionner (page) »
    // puis on décoche les autres ; sinon, une carte par clic.
    const visibles = cartesDom();
    const aCocher = visibles.filter((el) => cles.has(cle(lireCarte(el)))).length;
    const tout = bouton(/^Tout sélectionner \(page\)$/);
    if (tout && 1 + (visibles.length - aCocher) < aCocher) { tout.click(); await sleep(300); }
    for (const el of cartesDom()) if (cles.has(cle(lireCarte(el))) !== estSelectionnee(el)) await basculer(el);
    // vérification carte par carte : chaque carte cochée est prévue, chaque carte prévue est cochée
    const nb = cartesDom().filter(estSelectionnee).length;
    const ecarts = cartesDom().filter((el) => estSelectionnee(el) !== cles.has(cle(lireCarte(el))));
    if (ecarts.length) throw new Error(`Sélection incohérente pour « ${tag} » (${ecarts.length} carte(s) cochée(s) à tort ou oubliée(s), dont « ${ecarts[0].h.textContent.trim()} ») : rien n'a été posé.`);
    if (!nb) throw new Error('Impossible de sélectionner les cartes pour « ' + tag + ' ».');
    const avantTag = empreinte();
    const bilan = await poserEtiquette(tag);
    for (const k of cles) fait.add(k + '§' + tag);
    poses += nb;
    journal(`  ${tag} → ${bilan ? `${bilan.poses} posée(s)${bilan.deja ? `, ${bilan.deja} déjà là` : ''}` : nb + ' carte(s)'}`);
    await attendrePageStable();
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

const estMarquee = (c) => (c.tags || []).includes(A_TRAITER);

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
  const marquee = estMarquee(c);
  // une carte déjà marquée « !À traiter » ne reçoit rien tant que les règles ne lui trouvent pas de domaine
  const tags = marquee && !doms.length ? [] : [...new Set([...doms, ...coll, ...gestion])];
  if (!marquee && !doms.length && r.statut === 'a_traiter') tags.push(A_TRAITER);
  const statut = doms.length ? 'classee' : r.statut === 'a_traiter' ? 'a_traiter' : r.statut;
  return { tags, statut, source: r.source, retirer: marquee && !!doms.length };
};

// ── Rangement groupé, pour un gros stock de cartes à ranger ──
// La barre de recherche du site trouve une sous-chaîne du titre ou de la description, sans casse ni accents,
// et se combine avec « Sans étiquette ». Pour chaque domaine (première étiquette des cartes), on retient les mots
// qui ramènent le plus de cartes de ce domaine, tant qu'un mot en ramène au moins MOTS_MIN_CARTES
// et que les autres cartes trouvées (les intrus, jamais cochées) restent minoritaires.
// Mesuré le 2026-10-12 : ≈ ×1,5 plus rapide sur 1 100 cartes ; rien à gagner sur quelques dizaines.
const SEUIL_RANGEMENT_GROUPE = 200;
const MOTS_MIN_CARTES = 5;
const MOTS_PRECISION = 0.6;
const motsGroupes = (cartes, plans) => {
  const textes = new Map(cartes.map((c) => [cle(c), norm(c.t + '\n' + c.d)]));
  const tete = (c) => plans.get(cle(c)).tags[0];
  // index des groupes de 4 lettres : on ne teste un mot que sur les cartes qui contiennent son début
  const index = new Map();
  for (const c of cartes) {
    const tx = textes.get(cle(c));
    for (let i = 0; i + 4 <= tx.length; i++) { const g = tx.slice(i, i + 4); if (!index.has(g)) index.set(g, new Set()); index.get(g).add(c); }
  }
  const groupes = new Map();
  for (const c of cartes) if (tete(c)) { if (!groupes.has(tete(c))) groupes.set(tete(c), []); groupes.get(tete(c)).push(c); }
  const choix = [];
  for (const [dom, groupe] of [...groupes].sort((a, b) => b[1].length - a[1].length)) {
    // candidats : les mots de 4 lettres ou plus, et leurs débuts de 6 lettres ou plus (« footballe » → footballeur, footballeuse)
    const candidats = new Set();
    for (const c of groupe) for (const w of textes.get(cle(c)).split(/[^a-z0-9'-]+/)) {
      const m = w.replace(/^['-]+|['-]+$/g, '');
      if (m.length < 4) continue;
      candidats.add(m);
      for (let n = 6; n < m.length; n++) candidats.add(m.slice(0, n));
    }
    const mesures = [...candidats].map((mot) => {
      const trouvees = [...(index.get(mot.slice(0, 4)) || [])].filter((c) => textes.get(cle(c)).includes(mot));
      return { mot, cles: trouvees.filter((c) => tete(c) === dom).map(cle), total: trouvees.length };
    }).filter((x) => x.cles.length >= MOTS_MIN_CARTES && x.cles.length / x.total >= MOTS_PRECISION);
    const reste = new Set(groupe.map(cle));
    for (;;) {
      let mieux = null;
      for (const x of mesures) {
        const n = x.cles.filter((k) => reste.has(k)).length;
        const intrus = x.total - x.cles.length;
        if (!mieux || n > mieux.n || (n === mieux.n && intrus < mieux.intrus)) mieux = { ...x, n, intrus };
      }
      if (!mieux || mieux.n < MOTS_MIN_CARTES) break;
      mieux.cles.forEach((k) => reste.delete(k));
      choix.push({ dom, mot: mieux.mot, cles: mieux.cles, n: mieux.n });
    }
  }
  return choix;
};

// ── Suggestions : les mots que les règles ne connaissent pas encore ──
// Sur les cartes restées sans domaine (sans étiquette, ou « !À traiter ») que les règles ne rangent pas,
// on compte les mots et les expressions de 2 à 3 mots. Le domaine proposé est celui que portent les cartes
// déjà étiquetées qui les contiennent. Rien n'est posé : la personne choisit, Claude écrit la règle dans regles.js.
const SUGG_MIN_CARTES = 3;
const SUGG_MIN_ETIQUETEES = 5;
const SUGG_MAX = 50;
const SUGG_MAJORITE = 0.7;
const SUGG_NOUVELLE = 30;
const MOTS_VIDES = new Set(('a au aux avec ce ces cet cette dans de des du elle elles en entre est et il ils la le les leur leurs '
  + 'ou par pas pour qu que qui sa sans se ses son sur un une ancien ancienne anciens anciennes ne nee mort morte situe situee dont lors').split(' '));
const PAS_SUGGERER_RE = PAS_SUGGERER.map(kwRegex);
// Les mots d'une carte (sa description, sinon son titre) : clé sans accents → forme affichée.
const ngrammes = (c) => {
  const mots = ((c.d && c.d.trim()) || c.t).toLowerCase().replace(/[’`]/g, "'")
    .split(/[^\p{L}\p{N}-]+/u).map((m) => m.replace(/^-+|-+$/g, '')).filter(Boolean);
  const vide = (m) => m.length < 3 || MOTS_VIDES.has(norm(m));
  const out = new Map();
  for (let i = 0; i < mots.length; i++) {
    for (let n = 1; n <= 3 && i + n <= mots.length; n++) {
      const g = mots.slice(i, i + n);
      if (/^\d+$/.test(g[n - 1])) break;
      if (vide(g[0]) || vide(g[n - 1])) continue;
      out.set(norm(g.join(' ')), g.join(' '));
    }
  }
  return out;
};
const couvre = (re, k) => { re.lastIndex = 0; const m = re.exec(k); return !!m && m.index === 0 && m[0].length === k.length; };
const dejaConnu = (k) => scan(k).some((h) => couvre(kwRegex(h.kw), k)) || PAS_SUGGERER_RE.some((re) => couvre(re, k));

const suggestions = (cartes) => {
  const compteur = { sansEtiquette: 0, rangeables: 0, inconnues: 0, aTraiter: 0, ignorees: 0, marqueesATraiter: 0 };
  const sansRegle = [], ambigues = [], etiquetees = [];
  for (const c of cartes) {
    if (c.tags.some((t) => DOMAINES[t])) { etiquetees.push(c); continue; }
    const marquee = c.tags.includes(A_TRAITER);
    if (c.tags.length && !marquee) continue; // seulement une étiquette de gestion ou de nationalité : hors objectif
    const { statut } = classer(c);
    if (marquee) compteur.marqueesATraiter++;
    else { compteur.sansEtiquette++; compteur[{ classee: 'rangeables', inconnue: 'inconnues', a_traiter: 'aTraiter', ignoree: 'ignorees' }[statut]]++; }
    if (statut === 'inconnue') sansRegle.push(c);
    if (statut === 'a_traiter') ambigues.push(c);
  }
  const cibles = [...sansRegle, ...ambigues];
  const parMot = new Map();
  for (const c of cibles) {
    for (const [k, mot] of ngrammes(c)) {
      if (!parMot.has(k)) parMot.set(k, { mot, cartes: [] });
      parMot.get(k).cartes.push(c);
    }
  }
  const retenus = new Map([...parMot].filter(([k, x]) => x.cartes.length >= SUGG_MIN_CARTES && !dejaConnu(k)));
  // une expression n'apporte rien quand un de ses mots (ou une expression plus courte) est déjà proposé
  const tous = new Set(retenus.keys());
  for (const k of tous) {
    const m = k.split(' ');
    for (let n = 1; n < m.length; n++) for (let i = 0; i + n <= m.length; i++) if (tous.has(m.slice(i, i + n).join(' '))) retenus.delete(k);
  }
  const doms = new Map([...retenus.keys()].map((k) => [k, { n: 0, par: {} }]));
  for (const c of etiquetees) {
    for (const k of ngrammes(c).keys()) {
      const x = doms.get(k);
      if (!x) continue;
      x.n++;
      for (const t of c.tags) if (DOMAINES[t]) x.par[t] = (x.par[t] || 0) + 1;
    }
  }
  const candidats = [...retenus].map(([k, { mot, cartes: cs }]) => {
    const { n: etiq, par } = doms.get(k);
    const [tete, nb] = Object.entries(par).sort((a, b) => b[1] - a[1])[0] || [null, 0];
    const part = etiq ? nb / etiq : 0;
    const dom = etiq >= SUGG_MIN_ETIQUETEES && part >= SUGG_MAJORITE ? tete : null;
    return { mot, n: cs.length, dom, tete, part, etiquetees: etiq, nouvelle: !dom && cs.length >= SUGG_NOUVELLE, exemples: cs.slice(0, 3) };
  }).sort((a, b) => b.n - a.n || a.mot.localeCompare(b.mot)).slice(0, SUGG_MAX);
  return { compteur, candidats, sansRegle, ambigues };
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
      // étiquette de métier, de lieu… : son domaine la remplace (décidé avec la personne le 2026-10-13, le détail se perd)
      else if (def.d.length) { if (!def.d.some((d) => p.tags.includes(d))) bloque.push({ c, pourquoi: 'domaine ' + def.d.join(' ou ') + ' absent' }); }
      // nationalité, ou étiquette non prévue : seule la barre de recherche la remplace, il faut donc son mot sur la carte
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
textarea{width:100%;background:#0e100f;color:#cfd4d1;border:1px solid #2a2e2c;border-radius:6px;padding:6px;font-family:ui-monospace,monospace;font-size:11px;margin-bottom:8px}
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
        <button class="b" data-a="suggestions">Suggestions</button>
        <button class="b" data-a="completer">Compléter les cartes rangées</button>
        <button class="b" data-a="doublons">Doublons</button>
        <button class="b" data-a="migration">Migration (une fois)</button>
        <button class="b d" data-a="stop" disabled>Arrêter</button>
        <button class="b" data-a="bugs">Journal des bugs</button>
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
  root.querySelector('[data-a=ranger]').onclick = () => lancer(() => modeRanger(false), { etape: 'lecture', tout: false });
  root.querySelector('[data-a=suggestions]').onclick = () => lancer(modeSuggestions);
  root.querySelector('[data-a=completer]').onclick = () => lancer(modeCompleter, { etape: 'completer-lecture' });
  root.querySelector('[data-a=doublons]').onclick = () => lancer(modeDoublons);
  root.querySelector('[data-a=migration]').onclick = () => lancer(modeMigration);
  root.querySelector('[data-a=bugs]').onclick = afficherBugs;
  majBoutonBugs();
  proposerReprise();
};

// Lance un mode. reprise ({ etape, tout }) : en cas de raté du site (PanneSite), la page est rechargée
// et l'étape reprend toute seule (proposerReprise), MAX_RECHARGEMENTS fois au plus ; ensuite, arrêt avec un message.
const lancer = async (fn, reprise = null) => {
  STOP = false; ui.occupe(true); ui.log.textContent = ''; montrer(ui.log, false);
  try {
    await fn();
    store.set('ranger_reprise', null);
  } catch (e) {
    if (STOP) { ui.statut('⚠️ ' + e.message); return; }
    // On compte les rechargements successifs SANS progrès : une pose depuis le dernier remet le compte à zéro.
    // Un plafond par séance évite de boucler sur un site qui ne tient jamais longtemps.
    const r = reprise && store.get('ranger_reprise', null);
    const meme = r && r.etape === reprise.etape;
    const poses = ['ranger_fait', 'ranger_fait_m', 'completer_fait'].reduce((n, k) => n + (store.get(k, []) || []).length, 0);
    const essais = meme && poses <= (r.poses || 0) ? r.essais : 0;
    const total = meme ? r.total || r.essais : 0;
    if (reprise && e instanceof PanneSite && essais < MAX_RECHARGEMENTS && total < MAX_RECHARGEMENTS_SEANCE) {
      noterBug(e, `rechargement automatique ${essais + 1}/${MAX_RECHARGEMENTS}`);
      store.set('ranger_reprise', { ...reprise, essais: essais + 1, total: total + 1, poses, at: Date.now() });
      ui.statut(`Le site a eu un raté : rechargement de la page puis reprise automatique (${essais + 1}/${MAX_RECHARGEMENTS})…\n${e.message}`);
      setTimeout(rechargerPage, 1500 * ECHELLE);
      return;
    }
    store.set('ranger_reprise', null);
    const n = total >= MAX_RECHARGEMENTS_SEANCE ? total : essais;
    noterBug(e, n ? `arrêt après ${n} rechargement(s)` : 'arrêt');
    ui.statut('⚠️ ' + e.message + (n ? ` Le site a été rechargé ${n} fois sans succès : attends quelques minutes avant de relancer, ce qui est fait reste fait.` : ''));
  } finally {
    STOP = false; ui.occupe(false);
    try { await modeSelection(false); } catch (e) { /* rien */ }
  }
};

// ── Journal des bugs : gardé dans le navigateur, à copier pour Claude ──
const noterBug = (e, contexte) => {
  const pi = pageInfo();
  const filtre = document.querySelector('button[aria-label="Filtrer par étiquette"]')?.innerText.trim() || '?';
  const bugs = store.get('bugs', []);
  bugs.push({
    quand: new Date().toLocaleString(), version: VERSION, contexte, message: e.message,
    code: String(e.stack || '').split('\n').slice(0, 4).map((s) => s.trim()).join(' ← '),
    page: `${location.pathname} · Filtre : ${filtre} · Recherche : « ${champRecherche()?.value || ''} » · Pagination : ${pi ? pi.join(' / ') : 'absente'}`
      + ` · ${cartesDom().length} carte(s) affichée(s)${enChargement() ? ' · en chargement' : ''}${echecChargement() ? ' · « chargement a échoué » affiché' : ''}`
      + `${fenetreOuverte() ? ' · fenêtre « Appliquer une étiquette » ouverte' : ''}${enSelection() ? ' · mode sélection' : ''}`,
    journal: ui ? ui.log.textContent.trim().split('\n').filter(Boolean).slice(-25) : [],
  });
  store.set('bugs', bugs.slice(-30));
  majBoutonBugs();
};
const texteBugs = () => store.get('bugs', []).map((b, i) => [
  `#${i + 1} — ${b.quand} — ${b.contexte}`,
  `Version : ${b.version}`,
  `Erreur : ${b.message}`,
  `Page : ${b.page}`,
  `Code : ${b.code}`,
  'Journal :', ...b.journal.map((l) => '  ' + l),
].join('\n')).join('\n\n');
const majBoutonBugs = () => {
  const b = ui && ui.root.querySelector('[data-a=bugs]');
  const n = store.get('bugs', []).length;
  if (b) b.textContent = 'Journal des bugs' + (n ? ` (${n})` : '');
};
// Le bouton du panneau ([data-copier]) copie le texte de sa zone (le premier textarea) ; sinon le texte est sélectionné pour Ctrl+C.
const brancherCopie = (t, ok, zone = 'textarea', bouton = '[data-copier]') => {
  const ta = ui.out.querySelector(zone);
  const copier = ui.out.querySelector(bouton);
  if (copier) copier.onclick = () => {
    const echec = () => { ta.select(); ui.statut('Copie impossible ici : le texte est sélectionné, fais Ctrl+C.'); };
    try { navigator.clipboard.writeText(t).then(() => ui.statut(ok), echec); } catch (e) { echec(); }
  };
};
const afficherBugs = () => {
  const t = texteBugs();
  ui.out.innerHTML = '<h4>Journal des bugs</h4>' + (t ? `<p class="hint">Copie ce texte et colle-le dans la conversation avec Claude.</p>
    <textarea readonly rows="12">${esc(t)}</textarea>
    <div class="row"><button class="b p" data-copier>Copier</button><button class="b d" data-vider>Vider le journal</button></div>`
    : '<p class="hint">Aucun bug noté.</p>');
  brancherCopie(t, 'Journal copié : colle-le dans la conversation avec Claude.');
  const vider = ui.out.querySelector('[data-vider]');
  if (vider) vider.onclick = () => { store.set('bugs', []); majBoutonBugs(); afficherBugs(); };
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
// Si les règles ont changé depuis cette date (nouvelle version, regles.js modifié), toutes les cartes
// sans étiquette sont relues : les anciennes que les nouvelles règles savent ranger ne restent pas de côté.
const EMPREINTE_REGLES = (() => {
  const s = JSON.stringify([DOMAINES, AMBIGUS, IGNORER, COLLECTIONS, SEULEMENT_EN_PREMIER, MOTIFS_DE_TITRE, MAX_DOMAINES, A_TRAITER, FEMININS]) + classer + scan + kwRegex;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h.toString(36);
})();
const retenirDepuis = (date) => { store.set('ranger_depuis', date); store.set('ranger_regles', EMPREINTE_REGLES); };
const modeRanger = async (tout = false) => {
  const changees = !tout && store.get('ranger_depuis', null) && store.get('ranger_regles', null) !== EMPREINTE_REGLES;
  const depuis = tout || changees ? null : store.get('ranger_depuis', null);
  let cartes, viaApi = true;
  ui.statut(depuis ? `Lecture des cartes obtenues depuis le ${new Date(depuis).toLocaleString()}…`
    : `${changees ? 'Les règles ont changé : l' : 'L'}ecture de toutes les cartes sans étiquette (≈ 1 min 30, garde l'onglet ouvert)…`);
  try {
    cartes = await lireApi({ sort: 'added', untagged: '1' }, { depuis, progression: (n, tot) => ui.statut(`Lecture : ${n}${tot ? ' / ' + tot : ''} carte(s)…`) });
  } catch (e) {
    // serveur en erreur : mieux vaut recharger la page et relire (lancer s'en charge) que lire 20 min par l'écran
    if (STOP || e instanceof PanneSite) throw e;
    viaApi = false;
    noterBug(e, 'lecture rapide indisponible, lecture par l\'écran');
    ui.journal('Lecture rapide indisponible (' + e.message + ') : lecture par l\'écran.');
    await choisirFiltre('');
    cartes = await lireVue((p) => ui.statut(`Lecture des cartes sans étiquette : page ${p}…`));
    await choisirFiltre(null);
  }
  // Les cartes marquées « !À traiter » sont relues à chaque fois : les règles ont pu les rattraper depuis.
  let marquees = [];
  if (viaApi) marquees = await lireMarquees();
  ui.statut(`Classement de ${cartes.length + marquees.length} carte(s)…`);
  await sleep(50);
  const toutes = [...cartes, ...marquees];
  store.set('ranger_lecture', { at: Date.now(), depuis, viaApi, cartes: toutes });
  afficherRanger(toutes, depuis, viaApi);
};

// Les cartes qui portent !À traiter (API, filtrée par l'id de l'étiquette, lu dans les options de `stats`).
// Un id introuvable ou une lecture ratée ne bloque pas le rangement ordinaire : on le note et on continue sans elles.
const idEtiquette = async (nom) => {
  const j = await lireUrl('/api/my-collection/stats');
  const o = (Array.isArray(j.tagOptions) ? j.tagOptions : []).find((x) => (x.name ?? x.tag?.name) === nom);
  return o ? (o.id ?? o.tag_id ?? o.tag?.id ?? null) : null;
};
const lireMarquees = async () => {
  try {
    ui.statut(`Lecture des cartes marquées « ${A_TRAITER} »…`);
    const id = await idEtiquette(A_TRAITER);
    if (id == null) return [];
    return (await lireApi({ sort: 'added', tag_id: String(id) })).filter(estMarquee);
  } catch (e) {
    if (STOP || e instanceof PanneSite) throw e;
    noterBug(e, `lecture des cartes « ${A_TRAITER} » impossible`);
    ui.journal(`Cartes « ${A_TRAITER} » non lues (${e.message}) : rangement ordinaire seulement.`);
    return [];
  }
};

// Ce que le mode Ranger fera d'une lecture : le même calcul pour l'aperçu et pour une reprise après rechargement.
// neuves : cartes sans étiquette ; marquees : cartes !À traiter que les règles rangent maintenant (domaine puis retrait).
const preparerRanger = (cartes, depuis) => {
  const plans = new Map(cartes.map((c) => [cle(c), planCarte(c)]));
  const cibles = cartes.filter((c) => plans.get(cle(c)).tags.length);
  const neuves = cibles.filter((c) => !estMarquee(c));
  const marquees = cibles.filter(estMarquee);
  const plusRecente = cartes.filter((c) => !estMarquee(c)).reduce((m, c) => (c.obtenu && c.obtenu > m ? c.obtenu : m), depuis || '');
  // gros stock : d'abord des recherches qui rangent les cartes par groupes, puis page par page
  const groupes = neuves.length >= SEUIL_RANGEMENT_GROUPE ? motsGroupes(cartes.filter((c) => !estMarquee(c)), plans) : [];
  return { plans, cibles, neuves, marquees, plusRecente, groupes };
};
const oublierFait = () => { store.set('ranger_fait', null); store.set('ranger_fait_m', null); };
// Applique une lecture enregistrée (store « ranger_lecture »), au clic sur « Appliquer » ou en reprise automatique.
const appliquerLecture = async (l) => {
  const { plans, cibles, plusRecente, groupes } = preparerRanger(l.cartes, l.depuis);
  await appliquerRanger(cibles, plans, groupes);
  store.set('lecture2_perimee', true);
  if (l.viaApi && plusRecente) retenirDepuis(plusRecente);
  store.set('ranger_lecture', null);
  oublierFait();
};

const afficherRanger = (cartes, depuis, viaApi) => {
  const { plans, cibles, neuves, marquees, plusRecente, groupes } = preparerRanger(cartes, depuis);
  const groupees = groupes.reduce((s, g) => s + g.n, 0);
  const nbMarquees = cartes.filter(estMarquee).length;
  ui.statut(`${cartes.length - nbMarquees} carte(s) ${depuis ? 'nouvelle(s)' : 'sans étiquette'}, dont ${neuves.length} à ranger.`
    + (nbMarquees ? ` Et ${nbMarquees} marquée(s) « ${A_TRAITER} », dont ${marquees.length} que les règles rangent maintenant.` : ''));
  ui.out.innerHTML = (groupes.length ? `<h4>Rangement groupé</h4>
      <p class="hint">Beaucoup de cartes à ranger : ${groupes.length} recherche(s) en rangent d'abord ${groupees} par groupes, puis le reste page par page.</p>
      ${listeCartes('Recherches prévues', groupes.map((g) => ({ t: `« ${g.mot} » → #${g.dom}`, d: `${g.n} carte(s)` })))}` : '')
    + (marquees.length ? `<h4>Cartes « ${A_TRAITER} » rangées</h4>
      <div>${marquees.length} carte(s) : leur domaine, puis retrait de ${A_TRAITER} (et seulement elle)</div>
      ${listeCartes('Cartes concernées', marquees)}` : '')
    + resumePlan(cartes, plans) + `<div class="row" style="margin-top:12px">
      ${cibles.length ? '<button class="b p" data-go>Appliquer</button>' : ''}
      ${depuis ? '<button class="b" data-tout>Revoir toutes les cartes sans étiquette</button>' : ''}</div>`;
  if (!cibles.length) { // rien à poser : ces cartes ne seront plus relues
    if (viaApi && plusRecente) retenirDepuis(plusRecente);
    store.set('ranger_lecture', null);
  }
  const go = ui.out.querySelector('[data-go]');
  if (go) go.onclick = () => {
    go.remove();
    oublierFait();
    lancer(() => appliquerLecture({ cartes, depuis, viaApi }), { etape: 'application' });
  };
  const tt = ui.out.querySelector('[data-tout]');
  if (tt) tt.onclick = () => lancer(() => modeRanger(true), { etape: 'lecture', tout: true });
};

// Au chargement du panneau : reprendre tout seul après un rechargement demandé par le script (lancer),
// sinon proposer de reprendre une lecture interrompue.
const proposerReprise = () => {
  const r = store.get('ranger_reprise', null);
  const lu = store.get('ranger_lecture', null);
  const completer = r && /^completer/.test(r.etape);
  if (r && Date.now() - r.at < 15 * 60e3 && (r.etape === 'lecture' || completer || lu)) {
    montrer(ui.$('.pan'), true);
    lancer(async () => {
      ui.journal(`Reprise automatique après rechargement de la page (${r.essais}/${MAX_RECHARGEMENTS}).`);
      // la page vient d'être rechargée : attendre qu'elle affiche ses cartes
      if (!(await attendre(() => document.querySelector('button[aria-label="Filtrer par étiquette"]') && cartesDom().length && !enChargement(), 60000))) {
        verifierChargement();
        throw new PanneSite('La page Collection ne s\'est pas affichée après le rechargement.');
      }
      if (r.etape === 'lecture') await modeRanger(r.tout);
      else if (r.etape === 'completer-lecture') await modeCompleter();
      else if (r.etape === 'completer') await appliquerCompleter(store.get('completer_lecture', null));
      else await appliquerLecture(lu);
    }, { etape: r.etape, tout: r.tout });
    return;
  }
  const l = lu;
  if (!l || !l.cartes || Date.now() - l.at > 6 * 3600e3) return;
  ui.out.innerHTML = `<p class="hint">Une lecture de ${l.cartes.length} carte(s) faite à ${new Date(l.at).toLocaleTimeString()} n'a pas encore été appliquée.</p>
    <div class="row"><button class="b p" data-reprise>Reprendre cette lecture</button></div>`;
  ui.out.querySelector('[data-reprise]').onclick = () => lancer(async () => { afficherRanger(l.cartes, l.depuis, l.viaApi); });
};

// Pose, dans la vue (petite) de chaque domaine « tête », les étiquettes prévues pour ses cartes.
// parTete : Map(domaine → Map(clé de carte → [étiquettes à poser])). Les cartes restent dans leur vue : la pagination ne bouge pas.
const poserParVues = async (parTete, fait, noter, libelle) => {
  let i = 0;
  for (const [tete, plan] of parTete) {
    arret();
    i++;
    ui.statut(`${libelle} : #${tete} (${i}/${parTete.size}) — ${plan.size} carte(s)`);
    await choisirFiltre(tete);
    await choisirTri('Date d\'ajout');
    const enAttente = () => [...plan].some(([k, tags]) => tags.some((t) => !fait.has(k + '§' + t)));
    await parcourirVue(async (num) => {
      await appliquerSurPage(plan, fait, noter(`#${tete} p${num} `), num);
      return enAttente();
    });
  }
};

const appliquerRanger = async (cibles, plans, groupes = []) => {
  // Passe 0 (gros stock seulement) : recherches groupées, voir motsGroupes.
  // Passe 1 : dans « Sans étiquette », chaque carte reçoit sa première étiquette.
  // Les cartes rangées disparaissent de la vue et les suivantes remontent : on reste sur la page
  // tant qu'elle contient des cartes à ranger, puis on avance.
  const premier = new Map(), suite = new Map();
  const marquees = cibles.filter(estMarquee); // traitées à part, dans la vue « #!À traiter » (passe 3)
  for (const c of cibles.filter((x) => !estMarquee(x))) {
    const tags = plans.get(cle(c)).tags;
    premier.set(cle(c), [tags[0]]);
    if (tags.length > 1) suite.set(cle(c), { tete: tags[0], reste: tags.slice(1) });
  }
  // ce qui est posé est enregistré au fil de l'eau : une reprise après rechargement repart de là
  const fait = new Set(store.get('ranger_fait', []));
  // appliquerSurPage appelle le journal juste après chaque pose, « fait » à jour
  const noter = (prefixe) => (t) => { ui.journal(prefixe + t); store.set('ranger_fait', [...fait]); };
  const restants = () => [...premier.keys()].filter((k) => !fait.has(k + '§' + premier.get(k)[0])).length;
  await choisirFiltre('');
  await choisirTri('Date d\'ajout');
  let abandons = 0;
  for (const [i, g] of groupes.entries()) {
    arret();
    // seules les cartes du plan sont cochées : les intrus de la recherche restent intacts
    const plan = new Map(g.cles.filter((k) => premier.has(k) && !fait.has(k + '§' + g.dom)).map((k) => [k, [g.dom]]));
    if (!plan.size) continue;
    ui.statut(`Rangement groupé : « ${g.mot} » (${i + 1}/${groupes.length}) — ${plan.size} carte(s) en #${g.dom}`);
    try {
      await rechercher(g.mot);
      abandons = 0;
    } catch (e) {
      // une recherche que le serveur rate à chaque fois : ses cartes seront rangées page par page.
      // Plusieurs de suite : c'est le site qui flanche, on laisse lancer recharger la page.
      if (!(e instanceof PanneSite) || ++abandons >= 3) throw e;
      noterBug(e, `recherche « ${g.mot} » abandonnée`);
      ui.journal(`« ${g.mot} » : recherche impossible, ces cartes seront rangées page par page.`);
      continue;
    }
    await appliquerSurPage(plan, fait, noter(`« ${g.mot} » `));
  }
  if (groupes.length) await rechercher('');
  for (let num = 1; ; ) {
    arret();
    await attendre(() => cartesDom().length > 0 && !enChargement(), 30000);
    await attendrePageStable();
    ui.statut(`Passe 1 : page ${num} — reste ${restants()} carte(s)`);
    await appliquerSurPage(premier, fait, noter(`p${num} `), num);
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
  await poserParVues(parTete, fait, noter, 'Passe 2');
  // Passe 3 : les cartes « !À traiter » que les règles rangent maintenant. Dans leur vue, d'abord leurs domaines,
  // puis (dans cet ordre : si la pose échoue, la carte garde son repère) le retrait de !À traiter, et de lui seul.
  // Compte à part (« ranger_fait_m ») : une carte sans étiquette qui a la même clé ne doit pas la faire croire rangée.
  const faitM = new Set(store.get('ranger_fait_m', []) || []);
  const noterM = (prefixe) => (t) => { ui.journal(prefixe + t); store.set('ranger_fait_m', [...faitM]); };
  const planM = new Map(marquees.map((c) => [cle(c), plans.get(cle(c)).tags]));
  const aFaireM = () => marquees.filter((c) => !faitM.has(cle(c) + '§-' + A_TRAITER)).length;
  if (marquees.length && aFaireM()) {
    arret();
    ui.statut(`Passe 3 : ${A_TRAITER} — ${aFaireM()} carte(s) à ranger puis à débarrasser de son repère`);
    await choisirFiltre(A_TRAITER);
    await parcourirVue(async (num) => { await appliquerSurPage(planM, faitM, noterM(`${A_TRAITER} p${num} `), num); });
    const prets = new Set(marquees.filter((c) => planM.get(cle(c)).every((t) => faitM.has(cle(c) + '§' + t))).map(cle));
    // les cartes retirées quittent la vue et les suivantes remontent : on reste sur la page tant qu'elle en contient
    await retourDebut();
    for (let num = 1; ; num++) {
      arret();
      await attendre(() => cartesDom().length > 0 && !enChargement(), 30000);
      await attendrePageStable();
      await retirerSurPage(prets, faitM, noterM(`${A_TRAITER} p${num} `));
      if (!aFaireM() || cartesDom().length < PAR_PAGE) break;
      if (!(await changerPage(1))) break;
    }
  }
  await choisirFiltre(null);
  const manquent = cibles.filter((c) => estMarquee(c)
    ? planM.get(cle(c)).some((t) => !faitM.has(cle(c) + '§' + t)) || !faitM.has(cle(c) + '§-' + A_TRAITER)
    : plans.get(cle(c)).tags.some((t) => !fait.has(cle(c) + '§' + t)));
  ui.statut(manquent.length ? `Terminé, mais ${manquent.length} carte(s) non traitée(s) entièrement : relance « Ranger les nouvelles cartes ».` : `✅ ${cibles.length} carte(s) rangée(s).`);
};

// ── Mode Suggestions ──
// Même lecture de la collection que Migration (« lecture2 ») ; un « Appliquer » de Ranger ou de Migration la rend périmée.
const lireCollection = async () => {
  let toutes;
  try {
    toutes = await lireApi({ sort: 'rarity' }, { progression: (n, tot) => ui.statut(`Lecture de la collection : ${n}${tot ? ' / ' + tot : ''} cartes…`) });
  } catch (e) {
    if (STOP || e instanceof PanneSite) throw e;
    throw new Error(`Lecture de la collection impossible (${e.message}). Ce mode a besoin de la lecture rapide : réessaie dans quelques minutes.`);
  }
  const cartes = {}, membres = {};
  for (const c of toutes) {
    cartes[cle(c)] = c;
    for (const t of c.tags) if (!NOUVELLES.has(t) && !(membres[t] = membres[t] || []).includes(cle(c))) membres[t].push(cle(c));
  }
  const lecture = { at: Date.now(), cartes, membres };
  store.set('lecture2', lecture);
  store.set('lecture2_perimee', false);
  return lecture;
};
// Une lecture par l'écran (repli de Migration) ne voit que 2 étiquettes par carte : inutilisable ici.
const lectureComplete = (l) => Object.values(l.cartes).every((c) => Array.isArray(c.tags) && !('plus' in c));
const modeSuggestions = async () => {
  const lecture = store.get('lecture2', null);
  if (!lecture || !lectureComplete(lecture)) return afficherSuggestions(await lireCollection());
  const perimee = store.get('lecture2_perimee', false);
  ui.statut('');
  ui.out.innerHTML = `<h4>Suggestions</h4>
    <p class="hint">Lecture de la collection du ${new Date(lecture.at).toLocaleString()}${perimee ? ' : des étiquettes ont été posées depuis, mieux vaut la relire' : ''}.</p>
    <div class="row"><button class="b${perimee ? '' : ' p'}" data-reutiliser>Réutiliser cette lecture</button>
      <button class="b${perimee ? ' p' : ''}" data-relire>Relire${perimee ? ' (recommandé)' : ''} (≈ 2 min)</button></div>`;
  ui.out.querySelector('[data-reutiliser]').onclick = () => afficherSuggestions(lecture);
  ui.out.querySelector('[data-relire]').onclick = () => lancer(async () => afficherSuggestions(await lireCollection()));
};
const afficherSuggestions = (lecture) => {
  const { compteur: k, candidats, sansRegle, ambigues } = suggestions(Object.values(lecture.cartes));
  const pct = (x) => Math.round(x * 100) + ' %';
  const domaine = (c) => (c.dom ? `${c.dom} (${pct(c.part)})` : (c.nouvelle ? 'nouvelle étiquette ?' : '?') + (c.tete ? ` (${c.tete} ${pct(c.part)})` : ''));
  const exemple = (x) => x.t + (x.d ? ' — ' + x.d : '');
  const resume = `${k.sansEtiquette} sans étiquette : ${k.inconnues} sans règle · ${k.aTraiter} à traiter · ${k.ignorees} ignorée(s) · ${k.rangeables} que Ranger peut déjà ranger. `
    + `Et ${k.marqueesATraiter} portent « !À traiter ».`;
  const copie = [`Suggestions WikiMasters v${VERSION}, lecture du ${new Date(lecture.at).toLocaleString()}`, resume, '',
    ...candidats.map((c) => `${c.mot} — ${c.n} cartes — ${domaine(c)} — ex. : ${c.exemples.map(exemple).join(' ; ')}`)].join('\n');
  const cartes = [`Cartes sans règle (${sansRegle.length}) :`, ...sansRegle.map(exemple), '',
    `Cartes avec un mot ambigu seul (${ambigues.length}) :`, ...ambigues.map(exemple)].join('\n');
  ui.statut(`${Object.keys(lecture.cartes).length} cartes lues, ${candidats.length} mot(s) à proposer.`);
  ui.out.innerHTML = `<h4>Cartes sans domaine</h4><div>${esc(resume)}</div>
    <h4>Mots que les règles ne connaissent pas</h4>
    <p class="hint">Domaine proposé : celui de tes cartes déjà étiquetées qui contiennent ce mot (70 % au moins). Copie la liste pour Claude : il ajoutera aux règles les mots que tu choisis.</p>
    ${candidats.length ? `<table>${candidats.map((c) => `<tr><td><details><summary>${esc(c.mot)} → ${esc(domaine(c))}</summary>${
      c.exemples.map((x) => `<div class="li">${esc(exemple(x))}</div>`).join('')}</details></td><td class="n">${c.n}</td></tr>`).join('')}</table>`
    : `<p class="hint">Aucun mot inconnu ne revient sur ${SUGG_MIN_CARTES} cartes ou plus.</p>`}
    <textarea readonly rows="8">${esc(copie)}</textarea>
    <div class="row"><button class="b p" data-copier>Copier pour Claude</button></div>
    <h4>Toutes les cartes à revoir</h4>
    <p class="hint">Les cartes isolées n'ont aucun mot en commun : copie-les toutes pour Claude, il proposera une règle par groupe.</p>
    <textarea readonly rows="6" data-cartes>${esc(cartes)}</textarea>
    <div class="row"><button class="b" data-copier-cartes>Copier les cartes sans règle (${sansRegle.length + ambigues.length})</button></div>`;
  brancherCopie(copie, 'Liste copiée : colle-la dans la conversation avec Claude.');
  brancherCopie(cartes, 'Cartes copiées : colle-les dans la conversation avec Claude.', '[data-cartes]', '[data-copier-cartes]');
};

// ── Mode Compléter les cartes rangées : les domaines que les règles trouvent en plus ──
// Cartes qui portent déjà au moins un domaine : on leur AJOUTE les domaines que les règles leur trouvent et qu'elles n'ont
// pas, MAX_DOMAINES au total. Jamais de retrait, jamais d'autre étiquette (une carte rangée à la main en #Arts que les règles
// mettent en Musique finit avec les deux). tailles : nombre de cartes par domaine, pour travailler dans la plus petite vue.
const preparerCompleter = (cartes, tailles) => {
  const plan = new Map(), cibles = [], parTete = new Map();
  for (const c of cartes) {
    const ont = c.tags.filter((t) => DOMAINES[t]);
    if (!ont.length || plan.has(cle(c))) continue;
    const place = Math.max(0, MAX_DOMAINES - ont.length);
    const ajouts = planCarte(c).tags.filter((t) => DOMAINES[t] && !ont.includes(t)).slice(0, place);
    if (!ajouts.length) continue;
    plan.set(cle(c), ajouts);
    cibles.push(c);
    const tete = [...ont].sort((a, b) => (tailles[a] || 0) - (tailles[b] || 0))[0];
    if (!parTete.has(tete)) parTete.set(tete, new Map());
    parTete.get(tete).set(cle(c), ajouts);
  }
  return { plan, cibles, parTete };
};
const modeCompleter = async () => {
  const lecture = await lireCollection();
  const toutes = Object.values(lecture.cartes);
  const tailles = {};
  for (const c of toutes) for (const t of c.tags) if (DOMAINES[t]) tailles[t] = (tailles[t] || 0) + 1;
  const { cibles } = preparerCompleter(toutes, tailles);
  const l = { at: Date.now(), tailles, cartes: cibles.map(({ t, d, r, tags }) => ({ t, d, r, tags })) };
  store.set('completer_lecture', l);
  afficherCompleter(l, toutes.filter((c) => c.tags.some((t) => DOMAINES[t])).length);
};
const afficherCompleter = (l, rangees) => {
  const { plan, cibles } = preparerCompleter(l.cartes, l.tailles);
  const parDomaine = {};
  for (const c of cibles) for (const t of plan.get(cle(c))) (parDomaine[t] = parDomaine[t] || []).push(c);
  const lignes = Object.entries(parDomaine).sort((a, b) => b[1].length - a[1].length)
    .map(([t, cs]) => `<tr><td><details><summary>+ #${esc(t)} : ${cs.length} carte${cs.length > 1 ? 's' : ''}</summary>${
      cs.slice(0, 200).map((c) => `<div class="li">${esc(c.t)}</div>`).join('')}</details></td></tr>`).join('');
  ui.statut(cibles.length ? `${cibles.length} carte(s) rangée(s) gagnent un domaine${rangees ? ` (sur ${rangees} qui en ont déjà un)` : ''}.`
    : 'Rien à compléter : toutes tes cartes rangées ont déjà les domaines que les règles leur trouvent.');
  ui.out.innerHTML = (cibles.length ? `<h4>Domaines ajoutés</h4><p class="hint">Rien n'est retiré, et seuls des domaines sont ajoutés (5 au plus par carte).</p><table>${lignes}</table>
    <div class="row" style="margin-top:12px"><button class="b p" data-go>Appliquer</button></div>` : '');
  const go = ui.out.querySelector('[data-go]');
  if (go) go.onclick = () => {
    go.remove();
    store.set('completer_fait', null);
    lancer(() => appliquerCompleter(l), { etape: 'completer' });
  };
};
const appliquerCompleter = async (l) => {
  if (!l || !l.cartes) throw new Error('Aucune lecture à appliquer : relance « Compléter les cartes rangées ».');
  const { plan, cibles, parTete } = preparerCompleter(l.cartes, l.tailles);
  // ce qui est posé est enregistré au fil de l'eau : une reprise après rechargement repart de là
  const fait = new Set(store.get('completer_fait', []) || []);
  const noter = (prefixe) => (t) => { ui.journal(prefixe + t); store.set('completer_fait', [...fait]); };
  await poserParVues(parTete, fait, noter, 'Compléter');
  await choisirFiltre(null);
  store.set('lecture2_perimee', true);
  const manquent = cibles.filter((c) => plan.get(cle(c)).some((t) => !fait.has(cle(c) + '§' + t)));
  if (!manquent.length) store.set('completer_fait', null);
  ui.statut(manquent.length ? `Terminé, mais ${manquent.length} carte(s) non complétée(s), dont « ${manquent[0].t} » : relance « Compléter les cartes rangées ».`
    : `✅ ${cibles.length} carte(s) complétée(s).`);
};

// ── Mode Doublons : chaque exemplaire d'une carte possédée plusieurs fois reçoit !Doublon ──
// Toute la collection est lue (le premier exemplaire est souvent déjà rangé) ; les exemplaires ont la même clé,
// le site les coche donc tous ensemble. Puis une recherche du titre par carte.
const DOUBLON = '!Doublon';
const doublons = (toutes) => {
  const parCle = new Map();
  for (const c of toutes) parCle.set(cle(c), [...(parCle.get(cle(c)) || []), c]);
  return [...parCle.values()].filter((l) => l.length > 1 && l.some((c) => !c.tags.includes(DOUBLON))).map((l) => ({ ...l[0], n: l.length }));
};
const modeDoublons = async () => {
  let toutes;
  try {
    toutes = await lireApi({ sort: 'rarity' }, { progression: (n, tot) => ui.statut(`Lecture de la collection : ${n}${tot ? ' / ' + tot : ''} cartes…`) });
  } catch (e) {
    if (STOP || e instanceof PanneSite) throw e;
    throw new Error(`Lecture de la collection impossible (${e.message}). Réessaie dans quelques minutes.`);
  }
  const liste = doublons(toutes);
  ui.statut(`${toutes.length} cartes lues, ${liste.length} carte(s) en double sans « ${DOUBLON} ».`);
  ui.out.innerHTML = listeCartes('Cartes en double', liste.map((c) => ({ t: `${c.t} (×${c.n})`, d: c.d })))
    + (liste.length ? '<div class="row" style="margin-top:12px"><button class="b p" data-go>Appliquer</button></div>' : '');
  const go = ui.out.querySelector('[data-go]');
  if (go) go.onclick = () => { go.remove(); lancer(() => appliquerDoublons(liste)); };
};
const appliquerDoublons = async (liste) => {
  const plan = new Map(liste.map((c) => [cle(c), [DOUBLON]]));
  const fait = new Set();
  const reste = (c) => !fait.has(cle(c) + '§' + DOUBLON);
  await choisirFiltre(null);
  for (const [i, c] of liste.entries()) {
    arret();
    if (!reste(c)) continue; // déjà posée en passant, avec la recherche d'une autre carte
    ui.statut(`Doublons : « ${c.t} » (${i + 1}/${liste.length})`);
    await rechercher(c.t);
    await parcourirVue(async (num) => {
      await appliquerSurPage(plan, fait, (t) => ui.journal(`« ${c.t} » ${t}`), num);
      return reste(c);
    });
  }
  await rechercher('');
  store.set('lecture2_perimee', true);
  const manquent = liste.filter(reste);
  ui.statut(manquent.length ? `⚠️ ${manquent.length} carte(s) introuvable(s) par la recherche, dont « ${manquent[0].t} » : relance « Doublons ».`
    : `✅ ${liste.length} carte(s) marquée(s) « ${DOUBLON} » (tous leurs exemplaires).`);
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
    store.set('lecture2_perimee', false);
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
      <p class="hint">${applique ? 'Supprimable = toutes ses cartes ont le domaine de l\'étiquette ; pour une nationalité, le mot doit aussi être dans leur titre ou leur description.' : 'La suppression se débloque une fois les étiquettes appliquées.'}</p>
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
      store.set('lecture2_perimee', true);
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
    modeSelection, poserEtiquette, appliquerSurPage, appliquerRanger, modeRanger, modeMigration, motsGroupes, rechercher,
    supprimerEtiquette, rapportSuppression, suggestions, monterUI, ui: () => ui, stop: () => { STOP = true; },
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
