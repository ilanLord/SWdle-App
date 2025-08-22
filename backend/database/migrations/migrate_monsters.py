"""Migrer les données JSON vers la table 'monsters'."""
from database.classes import Monster
from database.utils import (
    load_data_from_json,
    migrate_table
)

def migrate_tuple(json_data):
    """
    Migre chaque tuple JSON vers la table 'monsters'.
    
    Args:
        json_data (list[dict]): Liste des données JSON.
        session (Session): Session SQLAlchemy.
    """
    return Monster(
        id=json_data.get("id"),
        name=json_data.get("name"),
        stars=json_data.get("stars"),
        image=json_data.get("image"),
        element=json_data.get("element"),
        archetype=json_data.get("archetype"),
        nb_skill_ups=json_data.get("nb_skill_ups"),
        leader_skill_id=json_data.get("leader_skill"),
        hp=json_data.get("hp"),
        attack=json_data.get("attack"),
        defense=json_data.get("defense"),
        speed=json_data.get("speed"),
        crit_rate=json_data.get("crit_rate"),
        crit_dmg=json_data.get("crit_dmg"),
        resistance=json_data.get("resistance"),
        accuracy=json_data.get("accuracy")
    )

# Migrer les données vers la table 'monsters'
def migrate_monsters(session):
    """
    Migre les données JSON vers la table 'monsters'.
    
    Args:
        session (Session): Session SQLAlchemy.
    """
    # Charger les données JSON
    datas = load_data_from_json("database/scrapper/json_files/monsters_data.json")
    # Migrer les données
    migrate_table(datas, session, migrate_tuple)
