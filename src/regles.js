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
    'auteure-compositrice-interprète', 'autrice-compositrice-interprète', 'auteure-compositrice', 'girls band', 'boys band', 'chant', 'composition', 'piano', 'manager musical', 'discographie', 'concert', 'tournée',
  ],
  'Littérature': [
    'écrivain', 'écrivaine', 'romancier', 'romancière', 'poète', 'poétesse', 'auteur', 'autrice',
    'essayiste', 'dramaturge', 'nouvelliste', 'éditeur', 'éditrice', 'maison d\'édition', 'roman!', 'livre',
    'recueil', 'poème', 'poésie', 'pièce de théâtre', 'bande dessinée', 'série de bande dessinée',
    'scénariste de bande dessinée', 'auteur de bande dessinée', 'mangaka', 'manga', 'traducteur', 'traductrice',
    'critique littéraire', 'prix littéraire', 'conte', 'fabuliste', 'biographe', 'mémorialiste', 'librettiste',
    'littérature', 'homme de lettres', 'femme de lettres', 'littéraire', 'nouvelle de', 'œuvre littéraire',
    'auteure', 'expression latine', 'proverbe', 'locution', 'rhétorique', 'philologue',
  ],
  'Arts': [
    'peintre', 'sculpt*', 'artiste', 'illustrateur', 'illustratrice', 'dessinateur', 'dessinatrice',
    'photographe', 'architecte', 'chorégraphe', 'danseur', 'danseuse', 'danse', 'ballet', 'graveur', 'graveuse',
    'céramiste', 'designer', 'styliste', 'couturier', 'couturière', 'mannequin', 'tableau', 'peinture',
    'sculpture', 'œuvre d\'art', 'fresque', 'vitrail', 'mouvement artistique', 'courant artistique',
    'style architectural', 'calligraphe', 'orfèvre', 'ébéniste', 'lithographie', 'gravure', 'photographie',
    'metteur en scène', 'metteuse en scène', 'théâtre', 'cirque', 'marionnettiste', 'peinture murale',
    'aquarelle', 'estampe', 'art', 'arts', 'esthétique',
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
  ],
  'Médias': [
    'journaliste', 'humoriste', 'animateur', 'animatrice', 'présentateur', 'présentatrice', 'chroniqueur',
    'chroniqueuse', 'éditorialiste', 'reporter', 'youtubeur', 'youtubeuse', 'vidéaste', 'influenceur',
    'influenceuse', 'podcasteur', 'streameur', 'streameuse', 'émission de télévision', 'émission de radio',
    'émission', 'chaîne de télévision', 'station de radio', 'radio', 'journal', 'quotidien',
    'hebdomadaire', 'magazine', 'revue', 'périodique', 'presse', 'agence de presse', 'site web', 'site internet',
    'réseau social', 'blogueur', 'blogueuse', 'personnalité de la télévision', 'télé-réalité', 'jeu télévisé',
    'humour', 'one-man-show', 'stand-up', 'imitateur', 'imitatrice',
    'miss', 'émetteur', 'audiovisuel',
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
  ],
  'Espace': [
    'astéroïde', 'galaxie', 'constellation', 'nébuleuse', 'étoile', 'planète', 'exoplanète', 'planète mineure',
    'satellite naturel', 'lune de', 'comète', 'amas', 'amas globulaire', 'amas ouvert', 'cratère', 'quasar',
    'pulsar', 'trou noir', 'supernova', 'mission spatiale', 'sonde spatiale', 'satellite artificiel',
    'astronaute', 'cosmonaute', 'astronome', 'objet céleste', 'objet transneptunien', 'système stellaire',
    'naine blanche', 'naine brune', 'géante rouge', 'météorite', 'astronomie', 'spatial', 'spatiale',
    'lanceur', 'astronomique', 'fusée',
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
  ],
  'Histoire': [
    'bataille', 'guerre', 'siège', 'sac de', 'révolution', 'dynastie', 'empire', 'royaume', 'roi', 'reine',
    'empereur', 'impératrice', 'pharaon', 'nomarque', 'prince', 'princesse', 'duc', 'duchesse', 'marquis',
    'marquise', 'baron', 'baronne', 'noble', 'aristocrate', 'noblesse', 'famille noble', 'militaire', 'général!',
    'maréchal', 'amiral', 'officier', 'soldat', 'colonel', 'capitaine', 'chevalier', 'explorateur',
    'exploratrice', 'navigateur', 'navigatrice', 'aviateur', 'aviatrice', 'pirate', 'corsaire', 'conquistador',
    'catastrophe', 'attentat', 'massacre', 'génocide', 'épidémie', 'pandémie', 'accident', 'naufrage',
    'terrorisme', 'front', 'campagne militaire', 'opération militaire', 'unité militaire', 'régiment',
    'division militaire', 'escadrille', 'armée', 'civilisation', 'période', 'époque', 'âge du bronze',
    'âge du fer', 'préhistoire', 'antiquité', 'moyen âge', 'colonie', 'ancien pays', 'ancienne colonie',
    'ancien état', 'histoire', 'historique', 'événement', 'tueur en série', 'criminel', 'criminelle',
    'meurtrier', 'affaire criminelle', 'gangster', 'mafieux', 'espion', 'espionne', 'condottiere',
    'traité de paix', 'sénateur romain', 'consul romain', 'personnalité de la rome antique', 'grec ancien', 'personnage historique',
    'sultan', 'sultanat', 'khaganat', 'khanat', 'émirat', 'hiéroglyphe', 'peuple', 'peuple autochtone', 'ethnie', 'tribu', 'résistance française', 'camp de concentration', 'mercenaire', 'mercenaires', 'étude et narration du passé',
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
    'préfecture', 'subdivision', 'drapeau', 'frontière', 'rue', 'avenue', 'boulevard', 'place publique',
    'ville-préfecture', 'colline', 'point culminant', 'freguesia', 'sebkha', 'géographie',
  ],
  'Patrimoine': [
    'château', 'château fort', 'monument', 'monument historique', 'musée', 'cathédrale', 'chapelle', 'abbaye',
    'basilique', 'église', 'palais', 'fort', 'forteresse', 'citadelle', 'rempart', 'pont', 'phare', 'moulin',
    'manoir', 'hôtel particulier', 'édifice', 'bâtiment', 'immeuble', 'gratte-ciel', 'tour de', 'site archéologique',
    'statue', 'fontaine', 'jardin', 'parc', 'cimetière', 'mausolée', 'tombe', 'nécropole', 'aqueduc',
    'patrimoine mondial', 'villa', 'domaine', 'théâtre de', 'opéra de', 'salle de spectacle', 'arc de triomphe',
    'lieu de culte', 'demeure', 'maison', 'ferme', 'bastide', 'dolmen', 'menhir', 'pyramide',
  ],
  'Transports': [
    'gare', 'station de métro', 'station du métro', 'métro', 'ligne de métro', 'ligne ferroviaire',
    'ligne de chemin de fer', 'chemin de fer', 'voie ferrée', 'ferroviaire', 'train', 'locomotive', 'wagon',
    'automotrice', 'rame', 'tramway', 'funiculaire', 'téléphérique', 'autoroute', 'route', 'route nationale',
    'route départementale', 'aéroport', 'aérodrome', 'avion', 'aéronef', 'hélicoptère', 'navire', 'bateau',
    'voilier', 'paquebot', 'sous-marin', 'porte-avions', 'cuirassé', 'frégate', 'croiseur', 'destroyer',
    'compagnie aérienne', 'compagnie ferroviaire', 'automobile', 'voiture', 'modèle d\'automobile',
    'modèle de camion', 'camion', 'autobus', 'bus', 'motocyclette', 'moto', 'véhicule', 'port', 'port de',
    'limitation de vitesse', 'signalisation', 'panneau', 'transport', 'transports en commun', 'aviation',
    'constructeur automobile', 'tunnel', 'échangeur', 'pont ferroviaire', 'viaduc', 'canal de navigation',
    'trolleybus', 'voie de communication', 'supercar', 'réseau ter', 'noctambus',
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
];

