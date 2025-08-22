#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Create the database and migrate all tables.

Remplace le fichier database/create_database.py par celui-ci.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Importer les migrations existantes (doivent accepter un paramètre `session`)
from database.migrations import (
    migrate_leader_skills,
    migrate_skills,
    migrate_monsters,
    migrate_monster_skills
)
from database.classes.base import SWdleBase


def create_tables(engine):
    """
    Drop & create all tables (utile en développement).
    """
    print("Drop & create all tables...")
    SWdleBase.metadata.drop_all(engine)
    SWdleBase.metadata.create_all(engine)
    print("Tables créées.")


def migrate_all(session):
    """
    Appelle toutes les fonctions de migration (elles lisent les JSON et insèrent).
    """
    print("Lancement des migrations (insertion des données depuis les JSON)...")
    migrate_leader_skills(session)
    migrate_skills(session)
    migrate_monsters(session)
    migrate_monster_skills(session)
    print("Migrations terminées.")


def create_database(db_file_path: str):
    """
    db_file_path : chemin absolu vers le fichier sqlite (ex: /chemin/vers/database.db)
    """
    # créer l'engine avec echo pour debug
    engine = create_engine(f"sqlite:///{db_file_path}", echo=True)

    # créer les tables
    create_tables(engine)

    # créer une session locale
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # migrer les données depuis les fichiers JSON
        migrate_all(session)
        # commit final (au cas où les migrations n'ont pas commit elles-mêmes)
        session.commit()
    except Exception as e:
        print(f"Erreur durant la migration : {e}")
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    # Résoudre database.db à la racine du projet :
    # __file__ est database/create_database.py => racine = parent de database/
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "database.db")

    print(f"Utilisation du fichier sqlite : {db_path}")
    create_database(db_path)
    print("Fini.")
