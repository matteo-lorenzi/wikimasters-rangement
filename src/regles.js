// ═══════════════════════════════════════════════════════════════════
//  RÈGLES DE RANGEMENT — à modifier librement
//  • Écris les mots comme ils apparaissent (accents facultatifs).
//  • Un mot trouve aussi son pluriel et son féminin : acteur → actrice,
//    chanteur → chanteuse, musicien → musicienne, sportif → sportive…
//  • Les mots de 4 lettres ou moins sont pris tels quels (« golf » ≠ « golfe »).
//  • Termine par ! pour forcer le mot exact : "roman!" ne trouve pas « romane ».
//  • Termine par * pour « commence par » : "sculpt*" → sculpteur, sculptrice…
//  • Les expressions longues passent avant les mots seuls :
//    "auteur-compositeur" (Musique) l'emporte sur "auteur" (Littérature).
//  • Le moteur lit la description ; si elle ne donne aucun domaine, il lit aussi le titre.
//  • Un titre peut aussi ranger une carte par sa FORME : voir MOTIFS_DE_TITRE plus bas
//    (« Famille Whitney » → Histoire, « Kix (groupe) » → Musique). Une ligne par motif.
//  • Les NOMBRES de la lecture dans Wikipédia (taille des lots, pauses, longueur de la phrase gardée…) sont
//    tous dans REGLAGES, plus bas : une valeur par ligne, avec son rôle. Ne change que ce que tu comprends ;
//    « lot » et « extrait » sont des limites de Wikipédia. Un réglage modifié fait relire toutes les cartes
//    sans étiquette au prochain Ranger.
// ═══════════════════════════════════════════════════════════════════

