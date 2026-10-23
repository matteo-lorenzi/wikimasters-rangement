#!/usr/bin/env python3
"""Réintroduit chaque bug déjà livré, un à la fois, dans une copie des sources,
lance le test qui le surveille, et exige qu'il le DÉTECTE (sortie en échec).

    python scripts/regressions.py             toutes les mutations (~2 min)
    python scripts/regressions.py recherche   seulement celles dont le nom contient « recherche »
    python scripts/regressions.py --ancres    vérifie seulement que chaque texte d'origine est
                                              présent une fois (instantané, lancé par build.sh)

Les tests lisent les sources dans le dossier indiqué par WMR_SRC (voir test/charger.js).
Un bug corrigé ajoute ici sa mutation : (nom, fichier, texte d'origine, texte fautif, test).
« test » est le début du nom du ou des tests qui doivent passer au rouge : seuls eux sont lancés.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RACINE, 'src')

MUTATIONS = [
    ('carte sans <p> ignorée', 'app.js',
     "if (!card || card.closest('#wmr-host')",
     "if (!card || !card.querySelector('p') || card.closest('#wmr-host')",
     "lecture d'une vue : pagination tardive"),
    ('« Terminé » non géré', 'app.js',
     "if (!(await attendre(() => bouton(/^Terminé$/) || refus(), 90000))) {",
     "if (!(await attendre(() => true, 90000))) {",
     "pose lente"),
    ('compteur « (n) » gardé dans le libellé du filtre', 'app.js',
     "const actuel = f ? f.innerText.trim().replace(/ \\(\\d+\\)$/, '') : '';",
     "const actuel = f ? f.innerText.trim() : '';",
     "filtre d'étiquette : le compteur"),
    ('arrêt quand la page change après un étiquetage', 'app.js',
     "journal(`  ↺ le site est revenu page ${pi[0]} : retour page ${num}`);",
     "return poses;",
     "le site revient en page 1 après un étiquetage"),
    ('panneau hidden annulé par le CSS', 'app.js',
     "const montrer = (el, oui) => { el.hidden = !oui; el.style.display = oui ? '' : 'none'; };",
     "const montrer = (el, oui) => { el.hidden = !oui; };",
     "le panneau s'ouvre et se ferme"),
    ('rangement dans « Toutes les étiquettes » au lieu de « Sans étiquette »', 'app.js',
     "await choisirFiltre('');\n  await choisirTri('Date d\\'ajout');\n  let abandons = 0;\n  for (const [i, g] of groupes.entries()) {",
     "await choisirFiltre(null);\n  await choisirTri('Date d\\'ajout');\n  let abandons = 0;\n  for (const [i, g] of groupes.entries()) {",
     "Ranger : chaque carte reçoit ses étiquettes"),
    ('lecture qui suit le total de pages annoncé', 'app.js',
     "if (attendu != null ? vus >= attendu : n < PAR_PAGE) return;",
     "const pi = pageInfo(); if (attendu != null ? vus >= attendu : (pi ? num >= pi[1] : n < PAR_PAGE)) return;",
     "lecture d'une vue : pagination tardive"),
    ('pose refusée par le site : 90 s d\'attente puis message trompeur', 'app.js',
     "if (!(await attendre(() => bouton(/^Terminé$/) || refus(), 90000))) {",
     "if (!(await attendre(() => bouton(/^Terminé$/), 90000))) {",
     "pose refusée"),
    ('chargement raté pris pour la fin de la vue', 'app.js',
     "const echecChargement = () => /chargement de la collection a échoué/i.test(texte());",
     "const echecChargement = () => false;",
     "chargement en échec"),
    ('pose réussie oubliée quand la liste ne se recharge pas ensuite', 'app.js',
     "    const bilan = await poserEtiquette(tag);\n",
     "    const bilan = await poserEtiquette(tag);\n    await attendrePageStable();\n",
     "raté du site pendant le rangement"),
    ('reprise après rechargement qui oublie ce qui était déjà posé', 'app.js',
     "const fait = new Set(store.get('ranger_fait', []));",
     "const fait = new Set();",
     "raté du site pendant le rangement"),
    ('rechargements comptés sur toute la séance, même quand des cartes sont rangées entre deux', 'app.js',
     "const essais = meme && poses <= (r.poses || 0) ? r.essais : 0;",
     "const essais = meme ? r.essais : 0;",
     "ratés espacés, avec des cartes rangées entre deux"),
    ('recherche ratée par le serveur : pas de relance sur place', 'app.js',
     "if (!(e instanceof PanneSite) || !mot || essai >= 2) throw e;",
     "throw e;",
     "recherche ratée pendant le rangement groupé"),
    ('menu des étiquettes encore vide : options pas attendues', 'app.js',
     "      await attendre(option, 10000);\n",
     "",
     "menu des étiquettes encore vide"),
    ('« Tout sélectionner (page) » sans décocher les cartes en trop', 'app.js',
     "if (cles.has(cle(lireCarte(el))) !== estSelectionnee(el)) await basculer(el);",
     "if (cles.has(cle(lireCarte(el))) && !estSelectionnee(el)) await basculer(el);",
     "plus de la moitié de la page à poser"),
    ('règles changées : Ranger ne relit que les nouvelles cartes', 'app.js',
     "const depuis = tout || changees ? null",
     "const depuis = tout ? null",
     "Ranger : les règles ont changé"),
    ('Compléter : plus de 5 domaines sur une carte', 'app.js',
     "&& !ont.includes(t)).slice(0, place);",
     "&& !ont.includes(t));",
     "Compléter : 5 domaines au plus"),
    ('Compléter : reprise après rechargement qui oublie ce qui était déjà posé', 'app.js',
     "const fait = new Set(store.get('completer_fait', []) || []);",
     "const fait = new Set();",
     "Compléter : raté du site en cours de route"),
    ('Wikipédia : un titre disparu de la réponse n\'est pas remis dans la file', 'app.js',
     "if (n < WIKI_TENTATIVES) file.push(t);",
     "if (false) file.push(t);",
     "Wikipédia : un titre qui disparaît"),
    ('Wikipédia : cache ignoré, tout est relu à chaque Ranger', 'app.js',
     "const aLire = titres.filter((t) => !wikiFrais(wikiEntree(t)));",
     "const aLire = titres;",
     "Wikipédia : cache, un deuxième Ranger"),
    ('Wikipédia : lots de 50 titres (20 extraits seulement par requête)', 'app.js',
     "const WIKI_LOT = 20;",
     "const WIKI_LOT = 50;",
     "Wikipédia : 45 titres lus par lots de 20"),
    ('Wikipédia : page d\'homonymie lue comme un résumé', 'app.js',
     "const wikiPhrase = (e) => (e && !e.absent && !e.homonymie ? morceauWikipedia(e.extrait) : null);",
     "const wikiPhrase = (e) => (e && !e.absent ? morceauWikipedia(e.extrait) : null);",
     "Wikipédia : page d'homonymie"),
    ('Wikipédia : essai de 40 cartes ignoré', 'app.js',
     "const lues = essai ? concernees.slice(0, WIKI_ESSAI) : concernees;",
     "const lues = concernees;",
     "Wikipédia : essai de 40 cartes"),
    ('Wikipédia bloquée : Ranger s\'arrête au lieu de continuer sans Wikipédia', 'app.js',
     "try { q = await appelWikipedia(lot); } catch (e) { if (STOP) throw e; return e; }",
     "try { q = await appelWikipedia(lot); } catch (e) { throw e; }",
     "Wikipédia bloquée (réseau"),
    ('Wikipédia : les cartes laissées de côté par l\'essai sont oubliées', 'app.js',
     "else if (lues.length < concernees.length) store.set('wiki_reste', { raison: 'essai' });",
     "else if (lues.length < concernees.length) store.set('wiki_reste', null);",
     "Wikipédia : les cartes laissées de côté par l'essai"),
    ('Suggestions : un exemplaire en double compte pour deux cartes', 'app.js',
     "if (x.cles.has(cle(c))) continue; // un exemplaire en double ne compte pas pour une deuxième carte",
     "if (false) continue; // un exemplaire en double ne compte pas pour une deuxième carte",
     "suggestions : un exemplaire en double"),
    ('Mesure Wikipédia : phrase ambiguë notée comme phrase sans règle', 'app.js',
     "w.statut === 'a_traiter' ? 'phrase-ambigue' : 'phrase-sans-regle';",
     "w.statut === 'a_traiter' ? 'phrase-sans-regle' : 'phrase-sans-regle';",
     "rapport Wikipédia : écrit dans le stockage"),
    ('Mesure Wikipédia : jugement sans la condition « aucun domaine non attendu »', 'app.js',
     "return domaines.some((d) => v.attendu.includes(d)) && domaines.every((d) => ok.has(d)) ? 'juste' : 'fausse';",
     "return domaines.some((d) => v.attendu.includes(d)) ? 'juste' : 'fausse';",
     "essai : jugement"),
    ('Mesure Wikipédia : construction du rapport sans protection, Ranger s\'arrête', 'app.js',
     "noterBug(e, 'rapport Wikipédia impossible à construire : Ranger continue sans lui');",
     "throw e;",
     "rapport Wikipédia : la construction du rapport lève"),
    ('Mesure Wikipédia : affichage du rapport sans protection, aperçu perdu', 'app.js',
     "noterBug(e, 'rapport Wikipédia impossible à afficher : aperçu sans lui');",
     "throw e;",
     "rapport Wikipédia : l'affichage du rapport lève"),
    ('Mesure Wikipédia : mesure sans protection pendant la lecture, Ranger s\'arrête', 'app.js',
     "  try { f(wikiMesure); } catch (e) {\n    wikiMesure = null;\n    noterBug(e, 'mesure Wikipédia impossible : la lecture continue sans elle, pas de rapport');\n  }",
     "  f(wikiMesure);",
     "rapport Wikipédia : la mesure plante en pleine lecture"),
]


def tests(src, debut=None):
    """Lance les tests (tous, ou ceux dont le nom commence par `debut`).
    Renvoie (code de sortie, nombre de tests lancés)."""
    # TAP imposé : depuis Node 23, la sortie par défaut écrit « ℹ tests N » au lieu de « # tests N »
    commande = ['node', '--test', '--test-reporter=tap']
    if debut:
        # avant le motif des fichiers : placé après, Node le passe aux fichiers de test et l'ignore
        commande.append('--test-name-pattern=^' + re.sub(r'[\\^$.*+?()[\]{}|/]', r'\\\g<0>', debut))
    commande.append('test/**/*.test.js')
    env = dict(os.environ, WMR_SRC=src)
    r = subprocess.run(commande, cwd=RACINE, env=env, capture_output=True, text=True, encoding='utf-8')
    if debut:
        # on compte les tests visés eux-mêmes : un nom de test changé en laisse zéro
        noms = [l.split(' - ', 1)[1] for l in r.stdout.splitlines() if re.match(r'\s*(not )?ok \d+ - ', l)]
        return r.returncode, sum(nom.startswith(debut) for nom in noms)
    n = next((l.split()[-1] for l in r.stdout.splitlines() if l.startswith('# tests ')), '0')
    return r.returncode, int(n)


def ancres_perimees(mutations):
    perimees = []
    for nom, fichier, origine, *_ in mutations:
        with open(os.path.join(SRC, fichier), encoding='utf-8') as f:
            n = f.read().count(origine)
        if n != 1:
            print(f'  ?  {nom} : texte d\'origine trouvé {n} fois dans {fichier}, mutation à mettre à jour')
            perimees.append(nom)
    return perimees


def main(args):
    if args == ['--ancres']:
        perimees = ancres_perimees(MUTATIONS)
        if not perimees:
            print(f'Mutations : {len(MUTATIONS)} textes d\'origine trouvés.')
        return 1 if perimees else 0
    mutations = [m for m in MUTATIONS if not args or any(a.lower() in m[0].lower() for a in args)]
    if not mutations:
        print('Aucune mutation ne correspond à : ' + ' '.join(args))
        return 1
    code, n = tests(SRC)
    if code != 0 or n == 0:
        print(f'Les tests doivent être verts sur les sources intactes (code {code}, {n} test(s)).')
        return 1
    print(f'Sources intactes : {n} tests verts.')
    ratees = []
    for nom, fichier, origine, fautif, debut in mutations:
        with open(os.path.join(SRC, fichier), encoding='utf-8') as f:
            texte = f.read()
        if texte.count(origine) != 1:
            print(f'  ?  {nom} : texte d\'origine trouvé {texte.count(origine)} fois dans {fichier}, mutation à mettre à jour')
            ratees.append(nom)
            continue
        with tempfile.TemporaryDirectory() as tmp:
            copie = os.path.join(tmp, 'src')
            shutil.copytree(SRC, copie)
            with open(os.path.join(copie, fichier), 'w', encoding='utf-8', newline='\n') as f:
                f.write(texte.replace(origine, fautif))
            code, n = tests(copie, debut)
        if n == 0:
            print(f'  ?  {nom} : aucun test ne commence par « {debut} », mutation à mettre à jour')
            ratees.append(nom)
        elif code == 0:
            print(f'  ✗  {nom} : NON détecté par « {debut} »')
            ratees.append(nom)
        else:
            print(f'  ✓  {nom} : détecté')
    print(f'{len(mutations) - len(ratees)}/{len(mutations)} mutations détectées.')
    return 1 if ratees else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
