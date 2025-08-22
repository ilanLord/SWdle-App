"""Migration de la table 'leader_skills'."""
from database.classes import LeaderSkill
from database.utils import (
    load_data_from_json,
    migrate_table
)

def migrate_tuple(json_data):
    """a
    Migre chaque tuple JSON vers la table 'leader_skills'.
    
    Args:
        json_data (list[dict]): Liste des données JSON.
        session (Session): Session SQLAlchemy.
    """
    return LeaderSkill(
        id = json_data.get("id"),
        attribute = json_data.get("attribute"),
        amount = json_data.get("amount"),
        area = json_data.get("area"),
        element = json_data.get("element"),
    )

# Migrer les données vers la table 'leader_skills'
def migrate_leader_skills(session):
    """
    Migre les données JSON vers la table 'leader_skills'.
    
    Args:
        session (Session): Session SQLAlchemy.
    """
    # Charger les données JSON
    datas = load_data_from_json("database/scrapper/json_files/leader_skills_data.json")
    # Migrer les données
    migrate_table(datas, session, migrate_tuple)