const DOMAINES = {
  'Cinéma & TV': [
    'acteur', 'actrice', 'comédien', 'cinéaste', 'réalisateur', 'réalisatrice', 'scénariste',
    'film', 'téléfilm', 'cinéma', 'court métrage', 'long métrage', 'série télévisée', 'série tv',
    'série d\'animation', 'série animée', 'sitcom', 'feuilleton', 'épisode', 'doubleur', 'doubleuse',
    'productrice de cinéma', 'producteur de cinéma', 'producteur de télévision', 'productrice de télévision',
    'studio de cinéma', 'festival de cinéma', 'cascadeur', 'cascadeuse', 'directeur de la photographie',
    'film d\'animation', 'mini-série', 'saison de la série',
    'série de télévision', 'thriller', 'télévision',
    // Suggestions du 2026-10-13
    'western', 'filmographie', 'telenovela',
    // Suggestions du 2026-10-13 (3e tour)
    'golden globe', 'prix génie',
    // Suggestions du 2026-10-14 (4e tour) : « film » a 4 lettres, il ne trouve pas son pluriel
    'films',
  ],
  'Musique': [
    'chanteur', 'chanteuse', 'compositeur', 'compositrice', 'auteur-compositeur', 'autrice-compositrice',
    'auteur-compositeur-interprète', 'musicien', 'pianiste', 'violoniste', 'violoncelliste', 'guitariste',
    'bassiste', 'batteur', 'batteuse', 'saxophoniste', 'trompettiste', 'organiste', 'flûtiste', 'harpiste',
    'rappeur', 'rappeuse', 'parolier', 'parolière', 'chef d\'orchestre', 'disc-jockey', 'dj', 'beatmaker',
    'groupe de musique', 'groupe musical', 'groupe de rock', 'groupe de pop', 'groupe de rap', 'groupe de metal',
    'groupe de punk', 'groupe de jazz', 'boys band', 'girl group', 'album', 'chanson', 'single', 'ep',
    'opéra', 'orchestre', 'symphonie', 'concerto', 'sonate', 'genre musical', 'label', 'maison de disques',
    'producteur de musique', 'productrice de musique', 'producteur de disques', 'ténor', 'soprano', 'baryton',
    'jazzman', 'chorale', 'festival de musique', 'comédie musicale', 'musique', 'interprète de musique',
    'auteure-compositrice-interprète', 'autrice-compositrice-interprète', 'auteure-compositrice', 'girls band', 'boys band', 'chant', 'composition musicale', 'compositions musicales', 'piano', 'manager musical', 'discographie', 'concert', 'tournée',
    // Suggestions du 2026-10-13
    'musical', 'instrumental', 'jazz', 'trio à cordes',
    // Suggestions du 2026-10-13 (3e tour)
    'grammy',
  ],
  'Littérature': [
    'écrivain', 'écrivaine', 'romancier', 'romancière', 'poète', 'poétesse', 'auteur', 'autrice',
    'essayiste', 'dramaturge', 'nouvelliste', 'éditeur', 'éditrice', 'maison d\'édition', 'roman!', 'livre',
    'recueil', 'poème', 'poésie', 'pièce de théâtre', 'bande dessinée', 'série de bande dessinée',
    'scénariste de bande dessinée', 'auteur de bande dessinée', 'mangaka', 'manga', 'traducteur', 'traductrice',
    'critique littéraire', 'prix littéraire', 'conte', 'fabuliste', 'biographe', 'mémorialiste', 'librettiste',
    'littérature', 'homme de lettres', 'femme de lettres', 'littéraire', 'nouvelle de', 'œuvre littéraire',
    'auteure', 'expression latine', 'proverbe', 'locution', 'rhétorique', 'philologue',
    // Suggestions du 2026-10-13
    'light novel',
    // Phase 3 Wikipédia, 2026-10-24 : « album » seul est de la Musique, pas « album de bande dessinée »
    'album de bande dessinée', 'albums de bande dessinée',
  ],
  'Arts': [
    'peintre', 'sculpt*', 'artiste', 'illustrateur', 'illustratrice', 'dessinateur', 'dessinatrice',
    'photographe', 'architecte', 'chorégraphe', 'danseur', 'danseuse', 'danse', 'ballet', 'graveur', 'graveuse',
    'céramiste', 'designer', 'styliste', 'couturier', 'couturière', 'mannequin', 'tableau', 'peinture',
    'sculpture', 'œuvre d\'art', 'fresque', 'vitrail', 'mouvement artistique', 'courant artistique',
    'style architectural', 'calligraphe', 'orfèvre', 'ébéniste', 'lithographie', 'gravure', 'photographie',
    'metteur en scène', 'metteuse en scène', 'théâtre', 'cirque', 'marionnettiste', 'peinture murale',
    'aquarelle', 'estampe', 'art', 'arts', 'esthétique',
    // Suggestions du 2026-10-13
    'architecture', 'enlumineur', 'coloriste', 'costume',
    // Suggestions du 2026-10-13 (3e tour)
    'designeuse',
    // Suggestions du 2026-10-14 (4e tour) : le trait d'union cache « artiste » et « peintre »
    'artiste-peintre',
    // Phase 3 Wikipédia, 2026-10-24 : « historien » seul reste en Sciences (Documenta 7)
    'historien de l\'art', 'historienne de l\'art',
    // P2 : « homme de spectacle français… né dans le 8e arrondissement de Paris » (Léon Volterra) n'est pas de la Géographie
    'homme de spectacle', 'femme de spectacle',
  ],
  'Sport': [
    'footballeur', 'footballeuse', 'football', 'joueur de football', 'cycliste', 'coureur cycliste',
    'cyclisme', 'hockeyeur', 'hockeyeuse', 'hockey', 'boxeur', 'boxeuse', 'boxe', 'basketteur', 'basketteuse',
    'basket-ball', 'basket', 'baseball', 'tennis', 'tennisman', 'rugby', 'rugbyman', 'volley-ball', 'volley',
    'volleyeur', 'handball', 'handballeur', 'handballeuse', 'golfeur', 'golfeuse', 'golf', 'nageur', 'nageuse',
    'natation', 'athlète', 'athlétisme', 'sprinteur', 'sprinteuse', 'marathon*', 'skieur', 'skieuse', 'ski',
    'alpiniste', 'alpinisme', 'pilote automobile', 'pilote de course', 'pilote de rallye', 'pilote de moto',
    'pilote de vitesse moto', 'pilote de formule', 'judoka', 'judo', 'karaté', 'escrimeur', 'escrimeuse',
    'escrime', 'gymnaste', 'gymnastique', 'patineur', 'patineuse', 'patinage', 'lutteur', 'lutteuse',
    'catcheur', 'catcheuse', 'catch', 'rameur', 'rameuse', 'aviron', 'triathlète', 'triathlon', 'entraîneur',
    'entraîneuse', 'arbitre', 'jockey', 'cavalier de saut', 'équitation', 'water-polo', 'squash', 'badminton',
    'tennis de table', 'snowboard*', 'biathl*', 'surfeur', 'surf!', 'skateboard*', 'sportif', 'sportive', 'sport',
    'jeux olympiques', 'olympique', 'championnat', 'coupe du monde', 'tournoi', 'compétition', 'stade',
    'club de football', 'course cycliste', 'course automobile', 'course à pied', 'grand prix', 'rallye',
    'tour de france', 'ligue', 'dirigeant de football', 'dirigeant sportif', 'président de club',
    'joueur de hockey', 'joueur de basket-ball', 'joueur de rugby', 'joueur de tennis', 'joueur de baseball',
    'joueur de volley-ball', 'joueur de handball', 'joueur de football américain', 'football américain',
    'motocycliste', 'motocross', 'cyclo-cross', 'vtt', 'kayak*', 'canoë', 'voile sportive', 'navigateur sportif',
    'fléchettes', 'billard', 'bowling', 'curling', 'bobsleigh', 'luge', 'haltérophil*', 'culturiste',
    'pentathl*', 'décathl*', 'heptathl*', 'saison sportive', 'équipe nationale', 'sélection nationale',
    'rallye-raid', 'omnisports', 'water polo', 'formule 1', 'coupe stanley', 'séries éliminatoires', 'derby', 'soccer', 'major league', 'nba', 'nhl', 'jo', 'épreuve sportive', 'cricket',
    // Suggestions du 2026-10-13
    'taekwondo*', 'canoéiste', 'céiste', 'skipper', 'orienteur', 'nfl', 'wnba', 'bowl', 'coupe davis', 'double messieurs',
    'étape du tour',
    // Suggestions du 2026-10-13 (3e tour)
    'randonnée', 'lhjmq', 'piha',
    // Suggestions du 2026-10-14 (4e tour)
    'cup', 'racing', 'running', 'fútbol', 'eurobowl', 'coupe',
    // Suggestions du 2026-10-23 (5e tour) : « saison 2018-2019 de… », « saison 2009 des… »
    // (« saison 3 de la série » n'est pas touchée : il faut 19… ou 20…)
    'saison 19*', 'saison 20*',
    // Premier essai Wikipédia (2026-10-23) : « course hippique… Comté de Kildare » partait en Géographie
    'hippique', 'hippodrome',
    // Phase 3 Wikipédia, 2026-10-24 : « pilote autrichien de vitesse moto » (Michael Ranseder), sinon « pilote » + « moto » = Transports
    'vitesse moto',
  ],
  'Politique & Droit': [
    'homme politique', 'femme politique', 'personnalité politique', 'politicien', 'politicienne', 'ministre',
    'ministère', 'député', 'sénateur', 'sénatrice', 'maire', 'gouverneur', 'gouverneure', 'diplomate',
    'ambassadeur', 'ambassadrice', 'avocat', 'juriste', 'juge', 'magistrat', 'notaire', 'militant', 'militante',
    'syndicaliste', 'activiste', 'parti politique', 'gouvernement', 'élection', 'élections',
    'circonscription', 'circonscription électorale', 'loi', 'constitution', 'traité', 'chef d\'état',
    'chef de gouvernement', 'président de la république', 'premier ministre', 'haut fonctionnaire', 'préfet',
    'conseiller municipal', 'conseiller général', 'conseiller régional', 'parlement', 'parlementaire',
    'assemblée nationale', 'sénat', 'tribunal', 'cour d\'appel', 'cour suprême',
    'référendum', 'féministe', 'résistant', 'résistante', 'dissident', 'révolutionnaire', 'monarchiste',
    'anarchiste', 'communiste', 'socialiste', 'idéologie', 'organisation internationale', 'administration', 'front national', 'front populaire',
    'lois', 'législation', 'fonction publique', 'service public', 'diplomatique', 'organisme international', 'homme d\'état', 'femme d\'état', 'mouvement social', 'gendarmerie', 'police', 'ségrégation', 'devise nationale',
    // Suggestions du 2026-10-13
    'fonctionnaire', 'ambassade', 'consulaire', 'consulat', 'conseil de sécurité', 'nations unies', 'unesco',
    'humanitaire', 'grève', 'syndicat', 'sanction', 'décret', 'lgbt', 'pacifiste', 'mondialiste',
    // Suggestions du 2026-10-13 (3e tour)
    'doctrine politique', 'cdu', 'condition des femmes', 'état d\'urgence', 'châtiment', 'professeur de droit',
    'cia', 'haut-commissariat',
    // Suggestions du 2026-10-14 (4e tour)
    'agence fédérale', 'candidat politique', 'juridiction', 'système politique', 'relations entre',
    'droits de l\'homme', 'identité de genre', 'garde républicaine', 'commission', 'accord de',
    // Suggestions du 2026-10-23 (5e tour) : « politique » seul reste refusé
    'politique dans', 'politique en',
    // Mots manquants de Ranger (2026-10-23) : « organisme » seul est piégé (organismes génétiquement modifiés)
    'organisme public', 'organisme gouvernemental',
    // P2 : « infraction pénale reconnue dans différents pays » (Corruption de mineur) n'est pas de la Géographie
    'infraction pénale',
  ],
  'Économie': [
    'homme d\'affaires', 'femme d\'affaires', 'entrepreneur', 'entrepreneuse', 'chef d\'entreprise',
    'industriel', 'industrielle', 'banquier', 'banquière', 'économiste', 'entreprise', 'société anonyme',
    'multinationale', 'marque', 'banque', 'financier', 'financière', 'commerçant', 'négociant', 'armateur',
    'constructeur automobile', 'compagnie', 'compagnie aérienne', 'compagnie ferroviaire', 'société', 'groupe industriel',
    'chaîne de magasins', 'enseigne', 'brasserie', 'distillerie', 'fabricant', 'éditeur de logiciels',
    'éditeur de jeux vidéo', 'start-up', 'conglomérat', 'centrale thermique', 'centrale nucléaire', 'usine',
    'mine', 'monnaie', 'bourse', 'publicitaire', 'publicité', 'restaurateur', 'chef cuisinier', 'cuisinier',
    'cuisinière', 'siège social', 'gastronomie', 'plat', 'recette', 'fromage', 'vin', 'bière', 'boisson',
    'pain', 'pâtisserie', 'gâteau', 'dessert', 'confiserie', 'cuisine', 'spécialité culinaire', 'centre commercial', 'appellation d\'origine', 'épice', 'économie', 'hôtel', 'hôtels', 'chaîne d\'hôtels',
    // Suggestions du 2026-10-13
    'culinaire', 'sidérurgi*', 'charbonnage', 'taxe', 'taxation',
    // Suggestions du 2026-10-13 (3e tour)
    'capitalisme', 'amande', 'pâtes alimentaires',
    // Suggestions du 2026-10-14 (4e tour)
    'commerce de détail', 'charbon', 'centrale solaire', 'secteur de l\'énergie', 'bank', 'agroalimentaire',
    'agriculture', 'tourisme',
  ],
  'Médias': [
    'journaliste', 'humoriste', 'animateur', 'animatrice', 'présentateur', 'présentatrice', 'chroniqueur',
    'chroniqueuse', 'éditorialiste', 'reporter', 'youtubeur', 'youtubeuse', 'vidéaste', 'influenceur',
    'influenceuse', 'podcasteur', 'streameur', 'streameuse', 'émission de télévision', 'émission de radio',
    'émission', 'chaîne de télévision', 'station de radio', 'radio', 'journal', 'quotidien',
    'hebdomadaire', 'magazine', 'revue', 'périodique', 'agence de presse', 'site web', 'site internet',
    'réseau social', 'blogueur', 'blogueuse', 'personnalité de la télévision', 'télé-réalité', 'jeu télévisé',
    'humour', 'one-man-show', 'stand-up', 'imitateur', 'imitatrice',
    'miss', 'émetteur', 'audiovisuel',
    // Suggestions du 2026-10-13
    'média', 'concours de beauté',
    // Suggestions du 2026-10-14 (4e tour)
    'télé', 'tv',
    // Phase 3 Wikipédia, 2026-10-24 : « presse » seul est retiré (« gaufré par presse », Cuir de Venise) ; restent les emplois du journalisme
    'presse écrite', 'presse quotidienne', 'presse magazine', 'presse people', 'presse spécialisée', 'presse régionale',
    'presse nationale', 'presse locale', 'presse en ligne', 'presse gratuite', 'presse d\'information', 'presse hebdomadaire',
    'presse papier', 'attaché de presse', 'attachée de presse', 'conférence de presse', 'liberté de la presse', 'groupe de presse',
    'titre de presse', 'patron de presse', 'photographe de presse', 'dessinateur de presse', 'revue de presse',
  ],
  'Sciences': [
    'scientifique', 'chercheur', 'chercheuse', 'physicien', 'physicienne', 'chimiste', 'biologiste',
    'mathématicien', 'mathématicienne', 'médecin', 'chirurgien', 'chirurgienne', 'psychologue', 'psychiatre',
    'psychanalyste', 'ingénieur', 'ingénieure', 'inventeur', 'inventrice', 'informaticien', 'informaticienne',
    'géologue', 'botaniste', 'zoologiste', 'entomologiste', 'naturaliste', 'ornithologue', 'généticien',
    'neurologue', 'pharmacien', 'pharmacienne', 'vétérinaire', 'sociologue', 'historien', 'historienne',
    'philosophe', 'linguiste', 'archéologue', 'anthropologue', 'ethnologue', 'géographe', 'universitaire',
    'érudit', 'savant', 'statisticien', 'astrophysicien', 'composé chimique', 'élément chimique',
    'molécule', 'protéine', 'enzyme', 'gène', 'maladie', 'syndrome', 'médicament', 'théorème', 'équation',
    'unité de mesure', 'stéréoisomères', 'stréréoisomères', 'isomère', 'loi de probabilité', 'concept',
    'théorie', 'algorithme', 'langage de programmation', 'logiciel', 'système d\'exploitation', 'ordinateur',
    'technologie', 'université', 'école', 'lycée', 'collège', 'institut', 'laboratoire', 'centre de recherche',
    'centre de recherches', 'académie', 'philosophie', 'mathématiques', 'physique', 'chimie', 'biologie',
    'médecine', 'anatomie', 'scissure', 'composé chimique', 'composé organique', 'composé inorganique', 'distribution de probabilité', 'navigateur web', 'gaz noble', 'muscle', 'os', 'nerf', 'organe', 'hôpital', 'centre hospitalier',
    'minéral', 'roche', 'alliage', 'particule', 'langue', 'dialecte', 'alphabet', 'écriture', 'grammaire',
    'sismologue', 'sociolinguiste', 'romaniste', 'égyptologue', 'paléontologue', 'thérapie', 'tumeur', 'cancer', 'cortex', 'pathologique', 'fibre alimentaire', 'gélule', 'philosophique', 'conjecture', 'composés chimiques', 'météorologie', 'nuage', 'nuages', 'cœur', 'sang', 'acidité', 'outil frontend', 'programmation',
    // Suggestions du 2026-10-13
    'agronome', 'herpétologiste', 'politologue', 'linguistique', 'diacritique', 'ponctuation', 'unicode', 'lettre arabe',
    'protocole', 'chiffrement', 'sismi*', 'galvanique', 'enseignement',
    // Suggestions du 2026-10-13 (3e tour)
    'mots de passe', 'scolaire',
    // Suggestions du 2026-10-14 (4e tour)
    'allergie', 'épidémiologie', 'autisme', 'urine', 'oculaire', 'médical', 'classe de complexité', 'linux',
    'software', 'protocol', 'compression de données', 'polym*', 'laser', 'semi-conducteur', 'électron',
    'diffraction', 'fermentation', 'diviseur',
    // Mots manquants de Ranger (2026-10-23) : ⚠ une base de données électorale irait aussi en Sciences
    'base de données',
    // Phase 3 Wikipédia, 2026-10-24 : « société » seul donne l'Économie (Ethnoprimatologie)
    'sociétés humaines', 'société humaine',
  ],
  'Espace': [
    'astéroïde', 'galaxie', 'constellation', 'nébuleuse', 'étoile', 'planète', 'exoplanète', 'planète mineure',
    'satellite naturel', 'lune de', 'comète', 'amas', 'amas globulaire', 'amas ouvert', 'cratère', 'quasar',
    'pulsar', 'trou noir', 'supernova', 'mission spatiale', 'sonde spatiale', 'satellite artificiel',
    'astronaute', 'cosmonaute', 'astronome', 'objet céleste', 'objet transneptunien', 'système stellaire',
    'naine blanche', 'naine brune', 'géante rouge', 'météorite', 'astronomie', 'spatial', 'spatiale',
    'astronomique', 'fusée',
    // Suggestions du 2026-10-13
    'corona', 'satellite',
    // Suggestions du 2026-10-14 (4e tour)
    'ngc', 'télescope',
  ],
  'Nature': [
    'espèce', 'genre de plantes', 'genre d\'insectes', 'genre d\'araignées', 'genre de poissons',
    'genre d\'oiseaux', 'genre d\'amphibiens', 'genre de reptiles', 'genre de mammifères', 'genre de champignons',
    'genre de mollusques', 'genre de crustacés', 'genre de coléoptères', 'genre de papillons', 'genre de lépidoptères',
    'genre d\'algues', 'genre de bactéries', 'genre de dinosaures', 'famille de plantes', 'famille d\'insectes',
    'famille d\'oiseaux', 'famille de poissons', 'race de chien', 'race de chat', 'race de cheval', 'race bovine',
    'race ovine', 'race de', 'cultivar', 'plante', 'arbre', 'arbuste', 'fleur', 'oiseau', 'mammifère',
    'insecte', 'poisson', 'reptile', 'amphibien', 'champignon', 'dinosaure', 'animal', 'taxon', 'rongeur',
    'araignée', 'papillon', 'coléoptère', 'mollusque', 'crustacé', 'serpent', 'lézard', 'tortue', 'requin',
    'baleine', 'chien', 'chat', 'cheval', 'félin', 'primate', 'singe', 'bactérie', 'virus', 'algue',
    'fougère', 'orchidée', 'parc national', 'parc naturel', 'réserve naturelle', 'aire protégée', 'forêt',
    'écosystème', 'écosystèmes', 'biome',
    'espace naturel', 'parc zoologique', 'parcs zoologiques', 'zoo', 'aquarium', 'genre d\'animaux', 'aromatique', 'œuf',
    // Suggestions du 2026-10-13
    'fossil*', 'super-famille', 'nématode', 'opilion', 'psoque', 'eucaryote', 'espace vert',
    // Suggestions du 2026-10-14 (4e tour)
    'quercus', 'dypsis', 'réserve nationale', 'faune', 'sous-classe',
    // Phase 3 Wikipédia, 2026-10-24 : « mer » seul est de la Géographie (Penilpidia, Actinernus)
    'concombre de mer', 'concombres de mer', 'anémone de mer', 'anémones de mer', 'séquoia',
    // … et les cyclones : « saison 2004 » ne les range pas en Sport (Tempête tropicale Earl)
    'tempête tropicale', 'phénomène cyclonique', 'tempête tropicale de la saison 20*', 'phénomène cyclonique de la saison 20*',
  ],
  'Histoire': [
    'bataille', 'guerre', 'siège', 'sac de', 'révolution', 'dynastie', 'empire', 'royaume', 'roi', 'reine',
    'empereur', 'impératrice', 'pharaon', 'nomarque', 'prince', 'princesse', 'duc', 'duchesse', 'marquis',
    'marquise', 'baron', 'baronne', 'noble', 'aristocrate', 'noblesse', 'famille noble', 'militaire', 'général!',
    'maréchal', 'amiral', 'officier', 'soldat', 'colonel', 'capitaine', 'chevalier', 'explorateur',
    'exploratrice', 'navigatrice', 'aviateur', 'aviatrice', 'pirate', 'corsaire', 'conquistador',
    'catastrophe', 'attentat', 'massacre', 'génocide', 'épidémie', 'pandémie', 'accident', 'naufrage',
    'terrorisme', 'front', 'campagne militaire', 'opération militaire', 'unité militaire', 'régiment',
    'division militaire', 'escadrille', 'armée', 'civilisation', 'période', 'époque', 'âge du bronze',
    'âge du fer', 'préhistoire', 'antiquité', 'moyen âge', 'colonie', 'ancien pays', 'ancienne colonie',
    'ancien état', 'histoire', 'historique', 'événement', 'tueur en série', 'criminel', 'criminelle',
    'meurtrier', 'affaire criminelle', 'gangster', 'mafieux', 'espion', 'espionne', 'condottiere',
    'traité de paix', 'sénateur romain', 'consul romain', 'personnalité de la rome antique', 'grec ancien', 'personnage historique',
    'sultan', 'sultanat', 'khaganat', 'khanat', 'émirat', 'hiéroglyphe', 'peuple', 'peuple autochtone', 'ethnie', 'tribu', 'résistance française', 'camp de concentration', 'mercenaire', 'mercenaires', 'étude et narration du passé',
    // Suggestions du 2026-10-13
    // pas de date seule (jour, mois, année) : il faut l'événement, le personnage, le bâtiment… (2026-10-14)
    'chronologie', 'consul', 'tribun', 'doge', 'sénéchal', 'romain', 'révolte', 'soulèvement',
    // Suggestions du 2026-10-13 (3e tour)
    'armoiries', 'obusier', 'famille patricienne', 'fusilier',
    // Suggestions du 2026-10-14 (4e tour) ; pas les mois : seuls, ils ne disent rien,
    // et avec un événement (« guerre », « bataille »…) la carte est déjà rangée
    'char de combat', 'luftwaffe', 'conflit armé', 'clan', 'duché', 'seigneurie', 'offensive', 'chef amérindien',
    // Phase 3 Wikipédia, 2026-10-24 : le trait d'union cache « amiral » (Friedrich Lützow, « vice-amiral et écrivain militaire »)
    'vice-amiral', 'contre-amiral',
  ],
  'Religion & Mythes': [
    'mythologie', 'personnage de la mythologie', 'homme d\'église', 'femme d\'église', 'dieu', 'déesse', 'divinité', 'saint', 'sainte', 'pape',
    'évêque', 'archevêque', 'cardinal', 'titre cardinalice', 'prêtre', 'moine', 'moniale', 'religieux',
    'religieuse', 'théologien', 'théologienne', 'abbé', 'abbesse', 'prophète', 'apôtre', 'martyr', 'ermite',
    'église', 'cathédrale', 'chapelle', 'basilique', 'temple', 'mosquée', 'synagogue', 'monastère', 'abbaye',
    'couvent', 'prieuré', 'sanctuaire', 'diocèse', 'paroisse', 'ordre religieux', 'congrégation', 'religion',
    'secte', 'bible', 'biblique', 'coran', 'héros grec', 'héroïne grecque', 'créature légendaire',
    'créature mythologique', 'fétiche', 'chamanisme', 'calife', 'imam', 'rabbin', 'pasteur', 'personnage biblique',
    'prélat', 'archidiocèse', 'catholique', 'protestant', 'orthodoxe', 'missionnaire', 'jésuite', 'prédicateur', 'chartreuse', 'liturgie', 'vierge marie', 'apparition mariale', 'mahomet', 'jésus', 'islamique',
    // Suggestions du 2026-10-13
    'gourou', 'sikhisme', 'bouddh*', 'soufisme', 'islam', 'aumônier', 'kabbale', 'concile', 'confucianisme',
    // Suggestions du 2026-10-13 (3e tour)
    'marie de nazareth', 'procession', 'musulman', 'buddha',
  ],
  'Géographie': [
    'commune', 'village', 'ville', 'municipalité', 'localité', 'hameau', 'lieu-dit', 'département',
    'région', 'province', 'canton', 'arrondissement', 'quartier', 'district', 'comté', 'comtés',
    'census-designated place', 'établissement humain', 'division territoriale', 'ancienne commune',
    'intercommunalité', 'communauté de communes', 'communauté d\'agglomération', 'métropole', 'capitale',
    'pays', 'état du', 'état des', 'état souverain', 'état fédéré', 'état insulaire', 'territoire', 'île',
    'archipel', 'îles', 'chef-lieu', 'atoll', 'presqu\'île', 'péninsule', 'montagne', 'mont', 'sommet', 'massif', 'col', 'volcan',
    'glacier', 'lac', 'rivière', 'fleuve', 'ruisseau', 'cours d\'eau', 'affluent', 'canal', 'mer', 'océan',
    'golfe', 'baie', 'détroit', 'cap', 'plage', 'désert', 'vallée', 'plaine', 'plateau', 'cascade',
    'chute d\'eau', 'gorge', 'grotte', 'oblast', 'voïvodie', 'gmina', 'powiat', 'raïon', 'municipio',
    'préfecture', 'subdivision', 'drapeau', 'frontière', 'rue', 'voie', 'avenue', 'boulevard', 'place publique',
    'ville-préfecture', 'colline', 'point culminant', 'freguesia', 'sebkha', 'géographie',
    // Suggestions du 2026-10-13
    'upazila', 'unité urbaine', 'banlieue', 'bourg', 'oasis', 'îlot', 'chutes d\'eau',
    'census designated place', 'secteur communautaire', 'découpage administratif', 'micro-région', 'microrégion', 'méridien',
    // Suggestions du 2026-10-13 (3e tour)
    'sous-préfecture',
    // Suggestions du 2026-10-14 (4e tour)
    'río', 'étang', 'récif', 'caverne', 'township', 'socken', 'amt', 'porte de paris', 'section de',
    // Phase 3 Wikipédia, 2026-10-24 : « paroisse » seule reste religieuse (ici : Irlande, Groenland)
    'townland', 'paroisse civile', 'fjord',
    // … et P2 : leur sujet est un lieu même quand le seul autre mot de lieu est un LIEUX_GENERIQUES tardif (Okroug municipal, Côte de Jor)
    'division municipale', 'site naturel',
  ],
  'Patrimoine': [
    'château', 'château fort', 'monument', 'monument historique', 'musée', 'cathédrale', 'chapelle', 'abbaye',
    'basilique', 'église', 'palais', 'fort', 'forteresse', 'citadelle', 'rempart', 'pont', 'phare', 'moulin',
    'manoir', 'hôtel particulier', 'édifice', 'bâtiment', 'immeuble', 'gratte-ciel', 'tour de', 'site archéologique',
    'statue', 'fontaine', 'jardin', 'parc', 'cimetière', 'mausolée', 'tombe', 'nécropole', 'aqueduc',
    'patrimoine mondial', 'villa', 'domaine', 'théâtre de', 'opéra de', 'salle de spectacle', 'arc de triomphe',
    'lieu de culte', 'demeure', 'maison', 'ferme', 'bastide', 'dolmen', 'menhir', 'pyramide',
    // Suggestions du 2026-10-14 (4e tour)
    'caserne', 'arène', 'maison-atelier',
  ],
  'Transports': [
    'gare', 'station de métro', 'station du métro', 'métro', 'ligne de métro', 'ligne ferroviaire',
    'ligne de chemin de fer', 'chemin de fer', 'voie ferrée', 'voie verte', 'ferroviaire', 'train', 'locomotive', 'wagon',
    'automotrice', 'rame', 'tramway', 'funiculaire', 'téléphérique', 'autoroute', 'route', 'route nationale',
    'route départementale', 'aéroport', 'aérodrome', 'avion', 'aéronef', 'hélicoptère', 'navire', 'bateau',
    'voilier', 'paquebot', 'sous-marin', 'porte-avions', 'cuirassé', 'frégate', 'croiseur', 'destroyer',
    'compagnie aérienne', 'compagnie ferroviaire', 'automobile', 'voiture', 'modèle d\'automobile',
    'modèle de camion', 'camion', 'autobus', 'bus', 'motocyclette', 'moto', 'véhicule', 'port', 'port de',
    'limitation de vitesse', 'signalisation', 'panneau', 'transport', 'transports en commun', 'aviation',
    'constructeur automobile', 'tunnel', 'échangeur', 'pont ferroviaire', 'viaduc', 'canal de navigation',
    'trolleybus', 'voie de communication', 'supercar', 'réseau ter', 'noctambus',
    // Suggestions du 2026-10-13
    'hydravion', 'ferry', 'sloop', 'torpilleur', 'écluse', 'vélopartage', 'unterseeboot', 'limitations de vitesse',
    'chemins de fer',
    // Suggestions du 2026-10-13 (3e tour)
    'chariot', 'aéronaval',
  ],
  'Fiction & Jeux': [
    'personnage de fiction', 'personnage', 'de fiction', 'fictif', 'fictive', 'univers de fiction',
    'jeu vidéo', 'série de jeux vidéo', 'jeu de société', 'jeu de cartes', 'jeu de rôle', 'jeu d\'adresse',
    'jeu', 'jeux', 'jouet', 'poupée', 'franchise', 'super-héros', 'super-héroïne', 'super-vilain', 'anime',
    'dessin animé', 'échecs', 'joueur d\'échecs', 'joueuse d\'échecs', 'pokémon', 'mascotte', 'personnage de jeu vidéo',
    'personnage de bande dessinée', 'personnage de dessin animé', 'personnage de manga', 'les simpson',
  ],
};

