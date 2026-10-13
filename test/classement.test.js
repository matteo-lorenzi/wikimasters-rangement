// Le moteur de src/regles.js sur des cartes réelles : titre, description → étiquettes attendues.
// Cartes tirées de la collection de la personne (lecture API du 2026-10-12), sauf mention « reconstitué » :
// les 55 cas d'origine ont été perdus avec l'ancien environnement.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chargerRegles } = require('./charger');

const R = chargerRegles();
const classe = (t, d) => { const r = R.classer({ t, d }); return { ...r, etiquettes: [...r.etiquettes] }; };

// [titre, description, étiquettes attendues, statut attendu]
const CAS = [
  // Sport
  ['Carlon Brown', 'joueur de basket-ball américain', ['Sport'], 'classee'],
  ['Máté Vida', 'joueur de football hongrois', ['Sport'], 'classee'],
  ['Anna Ngoulou Seck', 'escrimeuse sénégalaise', ['Sport'], 'classee'],
  ['Mohamed Khaldi', 'athlète algérien', ['Sport'], 'classee'],
  ['Flavien Nouhaillaguet', 'joueur français de rugby à XV', ['Sport'], 'classee'],
  ['Tournoi de tennis de Bad Homburg (WTA 2021)', 'tournoi de tennis féminin', ['Sport'], 'classee'],
  ['Rallye Dakar 2010', '32e édition du Dakar, épreuve de rallye-raid', ['Sport'], 'classee'],
  ['Tirreno-Adriatico 1995', 'édition 1995 de Tirreno-Adriatico, course cycliste italienne', ['Sport'], 'classee'],
  ['Coupe de France de rugby à XIII 1964-1965', 'compétition de rugby à XIII', ['Sport'], 'classee'],
  ['Tiger Woods', 'golfeur américain', ['Sport'], 'classee'],
  // Géographie
  ['Owego Township', 'établissement humain, comté de Livingston, Illinois, États-Unis', ['Géographie'], 'classee'],
  ["Canton d'Eygurande", 'ancien canton français', ['Géographie'], 'classee'],
  ['Îles de Verchères', 'îles au Québec (Canada)', ['Géographie'], 'classee'],
  ['Olanchito', 'municipalité du Honduras', ['Géographie'], 'classee'],
  ['Río Inambari', 'rivière en Pérou', ['Géographie'], 'classee'],
  ['Rue Sartine', 'ancienne rue de Paris, en France', ['Géographie'], 'classee'],
  // Suggestions de la personne (2026-10-13) : « voie » = une rue ; « voie verte » = une piste, en Transports
  ['Grande rue de la Croix-Rousse', 'voie de Lyon, en France', ['Géographie'], 'classee'],
  ['Villa Armand', 'voie parisienne', ['Géographie'], 'classee'],
  ['Voie verte Pierrefitte-Nestalas/Cauterets', 'voie verte en France', ['Transports'], 'classee'],
  ['Vallée du Haut Bréda', 'vallée en France', ['Géographie'], 'classee'],
  // Politique & Droit
  ['Juan Lira Loayza', 'homme politique péruvien', ['Politique & Droit'], 'classee'],
  ['Jean-Jacques-François Millanois', 'personnalité politique française', ['Politique & Droit'], 'classee'],
  ['Clayton Ruby', 'avocat canadien', ['Politique & Droit'], 'classee'],
  ['Élections législatives de 2022 en Nouvelle-Calédonie', 'résultats électoraux des élections législatives françaises de 2022', ['Politique & Droit'], 'classee'],
  // Nature
  ['Colostygia pectinataria', "espèce d'insectes", ['Nature'], 'classee'],
  ['Silene saxifraga', 'espèce de plantes', ['Nature'], 'classee'],
  ['Tangara couronné', "espèce d'oiseaux", ['Nature'], 'classee'],
  // Espace
  ['HD 141937', 'étoile naine jaune de la constellation de la Balance', ['Espace'], 'classee'],
  ['(35639) 1998 KY49', "astéroïde de la ceinture principale d'astéroïdes", ['Espace'], 'classee'],
  ['358P/PANSTARRS', 'comète', ['Espace'], 'classee'],
  // Sciences
  ['Rust College', 'université historiquement noire aux Etats-Unis', ['Sciences'], 'classee'],
  ['Maladie à déclaration obligatoire', 'maladies considérées comme relevant de la santé publique et devant être déclarées aux autorités', ['Sciences'], 'classee'],
  ['Mekmek', 'langue yuat', ['Sciences'], 'classee'],
  ['Gabriel Bexon', 'naturaliste français collaborateur de Buffon', ['Sciences'], 'classee'],
  // Patrimoine, Histoire, Économie, Transports, Littérature, Arts, Musique, Cinéma, Religion
  ['Musée Yamato', 'musée maritime japonais', ['Patrimoine'], 'classee'],
  ['Théâtre Dolby', 'salle de spectacle du complexe Hollywood and Highland Center, Los Angeles, Californie, États-Unis', ['Patrimoine'], 'classee'],
  ['Hôpital adventiste de Gimbie', 'bâtiment en Afrique', ['Patrimoine'], 'classee'],
  ['Wilhelm von Freytag', 'général allemand', ['Histoire'], 'classee'],
  ['Bataille du Cap Ecnome', 'bataille navale entre Rome et Carthage', ['Histoire'], 'classee'],
  ['Jacques Rançon', 'tueur en série français', ['Histoire'], 'classee'],
  ['WH Group', 'entreprise chinoise spécialisée dans la production de viande', ['Économie'], 'classee'],
  ["Grand-père au sirop d'érable", 'pâtisseries traditionnelles québécoises et acadiennes', ['Économie'], 'classee'],
  ['Moto Guzzi V9', 'Moto italienne de catégorie cruiser / roadster 2016–2024', ['Transports'], 'classee'],
  ['Route 7 (Nouveau-Brunswick)', 'autoroute au Nouveau-Brunswick (Canada)', ['Transports'], 'classee'],
  ['Route départementale 16 (Alpes-de-Haute-Provence)', 'route départementale des Alpes-de-Haute-Provence, en France', ['Transports'], 'classee'],
  ['Ladybird Books', 'livres pour enfants britanniques', ['Littérature'], 'classee'],
  ['Les Brigades fantômes', 'roman de John Scalzi (2006)', ['Littérature'], 'classee'],
  ['Kazuhiro Fujita', 'dessinateur japonais', ['Arts'], 'classee'],
  ['Maman chérie', 'EP de Claude François', ['Musique'], 'classee'],
  ['Ariane-Li Simard-Côté', 'actrice canadienne spécialisée dans le doublage', ['Cinéma & TV'], 'classee'],
  ['Antoine-Joseph Mège', 'bénédictin français de la Congrégation de Saint-Maur (1625-1691)', ['Religion & Mythes'], 'classee'],
  // plusieurs domaines, dans l'ordre de la description
  ['Sean Combs', "rappeur, chanteur, compositeur, producteur, acteur et homme d'affaires américain", ['Musique', 'Cinéma & TV', 'Économie'], 'classee'],
  ['Élodie Fontan', 'comédienne et mannequin française', ['Cinéma & TV', 'Arts'], 'classee'],
  // une expression longue l'emporte sur le mot seul : « personnage de la mythologie » ≠ « personnage » (Fiction)
  ['Pénélope', 'personnage de la mythologie grecque', ['Religion & Mythes'], 'classee'],

  // Cartes sans règle de la personne (Suggestions v1.9.1, 2026-10-13) : mots ajoutés avec son accord
  ['974', 'année', ['Histoire'], 'classee'],
  ['25 octobre 2014', 'samedi en octobre 2014', ['Histoire'], 'classee'],
  ['Egnatius Proculus', 'consul suffect romain en 219', ['Histoire'], 'classee'],
  ['Gian Bernardo Frugoni', 'doge de la république de Gênes', ['Histoire'], 'classee'],
  ['Révolte des sabotiers', 'soulèvement de paysans solognots en 1658', ['Histoire'], 'classee'],
  ['Siro', 'genre d’opilions', ['Nature'], 'classee'],
  ['Kanapoi', 'site fossilifère du Kenya', ['Nature'], 'classee'],
  ['Espace vert', "espace d'agrément végétalisé", ['Nature'], 'classee'],
  ['Edgar Lehr', 'herpétologiste allemand', ['Sciences'], 'classee'],
  ['Hypocorrection', 'phénomène linguistique', ['Sciences'], 'classee'],
  ['Host Identity Protocol', 'Protocole Internet', ['Sciences'], 'classee'],
  ['Bruit sismique', 'bruit de fond des sismogrammes', ['Sciences'], 'classee'],
  ['Université nationale de pharmacie', 'enseignement à Kharkiv', ['Sciences'], 'classee'],
  ['Laura Vanessa Vásquez', 'taekwondoïste salvadorienne', ['Sport'], 'classee'],
  ['Alain Feuillette', 'céiste français', ['Sport'], 'classee'],
  ['Torben Grael', 'skipper brésilien', ['Sport'], 'classee'],
  ['Draft 2011 de la NFL', '', ['Sport'], 'classee'],
  ["20e étape du Tour d'Espagne 2007", "étape du Tour d'Espagne 2007", ['Sport'], 'classee'],
  ['Hanriot HD.17', "ancien hydravion d'entraînement français", ['Transports'], 'classee'],
  ['Regent Sky', 'ferry inachevé', ['Transports'], 'classee'],
  ['Doora', 'système de vélopartage en Tunisie', ['Transports'], 'classee'],
  ['Unterseeboot UC-60', '', ['Transports'], 'classee'],
  ['Limitations de vitesse en Lettonie', '', ['Transports'], 'classee'],
  ['Badalgachhi', 'upazila bengladaise', ['Géographie'], 'classee'],
  ['Tösse', 'unité urbaine suédoise', ['Géographie'], 'classee'],
  ['Ladera (Californie)', 'census designated place américaine de Californie', ['Géographie'], 'classee'],
  ['Strupenfossen', "chutes d'eau en Norvège", ['Géographie'], 'classee'],
  ['Micro-région de Sárvár', '', ['Géographie'], 'classee'],
  ['Isong Corona', 'corona sur Vénus', ['Espace'], 'classee'],
  ['Pâte de noisettes', 'préparation culinaire originaire de Piémont, en Italie', ['Économie'], 'classee'],
  ['Usine sidérurgique de Posan', 'complexe sidérurgique de Corée du Nord', ['Économie'], 'classee'],
  ['Taxe au sac', 'système de taxation des sacs poubelle mettant en place un principe du pollueur-payeur', ['Économie'], 'classee'],
  ['Canon (architecture)', '', ['Arts'], 'classee'],
  ['Jacques Daliwe', 'enlumineur flamand', ['Arts'], 'classee'],
  ['Clare West', 'créatrice de costumes américaine', ['Arts'], 'classee'],
  ['Contrechamps', 'ensemble instrumental à Genève', ['Musique'], 'classee'],
  ['Te Deum pour Notre-Dame', 'œuvre musicale de Thierry Escaich', ['Musique'], 'classee'],
  ['Trail of Justice', 'western américain par Nick DeBoer en 2020', ['Cinéma & TV'], 'classee'],
  ['Qué bonito amor', 'telenovela mexicaine', ['Cinéma & TV'], 'classee'],
  ['Filmographie de Bourvil', 'filmographie', ['Cinéma & TV'], 'classee'],
  ['Utsuro no hako to zero no Maria', 'série de light novels de sept tomes', ['Littérature'], 'classee'],
  ['Guru Ram Das', 'gourou du sikhisme', ['Religion & Mythes'], 'classee'],
  ['Zuhd', 'Pratique du Soufisme en Islam', ['Religion & Mythes'], 'classee'],
  ['Kabi Leon', 'fonctionnaire, Liban', ['Politique & Droit'], 'classee'],
  ['Ambassade du Maroc en Serbie', '', ['Politique & Droit'], 'classee'],
  ['Consulat général de France à La Nouvelle-Orléans', 'représentation consulaire française en Louisiane (États-Unis)', ['Politique & Droit'], 'classee'],
  ['Résolution 11 du Conseil de sécurité des Nations unies', 'résolution du Conseil de sécurité des Nations Unies', ['Politique & Droit'], 'classee'],
  ['Grève générale de 1971-1972', 'grève générale en Namibie', ['Politique & Droit'], 'classee'],
  ['Bourse du travail de Lille', 'lieu de réunion des syndicats de Lille', ['Politique & Droit'], 'classee'],
  ['Citoyens du Monde (association)', "organisation d'inspiration mondialiste et pacifiste", ['Politique & Droit'], 'classee'],
  ['André Agid', 'homme de média', ['Médias'], 'classee'],
  ['Miss Moldavie', 'concours de beauté', ['Médias'], 'classee'],
  // mots risqués refusés par la personne : la carte reste sans règle
  ['Friperie', "commerce de détail des vêtements d'occasion", [], 'inconnue'],
  ['16 septembre', 'date', [], 'inconnue'],
  // la description ne donne aucun domaine : le titre en secours
  ['Gérard Simon (directeur de la photographie)', 'personnalité française', ['Cinéma & TV'], 'classee'],
  ['IXe congrès du Parti communiste (France)', 'congrès tenu à Arles du 25 au 29 décembre 1937.', ['Politique & Droit'], 'classee'],
  ['Avocat en France', "type d'auxiliaire de justice en droit français", ['Politique & Droit'], 'classee'],
  ['Trio à cordes de Cras', 'œuvre de Jean Cras', ['Musique'], 'classee'],
  // … mais seulement en secours : la description garde le dernier mot
  ['Le Footballeur', 'film de 1974', ['Cinéma & TV'], 'classee'],
  ['Footballeur (homonymie)', "page d'homonymie de Wikimédia", [], 'ignoree'],
  // une page de liste reste ignorée, même avec le mot ambigu « liste »
  ['Liste de peintures de Claude Monet à Bordighera (1884)', "liste d'un projet Wikimedia", [], 'ignoree'],
];

