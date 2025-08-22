"""Migration des données JSON vers la table 'skills'."""
from database.classes.skill import Skill
from database.utils.utils_migrations import (
    load_data_from_json,
    migrate_table
)

def migrate_tuple(json_data):
    """
    Migre les données JSON vers la table 'skills'.
    
    Args:
        json_data (list[dict]): Liste des données JSON.
        session (Session): Session SQLAlchemy.
    """
    return Skill(
        id=json_data.get("id"),
        name=json_data.get("name"),
        description=json_data.get("description"),
        cooldown=json_data.get("cooldown"),
        hits=json_data.get("hits"),
        aoe=json_data.get("aoe"),
        passive=json_data.get("passive"),
        slot=json_data.get("slot"),
        image=json_data.get("image"),
        nb_progress=len(json_data.get("progress")),
    )

# Migrer les données vers la table 'skills'
def migrate_skills(session):
    """
    Migre les données JSON vers la table 'skills'.
    
    Args:
        session (Session): Session SQLAlchemy.
    """
    # Charger les données JSON
    datas = load_data_from_json("database/scrapper/json_files/skills_data.json")
    # Migrer les données
    migrate_table(datas, session, migrate_tuple)