// Mots qui ne suffisent pas seuls : la carte va en « !À traiter »
// sauf si un mot sûr de la liste DOMAINES est aussi présent.
const AMBIGUS = [
  'joueur', 'joueuse', 'producteur', 'productrice', 'interprète', 'président', 'présidente', 'dirigeant',
  'dirigeante', 'directeur', 'directrice', 'fondateur', 'fondatrice', 'membre', 'personnalité',
  'professeur', 'professeure', 'enseignant', 'enseignante', 'chef', 'pilote', 'créateur', 'créatrice',
  'saison', 'club', 'course', 'station', 'état', 'homme', 'femme', 'famille', 'groupe', 'genre',
  'organisation', 'association', 'institution', 'prix', 'récompense', 'trophée', 'conseiller',
  'administrateur', 'manager', 'agent', 'consultant', 'collectionneur', 'mécène', 'philanthrope',
  'aventurier', 'aventurière', 'secrétaire général', 'directeur général', 'modèle', 'type', 'série', 'liste', 'résultats',
  // Wikipédia, 2026-10-23 : un navigateur est un marin, un explorateur ou un navigateur web (« navigateur suisse » = Pierre Fehlmann, marin)
  'navigateur',
];

// Reconnues mais volontairement sans étiquette (la recherche suffit).
const IGNORER = [
  'page d\'homonymie', 'page de liste', 'projet wikimedia', 'nom de famille', 'prénom', 'patronyme', 'homonymie',
  // « 291e jour de l'année 1965 » : une date seule ne range pas (2026-10-23)
  'jour de l\'année',
];

