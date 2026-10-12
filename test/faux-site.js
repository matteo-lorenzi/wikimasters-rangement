// Faux site WikiMasters : la page Collection simulée dans jsdom, avec ses pièges (docs/wikimasters.md).
//
//   const site = await creerSite({ cartes, etiquettes, ...options });
//   site.wmr        → window.__WMR (fonctions internes du userscript)
//   site.cartes     → l'état des cartes, modifié par les étiquetages
//   site.actions    → ce que le script a fait sur la page (pages, poses, fiches ouvertes…)
//   site.fermer()
//
// Pièges rejoués : « Page X / Y » en retard et au total faux, « Chargement… », cartes sans <p>,
// libellé du filtre avec « (n) », fenêtre d'étiquetage avec bilan et « Terminé » (qui se ferme seule ou non),
// retour en page 1 après un étiquetage, sélection perdue au changement de page, `confirm` natif,
// recherche sans casse ni accents, échecs de chargement et de pose.
'use strict';
const { JSDOM } = require('jsdom');
const { sourceScript } = require('./charger');

const RARETES = ['L', 'UR', 'SR', 'R', 'PC', 'C'];
const sansAccents = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const attente = (ms) => new Promise((r) => setTimeout(r, ms));

// jsdom n'a pas innerText : texte visible, un saut de ligne après chaque bloc.
const BLOCS = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'SECTION', 'LI', 'UL']);
const installerInnerText = (window) => {
  const visible = (el) => !el.hidden && el.style.display !== 'none';
  const texte = (n) => {
    if (n.nodeType === 3) return n.textContent;
    if (n.nodeType !== 1 || !visible(n) || n.tagName === 'STYLE' || n.tagName === 'SCRIPT') return '';
    const t = [...n.childNodes].map(texte).join('');
    return BLOCS.has(n.tagName) ? t + '\n' : t;
  };
  Object.defineProperty(window.HTMLElement.prototype, 'innerText', { get() { return texte(this).replace(/\n+$/, ''); }, configurable: true });
};

/**
 * cartes : [{ t, d, r, tags: [noms], obtenu }] — d vide = carte sans description (pas de <p>).
 * etiquettes : noms des étiquettes existantes.
 * options :
 *   paginationTardive (ms, 40)  · pagesFantomes (pages vides annoncées en plus, 2)
 *   chargement (ms, 15)         · pose (ms, 20)
 *   fermetureAuto (true)        : la fenêtre « Appliquer une étiquette » se ferme seule après le bilan
 *   retourPage1 (true)          : la liste revient en page 1 après un étiquetage
 *   echecsPose (0)              : nombre de poses refusées (« Impossible d'appliquer l'étiquette »)
 *   echecsRecherche (0)         : nombre de chargements de liste en échec
 *   apiEnPanne (false)          : toute requête /api/ répond 500
 *   messageConfirm              : texte du `confirm` natif de suppression (sinon il nomme l'étiquette)
 */