for (const [t, d, attendu, statut] of CAS) {
  test(`${t} — ${d}`, () => {
    const r = classe(t, d);
    assert.deepEqual(r.etiquettes, attendu);
    assert.equal(r.statut, statut);
  });
}

// ── pièges connus ──

test('golfe ≠ golf : « État du golfe Persique » n\'est pas du Sport', () => {
  assert.deepEqual(classe('Koweït', 'État du golfe Persique').etiquettes, ['Géographie']);
});

test('« facteurs » ne contient pas le mot « acteur »', () => {
  const r = classe("Biais d'autocomplaisance", "tendance des gens à attribuer la causalité de leur réussite à leurs qualités propres (causes internes) et leurs échecs à des facteurs ne dépendant pas d'eux");
  assert.ok(!r.etiquettes.includes('Cinéma & TV'), r.etiquettes.join(', '));
});

test('romane ≠ roman (reconstitué)', () => {
  assert.deepEqual(classe('Église Saint-Martin', 'église romane en France').etiquettes, ['Religion & Mythes', 'Patrimoine']);
});

test('partie ≠ parti : un épisode reste un épisode', () => {
  assert.deepEqual(classe('Le Labyrinthe des Anges, deuxième partie', 'épisode de Doctor Who').etiquettes, ['Cinéma & TV']);
});