// Mots que le bouton « Suggestions » ne propose jamais : les nationalités et les pays (la barre de recherche
// suffit), et les mots déjà refusés. Le féminin et le pluriel suivent, comme pour les domaines : coréen → coréenne.
const PAS_SUGGERER = [
  // refusés (2026-10-13)
  'politique',
  // refusés (2026-10-23) : prénoms (jacques, albert, alexandre, hubert, john), mots trop larges
  'jacques', 'albert', 'alexandre', 'hubert', 'john', 'the', 'san', 'nord', 'siècle', 'action', 'ligne', 'ier', 'campagne',
  // refusé (2026-10-23) : particule d'un nom arabe (Mohamed Ben Kanoun, Muhammad ben Ahmad)
  'ben',
  // refusés (2026-10-23), « Mots manquants » de Ranger : mots courants sans domaine, prénom, lieux
  'base', 'données', 'espace', 'production', 'public', 'personnes', 'étranger', 'écrit', 'fondée', 'œuvre', 'utilisé',
  'destiné', 'josé', 'paris', 'america', 'amérique du nord',
  // refusés (2026-10-23) : plusieurs sens (opération militaire, chirurgicale, administrative ; technique agricole, photographique, chimique)
  'opération', 'technique',
  // refusés (2026-10-14) : plusieurs sens (classe de navires / de trains / sociale ; formation géologique /
  // d'élèves ; distribution Linux / de probabilité / entreprise), « thomas » est un prénom
  'classe', 'distribution', 'formation', 'thomas',
  // une date seule ne range pas en Histoire (2026-10-14)
  'année', 'mois', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre',
  'novembre', 'décembre', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',
  // pays et régions du monde
  'afghanistan', 'afrique', 'afrique du sud', 'albanie', 'algérie', 'allemagne', 'amérique', 'andorre', 'angleterre',
  'angola', 'arabie saoudite', 'argentine', 'arménie', 'asie', 'australie', 'autriche', 'azerbaïdjan', 'bangladesh',
  'belgique', 'biélorussie', 'birmanie', 'bolivie', 'bosnie-herzégovine', 'brésil', 'bulgarie', 'cambodge',
  'cameroun', 'canada', 'chili', 'chine', 'chypre', 'colombie', 'congo', 'corée', 'corée du nord', 'corée du sud',
  'costa rica', 'côte d\'ivoire', 'croatie', 'cuba', 'danemark', 'écosse', 'égypte', 'équateur', 'espagne',
  'estonie', 'états-unis', 'éthiopie', 'europe', 'finlande', 'france', 'géorgie', 'ghana', 'grèce', 'guatemala',
  'guinée', 'haïti', 'honduras', 'hongrie', 'inde', 'indonésie', 'irak', 'iran', 'irlande', 'islande', 'israël',
  'italie', 'jamaïque', 'japon', 'jordanie', 'kazakhstan', 'kenya', 'laos', 'lettonie', 'liban', 'libye',
  'lituanie', 'luxembourg', 'macédoine', 'madagascar', 'malaisie', 'mali', 'malte', 'maroc', 'mexique', 'monaco',
  'mongolie', 'monténégro', 'népal', 'nicaragua', 'niger', 'nigeria', 'nigéria', 'norvège', 'nouvelle-zélande',
  'océanie', 'ouganda', 'ouzbékistan', 'pakistan', 'palestine', 'panama', 'paraguay', 'pays-bas', 'pays de galles',
  'pérou', 'philippines', 'pologne', 'portugal', 'québec', 'roumanie', 'royaume-uni', 'russie', 'salvador',
  'sénégal', 'serbie', 'singapour', 'slovaquie', 'slovénie', 'soudan', 'sri lanka', 'suède', 'suisse', 'syrie',
  'taïwan', 'tanzanie', 'tchad', 'tchécoslovaquie', 'tchéquie', 'thaïlande', 'tunisie', 'turquie', 'ukraine',
  'union soviétique', 'urss', 'uruguay', 'venezuela', 'viêt nam', 'vietnam', 'yougoslavie', 'zimbabwe',
  // nationalités
  'africain', 'albanais', 'algérien', 'allemand', 'alsacien', 'américain', 'anglais', 'arménien', 'argentin',
  'asiatique', 'australien', 'autrichien', 'azerbaïdjanais', 'basque', 'belge', 'biélorusse', 'birman', 'bolivien',
  'bosnien', 'breton', 'brésilien', 'britannique', 'bulgare', 'cambodgien', 'camerounais', 'canadien', 'catalan',
  'chilien', 'chinois', 'colombien', 'congolais', 'coréen', 'corse', 'croate', 'cubain', 'danois', 'dominicain',
  'écossais', 'égyptien', 'équatorien', 'espagnol', 'estonien', 'éthiopien', 'européen', 'finlandais', 'flamand',
  'français', 'gallois', 'géorgien', 'ghanéen', 'grec', 'grecque', 'guatémaltèque', 'haïtien', 'hondurien',
  'hongrois', 'indien', 'indonésien', 'irakien', 'iranien', 'irlandais', 'islandais', 'israélien', 'italien',
  'ivoirien', 'jamaïcain', 'japonais', 'kazakh', 'kényan', 'letton', 'libanais', 'lituanien', 'luxembourgeois',
  'macédonien', 'malaisien', 'malien', 'marocain', 'mexicain', 'monégasque', 'mongol', 'néerlandais',
  'néo-zélandais', 'népalais', 'nigérian', 'nord-coréen', 'norvégien', 'pakistanais', 'panaméen', 'paraguayen',
  'péruvien', 'philippin', 'polonais', 'portoricain', 'portugais', 'québécois', 'roumain', 'russe', 'saoudien',
  'sénégalais', 'serbe', 'singapourien', 'slovaque', 'slovène', 'soviétique', 'sud-africain', 'sud-coréen',
  'suédois', 'suisse', 'syrien', 'taïwanais', 'tchèque', 'thaïlandais', 'tunisien', 'turc', 'turque', 'ukrainien',
  'uruguayen', 'vénézuélien', 'vietnamien', 'wallon',
];

