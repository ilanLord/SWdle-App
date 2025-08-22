"""
Utilitaires pour les migrations depuis les fichiers JSON.

Ce fichier expose:
- load_data_from_json(path) -> list | dict
- migrate_table(datas, session, migrate_tuple)
"""

import os
import json
from typing import Any, Callable, Iterable, List, Dict
from sqlalchemy.exc import IntegrityError

# Taille de batch pour les commits (évite d'envoyer 5000 inserts en une seule transaction)
BATCH_SIZE = 500


def load_data_from_json(path: str) -> Any:
    """
    Charge un fichier JSON et renvoie son contenu.
    Le chemin `path` peut être:
      - un chemin absolu existant
      - un chemin relatif depuis le répertoire courant
      - un chemin relatif depuis la racine du projet (ex: 'database/scrapper/json_files/skills_data.json')

    Retourne la structure Python (liste ou dict) ou lève FileNotFoundError si introuvable.
    """
    # 1) chemin donné tel quel
    if os.path.isabs(path) and os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)

    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)

    # 2) résolution depuis la racine du projet (parent du dossier 'database/')
    this_file = os.path.abspath(__file__)
    database_dir = os.path.dirname(os.path.dirname(this_file))  # .../project/database
    project_root = os.path.dirname(database_dir)  # .../project

    candidate = os.path.join(project_root, path)
    if os.path.exists(candidate):
        with open(candidate, 'r', encoding='utf-8') as f:
            return json.load(f)

    # 3) résolution depuis le dossier 'database' (pour chemins commençant par 'scrapper/...' ou similaires)
    candidate2 = os.path.join(database_dir, path)
    if os.path.exists(candidate2):
        with open(candidate2, 'r', encoding='utf-8') as f:
            return json.load(f)

    # 4) échec: lister les chemins essayés pour debug
    tried = [path, candidate, candidate2]
    raise FileNotFoundError(f"Fichier JSON introuvable. Chemins essayés: {tried}")


def migrate_table(datas: Iterable[Dict], session, migrate_tuple: Callable[[Dict], Any]) -> None:
    """
    Migre une liste de dictionnaires `datas` vers la table en utilisant la fonction
    `migrate_tuple(json_data) -> instance_SQLAlchemy`.

    Comportement:
    - Pour chaque élément, on appelle migrate_tuple pour obtenir un objet SQLAlchemy.
    - On utilise session.merge(obj) pour insérer ou mettre à jour si l'ID existe déjà.
    - Commit en batch toutes les BATCH_SIZE entrées.
    - En cas d'erreur sur un item, on logge et on continue (pour ne pas stopper toute la migration).
    """
    if datas is None:
        print("Aucune donnée fournie à migrate_table.")
        return

    total = 0
    merged = 0
    skipped = 0
    errors = 0
    batch_count = 0

    for idx, json_data in enumerate(datas):
        total += 1
        try:
            obj = migrate_tuple(json_data)
            # merge -> insert ou update selon la PK
            session.merge(obj)
            batch_count += 1
            merged += 1
        except Exception as e:
            # Erreur sur la création/merge d'un objet -> on skip cet item
            print(f"[migrate_table] Erreur sur l'item index={idx}, id={json_data.get('id')} : {e}")
            session.rollback()
            errors += 1
            continue

        # Commit en batch
        if batch_count >= BATCH_SIZE:
            try:
                session.commit()
                print(f"[migrate_table] Commit batch (taille={batch_count}). Items traités jusqu'ici: {total}")
            except IntegrityError as ie:
                # Si malgré merge une contrainte survient, rollback et tenter de continuer
                print(f"[migrate_table] IntegrityError lors du commit batch : {ie}. Rollback et on continue.")
                session.rollback()
                errors += batch_count
            except Exception as e:
                print(f"[migrate_table] Erreur inattendue lors du commit batch : {e}. Rollback.")
                session.rollback()
                errors += batch_count
            batch_count = 0

    # Commit final si reste des éléments non commit
    if batch_count > 0:
        try:
            session.commit()
            print(f"[migrate_table] Commit final (taille={batch_count}).")
        except IntegrityError as ie:
            print(f"[migrate_table] IntegrityError lors du commit final : {ie}. Rollback.")
            session.rollback()
            errors += batch_count
        except Exception as e:
            print(f"[migrate_table] Erreur inattendue lors du commit final : {e}. Rollback.")
            session.rollback()
            errors += batch_count

    print(f"[migrate_table] Terminé. total={total}, merged={merged}, errors={errors}, skipped={skipped}")