test('faute du site « stréréoisomères » reconnue', () => {
  assert.deepEqual(classe('Méthamphétamine', 'groupe de stréréoisomères').etiquettes, ['Sciences']);
});

test('trait d\'union : « Saint-Palais » n\'est pas « saint », et Géographie ne compte qu\'en premier', () => {
  const r = classe('Pierre Folle (Saint-Palais-de-Négrignac)', 'dolmen situé à Saint-Palais-de-Négrignac, dans le département de la Charente-Maritime en France');
  assert.deepEqual(r.etiquettes, ['Patrimoine']);
});

test('collection ★Village Polonais : village + Pologne (reconstitué)', () => {
  assert.deepEqual(classe('Wola Zarczycka', 'village de Pologne, dans la voïvodie des Basses-Carpates').etiquettes, ['Géographie', '★Village Polonais']);
});

test('mot ambigu seul → !À traiter', () => {
  const r = classe('Bôa', 'groupe britannique');
  assert.deepEqual(r.etiquettes, ['!À traiter']);
  assert.equal(r.statut, 'a_traiter');
});

test('mot ambigu seul, mais un domaine dans le titre : le titre range la carte', () => {
  const r = classe("Cour d'appel de Besançon", "service de l'État français");
  assert.deepEqual(r.etiquettes, ['Politique & Droit']);
  assert.equal(r.source, 'titre');
});