// Expressions que le moteur ne lit pas du tout (elles contiennent un mot de DOMAINES employé dans un autre sens).
// « en général » n'est pas un général de l'armée ; « Password Hashing Competition » est un nom propre, pas du Sport.
// Phase 3 Wikipédia, 2026-10-24.
const PHRASES_NEUTRES = [
  'en général', 'plus général', 'sens général', 'password hashing competition',
];

// Mots de lieu trop généraux pour être le sujet d'une phrase Wikipédia quand ils arrivent tard dans la phrase
// (« …dans le comté de Cavan, en Irlande », « …né dans le 8e arrondissement de Paris »). Seulement pour les phrases
// Wikipédia (jamais les descriptions de cartes) : au début de la phrase (« village de la région de… »), le mot compte comme
// d'habitude ; ailleurs, il ne range la carte que si un autre mot du même domaine le confirme.
// Chaque mot doit exister dans DOMAINES. Phase 3 Wikipédia, 2026-10-24.
const LIEUX_GENERIQUES = [
  'ville', 'comté', 'comtés', 'mer', 'province', 'quartier', 'arrondissement', 'région', 'pays', 'état du', 'état des',
  'département', 'district', 'canton', 'commune', 'capitale', 'territoire', 'océan', 'île', 'îles',
];

