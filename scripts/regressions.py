#!/usr/bin/env python3
"""Réintroduit chaque bug déjà livré, un à la fois, dans une copie des sources,
lance les tests, et exige qu'ils le DÉTECTENT (sortie en échec).

    python scripts/regressions.py

Les tests lisent les sources dans le dossier indiqué par WMR_SRC (voir test/charger.js).
Un bug corrigé ajoute ici sa mutation : (nom, fichier, texte d'origine, texte fautif).
"""
import os
import shutil
import subprocess
import sys
import tempfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RACINE, 'src')

MUTATIONS = [
    ('carte sans <p> ignorée', 'app.js',
     "if (!card || card.closest('#wmr-host')",
     "if (!card || !card.querySelector('p') || card.closest('#wmr-host')"),
    ('« Terminé » non géré', 'app.js',
     "if (!(await attendre(() => bouton(/^Terminé$/), 90000)))",
     "if (!(await attendre(() => true, 90000)))"),
    ('compteur « (n) » gardé dans le libellé du filtre', 'app.js',
     "const actuel = f ? f.innerText.trim().replace(/ \\(\\d+\\)$/, '') : '';",
     "const actuel = f ? f.innerText.trim() : '';"),
    ('arrêt quand la page change après un étiquetage', 'app.js',
     "journal(`  ↺ le site est revenu page ${pi[0]} : retour page ${num}`);",
     "return poses;"),
    ('panneau hidden annulé par le CSS', 'app.js',
     "const montrer = (el, oui) => { el.hidden = !oui; el.style.display = oui ? '' : 'none'; };",
     "const montrer = (el, oui) => { el.hidden = !oui; };"),
    ('rangement dans « Toutes les étiquettes » au lieu de « Sans étiquette »', 'app.js',
     "await choisirFiltre('');\n  await choisirTri('Date d\\'ajout');\n  for (let num = 1; ; ) {",
     "await choisirFiltre(null);\n  await choisirTri('Date d\\'ajout');\n  for (let num = 1; ; ) {"),
    ('lecture qui suit le total de pages annoncé', 'app.js',
     "if (attendu != null ? vus >= attendu : n < PAR_PAGE) return;",
     "const pi = pageInfo(); if (attendu != null ? vus >= attendu : (pi ? num >= pi[1] : n < PAR_PAGE)) return;"),
]


def tests(src):
    env = dict(os.environ, WMR_SRC=src)
    r = subprocess.run(['node', '--test'], cwd=RACINE, env=env, capture_output=True, text=True, encoding='utf-8')
    sortie = r.stdout + r.stderr
    n = next((l.split()[-1] for l in sortie.splitlines() if l.startswith('# tests ')), '0')
    return r.returncode, int(n)


def main():
    code, n = tests(SRC)
    if code != 0 or n == 0:
        print(f'Les tests doivent être verts sur les sources intactes (code {code}, {n} test(s)).')
        return 1
    print(f'Sources intactes : {n} tests verts.')
    ratees = []
    for nom, fichier, origine, fautif in MUTATIONS:
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
            code, _ = tests(copie)
        if code == 0:
            print(f'  ✗  {nom} : NON détecté')
            ratees.append(nom)
        else:
            print(f'  ✓  {nom} : détecté')
    print(f'{len(MUTATIONS) - len(ratees)}/{len(MUTATIONS)} mutations détectées.')
    return 1 if ratees else 0


if __name__ == '__main__':
    sys.exit(main())