test('page d\'homonymie → ignorée, sans étiquette', () => {
  const r = classe('Peter Simpson', "page d'homonymie de Wikimédia");
  assert.deepEqual(r.etiquettes, []);
  assert.equal(r.statut, 'ignoree');
});

test('page de liste et prénom → ignorées', () => {
  assert.equal(classe('Liste des planètes mineures non numérotées découvertes en 2007', 'page de liste de Wikimedia').statut, 'ignoree');
  assert.equal(classe('Akira (prénom)', 'prénom épicène').statut, 'ignoree');
});

// ── cartes sans description : lues par leur titre, la parenthèse d'abord ──

test('sans description : « Cherry (film, 2021) » lu par sa parenthèse', () => {
  const r = classe('Cherry (film, 2021)', '');
  assert.deepEqual(r.etiquettes, ['Cinéma & TV']);
  assert.equal(r.source, 'titre');
});

test('sans description : le titre seul suffit', () => {
  assert.deepEqual(classe("Championnats d'Asie d'athlétisme en salle 2024", '').etiquettes, ['Sport']);
  assert.deepEqual(classe("Centrale thermique d'Anegasaki", '').etiquettes, ['Économie']);
  assert.deepEqual(classe('Centre Hospitalier Tshisekedi Tshilombo', '').etiquettes, ['Sciences']);
});