// Collections personnelles : la carte reçoit l'étiquette si TOUS les groupes
// ont au moins un mot présent.
const COLLECTIONS = [
  { etiquette: '★Village Polonais', groupes: [['village', 'commune polonaise', 'gmina rurale'], ['pologne', 'polonais', 'voïvodie', 'gmina', 'powiat']] },
];

// Domaines qui ne comptent que s'ils sont le sujet principal (premier domaine trouvé).
// Évite #Géographie sur « église située dans la commune de… ».
const SEULEMENT_EN_PREMIER = ['Géographie'];

// Motifs de titre : la FORME du titre donne le domaine (Suggestions du 2026-10-23, 5e tour).
//   commence : le titre commence par ce mot, suivi d'un nom   « Famille Whitney »
//   finit    : le titre finit par ce texte                    « Kix (groupe) »
//   sauf     : (facultatif) pas si le titre contient déjà un mot sûr de l'un de ces domaines
//              (« Famille de plantes » reste en Nature)
// Comme les mots de DOMAINES, un motif sert quand la description ne donne aucun domaine. Une page à ignorer
// (homonymie, prénom, nom de famille…) l'emporte toujours. Le mot seul (« famille », « groupe ») reste
// ambigu ailleurs : seul le motif complet range la carte.
const MOTIFS_DE_TITRE = [
  { commence: 'famille', domaine: 'Histoire', sauf: ['Nature'] },
  { finit: '(groupe)', domaine: 'Musique' },
];