const creerSite = async (config = {}) => {
  const o = {
    paginationTardive: 40, pagesFantomes: 2, chargement: 15, pose: 20,
    fermetureAuto: true, retourPage1: true, echecsPose: 0, echecsRecherche: 0, apiEnPanne: false, ...config,
  };
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://www.wiki-masters.com/collection', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  const document = window.document;
  installerInnerText(window);

  let prochainId = 1;
  const cartes = (o.cartes || []).map((c) => ({ id: prochainId++, t: c.t, d: c.d || '', r: c.r || 'C', tags: [...(c.tags || [])], obtenu: c.obtenu || '2026-01-01T00:00:00+00:00' }));
  const etiquettes = [...new Set([...(o.etiquettes || []), ...cartes.flatMap((c) => c.tags)])];
  const actions = [];
  const etat = { filtre: null, tri: 'Rareté', q: '', page: 0, selection: false, choisies: new Set(), affichees: [], jeton: 0, paginationVisible: false, erreur: false, echecsRecherche: o.echecsRecherche, echecsPose: o.echecsPose };

  // ── la vue : filtre d'étiquette + recherche + tri ──
  const vue = ({ filtre = etat.filtre, q = etat.q, tri = etat.tri } = {}) => {
    const mot = sansAccents(q.trim());
    let l = cartes.filter((c) => (filtre === null ? true : filtre === '' ? !c.tags.length : c.tags.includes(filtre)))
      .filter((c) => !mot || sansAccents(c.t).includes(mot) || sansAccents(c.d).includes(mot));
    if (tri === 'Rareté') l = l.sort((a, b) => RARETES.indexOf(a.r) - RARETES.indexOf(b.r) || a.id - b.id);
    else l = l.sort((a, b) => (b.obtenu > a.obtenu ? 1 : b.obtenu < a.obtenu ? -1 : b.id - a.id));
    return l;
  };
  const pagesReelles = () => Math.max(1, Math.ceil(vue().length / 50));

  // ── squelette de la page ──
  document.body.innerHTML = `
    <div id="site">
      <div class="entete"><h1>Collection</h1><button id="b-selection">Sélectionner</button></div>
      <div class="barre-outils">
        <input placeholder="Rechercher par titre ou catégorie..." id="recherche">
        <button aria-label="Filtrer par étiquette" id="b-filtre">Toutes les étiquettes</button>
        <button aria-label="Trier la collection" id="b-tri">Rareté</button>
      </div>
      <div id="menu" hidden></div>
      <div id="erreur" hidden>Le chargement de la collection a échoué. Réessaie dans un instant.</div>
      <div id="pagination"></div>
      <div id="grille"></div>
      <div id="vide" hidden></div>
      <div id="barre-selection" hidden></div>
      <div id="fenetre"></div>
      <div id="bandeau"></div>
    </div>`;
  const $ = (s) => document.querySelector(s);
  const bouton = (texte, attrs = {}) => { const b = document.createElement('button'); b.textContent = texte; for (const [k, v] of Object.entries(attrs)) b.setAttribute(k, v); return b; };

  // ── en-tête et mode sélection ──
  const majEntete = () => { $('#b-selection').textContent = etat.selection ? 'Quitter la sélection' : 'Sélectionner'; };
  $('#b-selection').addEventListener('click', () => {
    etat.selection = !etat.selection;
    etat.choisies.clear();
    majEntete(); majGrilleSelection(); majBarre();
  });

  // ── cartes ──
  const dessinerGrille = () => {
    const g = $('#grille');
    g.innerHTML = '';
    for (const c of etat.affichees) {
      const wrap = document.createElement('div'); wrap.className = 'relative';
      const card = document.createElement('div'); card.className = `glow-${c.r.toLowerCase()} rounded-xl`;
      card.innerHTML = `<div class="absolute top-2 left-2">${c.r}</div><h3></h3>${c.d ? '<p></p>' : ''}<div class="tags"></div>`;
      card.querySelector('h3').textContent = c.t;
      if (c.d) card.querySelector('p').textContent = c.d;
      const tags = card.querySelector('.tags');
      c.tags.slice(0, 2).forEach((t) => { const s = document.createElement('span'); s.className = 'rounded-full'; s.textContent = t; tags.appendChild(s); });
      if (c.tags.length > 2) { const s = document.createElement('span'); s.textContent = '+' + (c.tags.length - 2); tags.appendChild(s); }
      const calque = document.createElement('div'); calque.className = 'pointer-events-none absolute inset-0';
      card.addEventListener('click', () => {
        if (!etat.selection) { actions.push({ type: 'fiche', t: c.t }); return; }
        if (etat.choisies.has(c.id)) etat.choisies.delete(c.id); else etat.choisies.add(c.id);
        majGrilleSelection(); majBarre();
      });
      wrap.append(card, calque);
      wrap.dataset.id = c.id;
      g.appendChild(wrap);
    }
    majGrilleSelection();
  };
  // Le calque ring-4 dit si la carte est cochée ; les nœuds restent les mêmes (comme React).
  const majGrilleSelection = () => {
    for (const wrap of $('#grille').children) {
      const calque = wrap.children[1];
      calque.className = 'pointer-events-none absolute inset-0' + (etat.selection && etat.choisies.has(+wrap.dataset.id) ? ' ring-4 ring-emerald-400' : '');
    }
  };

  // ── pagination : arrive après les cartes, total faux (pages fantômes) ──
  const dessinerPagination = () => {
    const p = $('#pagination');
    p.innerHTML = '';
    if (etat.chargement) { p.textContent = 'Chargement…'; return; }
    if (!etat.paginationVisible) return;
    if (pagesReelles() === 1) return; // une seule page : pas de pagination
    const total = pagesReelles() + o.pagesFantomes;
    const prec = bouton('← Précédent'); prec.disabled = etat.page === 0;
    const suiv = bouton('Suivant →'); suiv.disabled = etat.page + 1 >= total;
    const info = document.createElement('span'); info.textContent = `Page ${etat.page + 1} / ${total}`;
    prec.addEventListener('click', () => allerPage(etat.page - 1));
    suiv.addEventListener('click', () => allerPage(etat.page + 1));
    p.append(prec, info, suiv);
  };
  const allerPage = (n) => { actions.push({ type: 'page', page: n + 1 }); etat.page = n; etat.choisies.clear(); charger(); };

  // ── chargement de la liste ──
  const charger = async () => {
    const jeton = ++etat.jeton;
    etat.chargement = true; etat.paginationVisible = false;
    dessinerPagination(); majBarre();
    await attente(o.chargement);
    if (jeton !== etat.jeton) return;
    etat.chargement = false;
    if (etat.echecsRecherche > 0) {
      etat.echecsRecherche--;
      etat.erreur = true; etat.affichees = [];
    } else {
      etat.erreur = false;
      etat.affichees = vue().slice(etat.page * 50, etat.page * 50 + 50);
    }
    $('#erreur').hidden = !etat.erreur;
    const vide = $('#vide');
    vide.hidden = etat.affichees.length > 0;
    vide.textContent = etat.filtre === null && !etat.q ? 'Aucune carte pour l\'instant. Ouvrez un paquet !' : 'Aucune carte trouvée avec ces filtres.';
    dessinerGrille(); dessinerPagination(); majBarre();
    await attente(o.paginationTardive);
    if (jeton !== etat.jeton) return;
    etat.paginationVisible = !etat.erreur;
    dessinerPagination();
  };
  const recharger = (page = etat.page) => { etat.page = page; etat.choisies.clear(); return charger(); };

  // ── recherche (attente ~0,3 s ; même valeur = rien ne part) ──
  let minuterie = null;
  $('#recherche').addEventListener('input', (e) => {
    clearTimeout(minuterie);
    minuterie = setTimeout(() => {
      const v = e.target.value;
      if (v === etat.q) return;
      etat.q = v; actions.push({ type: 'recherche', q: v });
      recharger(0);
    }, 5);
  });

  // ── filtre d'étiquette (libellé « #Nom (n) ») et gestion des étiquettes ──
  const libelleFiltre = () => (etat.filtre === null ? 'Toutes les étiquettes' : etat.filtre === '' ? 'Sans étiquette' : `#${etat.filtre} (${vue({ q: '' }).length})`);
  const menu = $('#menu');
  $('#b-filtre').addEventListener('click', () => {
    actions.push({ type: 'menu' });
    if (!menu.hidden && menu.dataset.type === 'filtre') { menu.hidden = true; return; }
    menu.dataset.type = 'filtre';
    menu.innerHTML = '';
    const opt = (texte, valeur) => { const b = bouton(texte); b.addEventListener('click', () => { menu.hidden = true; etat.filtre = valeur; $('#b-filtre').textContent = libelleFiltre(); actions.push({ type: 'filtre', filtre: valeur }); recharger(0); }); menu.appendChild(b); };
    opt('Toutes les étiquettes', null);
    opt('Sans étiquette', '');
    for (const t of [...etiquettes].sort()) opt(`#${t} (${cartes.filter((c) => c.tags.includes(t)).length})`, t);
    const g = bouton('Gérer les étiquettes…'); g.addEventListener('click', () => { menu.hidden = true; ouvrirGestion(); }); menu.appendChild(g);
    menu.hidden = false;
  });
  const ouvrirGestion = () => {
    const f = $('#fenetre');
    f.innerHTML = '<div role="dialog"><h2>Mes étiquettes</h2><p>Créez, renommez et supprimez vos étiquettes.</p><div class="lignes"></div></div>';
    const fermer = bouton('×', { 'aria-label': 'Fermer' }); fermer.addEventListener('click', () => { f.innerHTML = ''; }); f.firstChild.appendChild(fermer);
    const lignes = f.querySelector('.lignes');
    for (const t of [...etiquettes].sort()) {
      const ligne = document.createElement('div');
      const nom = document.createElement('div'); nom.textContent = t;
      const sup = bouton('Supprimer');
      sup.addEventListener('click', () => {
        if (!window.confirm(o.messageConfirm || `Supprimer l'étiquette « ${t} » ? Elle sera retirée de toutes vos cartes.`)) return;
        etiquettes.splice(etiquettes.indexOf(t), 1);
        for (const c of cartes) c.tags = c.tags.filter((x) => x !== t);
        actions.push({ type: 'suppression', etiquette: t });
        setTimeout(() => ligne.remove(), 10);
      });
      ligne.append(nom, sup);
      lignes.appendChild(ligne);
    }
  };

  // ── tri ──
  $('#b-tri').addEventListener('click', () => {
    menu.dataset.type = 'tri';
    menu.innerHTML = '';
    for (const l of ['Rareté', 'Date d\'ajout']) {
      const b = bouton(l, { role: 'option' });
      b.addEventListener('click', () => { menu.hidden = true; etat.tri = l; $('#b-tri').textContent = l; recharger(0); });
      menu.appendChild(b);
    }
    menu.hidden = false;
  });

  // ── barre de sélection (en bas de page) ──
  const majBarre = () => {
    const barre = $('#barre-selection');
    barre.hidden = !etat.selection;
    if (!etat.selection) return;
    const n = etat.choisies.size;
    barre.innerHTML = `<div><span>${n}</span><span> ${n > 1 ? 'cartes sélectionnées' : 'carte sélectionnée'}</span></div>`;
    const toutes = etat.affichees.length && etat.affichees.every((c) => etat.choisies.has(c.id));
    const tout = bouton(toutes ? 'Désélectionner la page' : 'Tout sélectionner (page)');
    tout.addEventListener('click', () => { for (const c of etat.affichees) toutes ? etat.choisies.delete(c.id) : etat.choisies.add(c.id); majGrilleSelection(); majBarre(); });
    const etq = bouton('Étiqueter'); etq.disabled = !n; etq.addEventListener('click', ouvrirEtiqueter);
    const retirer = bouton('Retirer l\'étiquette'); retirer.disabled = !n;
    const defausser = bouton(`Défausser (+${n})`); defausser.addEventListener('click', () => actions.push({ type: 'DÉFAUSSER' }));
    barre.append(tout, etq, retirer, defausser);
  };

  // ── fenêtre « Appliquer une étiquette » ──
  const ouvrirEtiqueter = () => {
    const f = $('#fenetre');
    const choisies = cartes.filter((c) => etat.choisies.has(c.id));
    f.innerHTML = `<div role="dialog"><h2>Appliquer une étiquette</h2><p>Sur ${choisies.length} cartes sélectionnées.</p>
      <input placeholder="Chercher ou créer une étiquette..."><div class="liste"></div><div class="message"></div></div>`;
    const boite = f.firstChild;
    const fermer = bouton('×', { 'aria-label': 'Fermer' }); fermer.addEventListener('click', () => { f.innerHTML = ''; }); boite.appendChild(fermer);
    const inp = boite.querySelector('input');
    const liste = boite.querySelector('.liste');
    const message = boite.querySelector('.message');
    const terminer = () => { f.innerHTML = ''; recharger(o.retourPage1 ? 0 : etat.page); };
    const appliquer = async (nom) => {
      liste.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      await attente(o.pose);
      if (etat.echecsPose > 0) {
        etat.echecsPose--;
        message.textContent = 'Impossible d\'appliquer l\'étiquette';
        liste.querySelectorAll('button').forEach((b) => { b.disabled = false; });
        return;
      }
      if (!etiquettes.includes(nom)) etiquettes.push(nom);
      let poses = 0, deja = 0;
      for (const c of choisies) { if (c.tags.includes(nom)) deja++; else { c.tags.push(nom); poses++; } }
      actions.push({ type: 'pose', etiquette: nom, n: poses, titres: choisies.map((c) => c.t) });
      message.textContent = `${poses} cartes étiquetées.${deja ? ` (${deja} déjà étiquetée)` : ''}`;
      const fin = bouton('Terminé'); fin.addEventListener('click', terminer); boite.appendChild(fin);
      if (o.fermetureAuto) {
        setTimeout(() => {
          if (!f.firstChild) return;
          terminer();
          const b = $('#bandeau');
          b.innerHTML = `<div>Étiquette appliquée à ${poses} cartes.</div>`;
          const x = bouton('×', { 'aria-label': 'Fermer' }); x.addEventListener('click', () => { b.innerHTML = ''; }); b.appendChild(x);
        }, 30);
      }
    };
    const lister = () => {
      liste.innerHTML = '';
      const v = inp.value.trim();
      const trouvees = etiquettes.filter((t) => sansAccents(t).includes(sansAccents(v))).sort();
      for (const t of trouvees) { const b = bouton(t); b.addEventListener('click', () => appliquer(t)); liste.appendChild(b); }
      if (v && !etiquettes.includes(v)) { const b = bouton(`Créer ${v}`); b.addEventListener('click', () => appliquer(v)); liste.appendChild(b); }
    };
    inp.addEventListener('input', lister);
    lister();
  };

  // ── API de lecture ──
  window.fetch = async (url) => {
    await attente(2);
    const u = new URL(url, 'https://www.wiki-masters.com');
    actions.push({ type: 'api', url: u.pathname + u.search });
    if (o.apiEnPanne) return { ok: false, status: 500, json: async () => ({}) };
    const p = u.searchParams;
    const filtre = p.get('untagged') === '1' ? '' : p.get('tag_id') ? p.get('tag_id') : null;
    const l = vue({ filtre, q: p.get('q') || '', tri: p.get('sort') === 'added' ? 'Date d\'ajout' : 'Rareté' });
    if (u.pathname === '/api/my-collection/stats') return { ok: true, status: 200, json: async () => ({ total: l.length, rarityCounts: {}, tagOptions: [] }) };
    if (u.pathname === '/api/my-collection') {
      const page = +p.get('page') || 0;
      const collection = l.slice(page * 50, page * 50 + 50).map((c) => ({
        id: c.id, card: { wikipedia_title: c.t, category: c.d, rarity: c.r }, tags: c.tags.map((t) => ({ id: t, name: t })), obtained_at: c.obtenu,
      }));
      return { ok: true, status: 200, json: async () => ({ collection }) };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };

  // ── le userscript ──
  window.__WMR_TEST__ = true;
  window.__WMR_ECHELLE__ = 0.02;
  window.confirm = () => true;
  await charger();
  window.eval(sourceScript());

  return {
    window, document, cartes, actions, etiquettes, etat,
    wmr: window.__WMR,
    attente,
    pagesVisitees: () => actions.filter((a) => a.type === 'page').length,
    poses: () => actions.filter((a) => a.type === 'pose'),
    fermer: () => window.close(),
  };
};

module.exports = { creerSite };