// Reconnues mais volontairement sans étiquette (la recherche suffit).
const IGNORER = [
  'page d\'homonymie', 'page de liste', 'projet wikimedia', 'nom de famille', 'prénom', 'patronyme', 'homonymie',
];

// Collections personnelles : la carte reçoit l'étiquette si TOUS les groupes
// ont au moins un mot présent.
const COLLECTIONS = [
  { etiquette: '★Village Polonais', groupes: [['village'], ['pologne', 'polonais', 'voïvodie', 'gmina', 'powiat']] },
];

// Domaines qui ne comptent que s'ils sont le sujet principal (premier domaine trouvé).
// Évite #Géographie sur « église située dans la commune de… ».
const SEULEMENT_EN_PREMIER = ['Géographie'];

const MAX_DOMAINES = 5;
const A_TRAITER = '!À traiter';

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

// Classe une carte { t: titre, d: description }.
// Renvoie { etiquettes: [...], statut: 'classee'|'a_traiter'|'ignoree'|'inconnue', source, mots }.
const classer = (carte) => {
  let hits, source;
  if (carte.d && carte.d.trim()) {
    hits = scan(carte.d); source = 'description';
  } else {
    // sans description : le titre (la parenthèse d'abord : « Cherry (film, 2021) »)
    const paren = (carte.t.match(/\(([^)]*)\)/) || [])[1] || '';
    const reste = carte.t.replace(/\([^)]*\)/g, ' ').trim();
    hits = [...scan(paren), ...scan(reste).map((h) => ({ ...h, pos: h.pos + 1000 }))];
    source = 'titre';
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
  if (hits.some((h) => h.kind === 'ambigu')) return { etiquettes: [...etiquettes, A_TRAITER], statut: 'a_traiter', source, mots };
  if (hits.some((h) => h.kind === 'ignore')) return { etiquettes, statut: 'ignoree', source, mots };
  return { etiquettes, statut: 'inconnue', source, mots };
};