const MAX_DOMAINES = 5;
const A_TRAITER = '!À traiter';

// Réglages de la lecture dans Wikipédia (Ranger). Ce sont des nombres : change-les ici, nulle part ailleurs.
// Modifier UN réglage fait relire toutes les cartes sans étiquette au prochain Ranger (voulu : les cartes déjà vues
// sont reclassées avec le nouveau réglage).
const REGLAGES = {
  wikipedia: {
    lot: 20,                  // titres demandés par requête : limite de Wikipédia (20 extraits renvoyés au plus), ne pas changer
    extrait: 500,             // caractères d'introduction demandés par article : limite de Wikipédia, ne pas changer
    pauseMs: 1000,            // pause entre deux requêtes (environ une par seconde)
    tentativesTitre: 3,       // un titre qui disparaît de la réponse est redemandé, 3 fois au plus
    essaisAppel: 3,           // une requête en erreur 429 ou 5xx est refaite, 3 fois au plus
    delaiEssaisMs: 3000,      // attente entre deux essais d'une requête en erreur
    retenteJours: 30,         // un titre absent ou sans résumé exploitable est retenté après ce nombre de jours
    essai: 40,                // « Essai Wikipédia » : les 40 premières cartes concernées seulement
    fenetreVerbe: 300,        // « est un / une / le / la » est cherché dans les 300 premiers caractères de l'extrait
    longueurPhrase: 250,      // longueur au plus du morceau de phrase gardé
    repli: 150,               // coupe au dernier espace avant 250, sans descendre sous ce nombre de caractères
    secondDomaineMots: 3,     // dans une phrase Wikipédia, un second domaine n'est gardé que si son mot est parmi les 3 premiers mots
    lieuGeneriqueMots: 5,     // dans une phrase Wikipédia, un mot de LIEUX_GENERIQUES après les 5 premiers mots ne range pas la carte
    precisionMinimale: 0.95,  // précision exigée de la référence par `npm run essai` et les tests ; relevée à chaque amélioration, cible 0.95 (docs/suivi-wikipedia.md)
  },
};

// ═══════════════════════════════════════════════════════════════════
//  MOTEUR DE CLASSEMENT — pas besoin d'y toucher
// ═══════════════════════════════════════════════════════════════════

