"""Migration des données de la table 'monster_skills'."""
from database.classes import MonsterSkill
from database.utils import (
    load_data_from_json,
    migrate_table
)

def migrate_tuple(json_data):
    """
    Migre chaque tuple JSON vers la table 'monster_skills'.
    
    Args:
        json_data (list[dict]): Liste des données JSON.
        session (Session): Session SQLAlchemy.
    """
    return MonsterSkill(
        monster_id = json_data.get("monster_id"),
        skill_id = json_data.get("skill_id"),
    )

# Migrer les données vers la table 'monster_skills'
def migrate_monster_skills(session):
    """
    Migre les données JSON vers la table 'monster_skills'.
    
    Args:
        session (Session): Session SQLAlchemy.
    """
    # Charger les données JSON
    datas = load_data_from_json("database/scrapper/json_files/skills_monsters_data.json")
    # Migrer les données
    migrate_table(datas, session, migrate_tuple)
