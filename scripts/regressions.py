#!/usr/bin/env python3
"""Réintroduit chaque bug déjà livré, un à la fois, dans une copie des sources,
lance le test qui le surveille, et exige qu'il le DÉTECTE (sortie en échec).

    python scripts/regressions.py

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
     "await choisirFiltre('');\n  await choisirTri('Date d\\'ajout');\n  for (const [i, g] of groupes.entries()) {",
     "await choisirFiltre(null);\n  await choisirTri('Date d\\'ajout');\n  for (const [i, g] of groupes.entries()) {",
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
]


def tests(src, debut=None):
    """Lance les tests (tous, ou ceux dont le nom commence par `debut`).
    Renvoie (code de sortie, nombre de tests lancés)."""
    commande = ['node', '--test', '--test-reporter=tap']
    if debut:
        commande.append('--test-name-pattern=^' + re.sub(r'[\\^$.*+?()[\]{}|/]', r'\\\g<0>', debut))
    env = dict(os.environ, WMR_SRC=src)
    r = subprocess.run(commande, cwd=RACINE, env=env, capture_output=True, text=True, encoding='utf-8')
    if debut:
        # le total « # tests » compte aussi les fichiers sans test : on compte les tests visés eux-mêmes
        noms = [l.split(' - ', 1)[1] for l in r.stdout.splitlines() if re.match(r'\s*(not )?ok \d+ - ', l)]
        return r.returncode, sum(nom.startswith(debut) for nom in noms)
    n = next((l.split()[-1] for l in r.stdout.splitlines() if l.startswith('# tests ')), '0')
    return r.returncode, int(n)


def main():
    code, n = tests(SRC)
    if code != 0 or n == 0:
        print(f'Les tests doivent être verts sur les sources intactes (code {code}, {n} test(s)).')
        return 1
    print(f'Sources intactes : {n} tests verts.')
    ratees = []
    for nom, fichier, origine, fautif, debut in MUTATIONS:
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
    print(f'{len(MUTATIONS) - len(ratees)}/{len(MUTATIONS)} mutations détectées.')
    return 1 if ratees else 0


if __name__ == '__main__':
    sys.exit(main())