const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[’`]/g, "'").replace(/œ/g, 'oe').replace(/æ/g, 'ae');

const FEMININS = [['eur', ['euse', 'rice']], ['ien', ['ienne']], ['ier', ['iere']], ['if', ['ive']],
  ['eux', ['euse']], ['el', ['elle']], ['on', ['onne']], ['en', ['enne']]];

const kwRegex = (kw) => {
  let k = norm(kw).trim();
  const prefix = k.endsWith('*');
  const exact = k.endsWith('!') || (!prefix && k.replace(/[^a-z]/g, '').length <= 4);
  k = k.replace(/[*!]$/, '');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
  let forms = [k];
  if (!prefix && !exact) {
    for (const [fin, fems] of FEMININS) if (k.endsWith(fin)) fems.forEach((f) => forms.push(k.slice(0, -fin.length) + f));
  }
  const body = '(?:' + forms.map(esc).join('|') + ')';
  const tail = prefix ? "[a-z0-9']*" : exact ? '' : '(?:e|es|s|x)?';
  // pas de correspondance collée à un trait d'union : « saint » ne trouve pas « Saint-Priest »
  return new RegExp('(?<![a-z0-9-])' + body + tail + '(?![a-z0-9]|-[a-z])', 'g');
};

const buildIndex = () => {
  const entries = [];
  for (const [dom, kws] of Object.entries(DOMAINES)) for (const kw of kws) entries.push({ kw, kind: 'sur', dom });
  for (const kw of AMBIGUS) entries.push({ kw, kind: 'ambigu' });
  for (const kw of IGNORER) entries.push({ kw, kind: 'ignore' });
  // regroupe les mots partagés par plusieurs domaines
  const byKw = new Map();
  for (const e of entries) {
    const k = norm(e.kw) + '|' + e.kind;
    if (!byKw.has(k)) byKw.set(k, { kw: e.kw, kind: e.kind, doms: [], re: kwRegex(e.kw), len: norm(e.kw).replace(/\*$/, '').length });
    if (e.dom && !byKw.get(k).doms.includes(e.dom)) byKw.get(k).doms.push(e.dom);
  }
  // les expressions longues d'abord ; à longueur égale, les mots sûrs avant les ambigus
  const order = { ignore: 0, sur: 1, ambigu: 2 };
  return [...byKw.values()].sort((a, b) => b.len - a.len || order[a.kind] - order[b.kind]);
};

const INDEX = buildIndex();

// Analyse un texte : renvoie les correspondances avec leur position.
const scan = (text, onlyAtStart = false) => {
  let work = norm(text);
  // les expressions de PHRASES_NEUTRES sont effacées (même longueur : les positions ne changent pas)
  for (const p of PHRASES_NEUTRES) {
    const re = new RegExp('(?<![a-z0-9])' + norm(p).replace(/ /g, '\\s+') + '(?![a-z0-9])', 'g');
    work = work.replace(re, (m) => ' '.repeat(m.length));
  }
  const hits = [];
  for (const e of INDEX) {
    e.re.lastIndex = 0;
    let m;
    while ((m = e.re.exec(work))) {
      if (!onlyAtStart || m.index === 0) hits.push({ pos: m.index, kind: e.kind, doms: e.doms, kw: e.kw });
      work = work.slice(0, m.index) + ' '.repeat(m[0].length) + work.slice(m.index + m[0].length);
      e.re.lastIndex = m.index + m[0].length;
    }
  }
  return hits.sort((a, b) => a.pos - b.pos);
};

// Analyse une phrase venue de Wikipédia (jamais une description de carte). Elle dit d'abord ce qu'est la carte :
// le premier domaine reste toujours, un domaine suivant ne reste que si son mot est parmi les REGLAGES.wikipedia.secondDomaineMots
// premiers mots de la phrase (« …dirigée par l'écrivain et explorateur Christian Clot » : explorateur est un détail, pas un domaine).
// Une seule fonction pour Ranger (planAvecPhrase) et pour la mesure (classerPhrase), via classer(carte, true).
const motsAvant = (texte, pos) => (norm(texte).slice(0, pos).match(/[a-z0-9]+/g) || []).length;
// Un mot de LIEUX_GENERIQUES loin dans la phrase (après les REGLAGES.wikipedia.lieuGeneriqueMots premiers mots) n'est pas
// le sujet de la carte : « …né dans le 8e arrondissement de Paris » ne range pas en Géographie. Au début, il reste.
// Si c'était le premier mot de domaine de la phrase, il n'y a plus de « premier domaine » à garder : tout mot suivant doit
// alors être parmi les premiers mots (sinon un détail tardif deviendrait le sujet : « …à 5 km de la ville d'El Jadida, constituée de résidences »).
const lieuxGeneriques = new Set(LIEUX_GENERIQUES.map(norm));
const scanPhrase = (phrase) => {
  const tous = scan(phrase);
  const premier = tous.find((h) => h.kind === 'sur');
  return tous.filter((h) => {
    if (h.kind !== 'sur') return true;
    const rang = motsAvant(phrase, h.pos);
    if (lieuxGeneriques.has(norm(h.kw)) && rang >= REGLAGES.wikipedia.lieuGeneriqueMots) return false;
    return h === premier || rang < REGLAGES.wikipedia.secondDomaineMots;
  });
};

// Classe une carte { t: titre, d: description }. `deWikipedia` : d est une phrase Wikipédia (voir scanPhrase).
// Renvoie { etiquettes: [...], statut: 'classee'|'a_traiter'|'ignoree'|'inconnue', source, mots }.
const classer = (carte, deWikipedia = false) => {
  // le titre : la parenthèse d'abord (« Cherry (film, 2021) »)
  const titre = () => {
    const paren = (carte.t.match(/\(([^)]*)\)/) || [])[1] || '';
    const reste = carte.t.replace(/\([^)]*\)/g, ' ').trim();
    const lus = [...scan(paren), ...scan(reste).map((h) => ({ ...h, pos: h.pos + 1000 }))];
    // motifs de titre (MOTIFS_DE_TITRE) : jamais sur une page à ignorer, ni quand un domaine « sauf » est déjà là
    if (lus.some((h) => h.kind === 'ignore')) return lus;
    const nt = norm(carte.t).trim();
    const motifs = [];
    for (const m of MOTIFS_DE_TITRE) {
      const debut = m.commence && nt.startsWith(norm(m.commence)) && /^\s+[a-z]/.test(nt.slice(norm(m.commence).length));
      const fin = m.finit && nt.endsWith(norm(m.finit));
      const exclu = (m.sauf || []).some((d) => lus.some((h) => h.kind === 'sur' && h.doms.includes(d)));
      if ((debut || fin) && !exclu) motifs.push({ pos: 0, kind: 'sur', doms: [m.domaine], kw: m.commence || m.finit });
    }
    return [...motifs, ...lus];
  };
  let hits, source;
  if (carte.d && carte.d.trim()) {
    hits = deWikipedia ? scanPhrase(carte.d) : scan(carte.d); source = 'description';
    // description sans domaine (et pas une page à ignorer) : le titre en secours (« Miss Moldavie — concours de beauté »)
    if (!hits.some((h) => h.kind === 'sur' || h.kind === 'ignore')) {
      const t = titre();
      if (t.some((h) => h.kind === 'sur')) { hits = [...hits, ...t.map((h) => ({ ...h, pos: h.pos + 10000 }))]; source = 'titre'; }
    }
  } else {
    hits = titre(); source = 'titre';
  }
  let doms = [];
  for (const h of hits) if (h.kind === 'sur') for (const d of h.doms) if (!doms.includes(d)) doms.push(d);
  doms = doms.filter((d, i) => i === 0 || !SEULEMENT_EN_PREMIER.includes(d));
  const etiquettes = doms.slice(0, MAX_DOMAINES);
  const texte = norm(carte.d + ' ' + carte.t);
  for (const c of COLLECTIONS) {
    if (c.groupes.every((g) => g.some((w) => kwRegex(w).test(texte)))) etiquettes.push(c.etiquette);
  }
  const mots = hits.map((h) => h.kw);
  if (doms.length) return { etiquettes, statut: 'classee', source, mots };
  // une page à ignorer l'emporte sur un mot ambigu : « liste d'un projet Wikimedia »
  if (hits.some((h) => h.kind === 'ignore')) return { etiquettes, statut: 'ignoree', source, mots };
  if (hits.some((h) => h.kind === 'ambigu')) return { etiquettes: [...etiquettes, A_TRAITER], statut: 'a_traiter', source, mots };
  return { etiquettes, statut: 'inconnue', source, mots };
};
