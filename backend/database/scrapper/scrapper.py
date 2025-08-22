#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrapper pour swarfarm -> sauvegarde de JSON dans database/scrapper/json_files.
"""

import requests
import json
import os
from pprint import pprint
from typing import Callable, List, Dict, Any, Optional


def safe_write_json(rel_path: str, data: Any) -> None:
    """
    Écrit `data` (objet Python) dans le fichier JSON relatif à ce module.
    Crée le dossier si nécessaire.
    Le chemin est résolu relativement au fichier scrapper.py pour éviter
    les problèmes si on lance le script depuis un autre répertoire courant.
    """
    base_dir = os.path.dirname(__file__)
    abs_path = os.path.join(base_dir, rel_path)

    # s'assurer que le dossier existe
    dir_path = os.path.dirname(abs_path)
    os.makedirs(dir_path, exist_ok=True)

    # écrire le JSON
    with open(abs_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def ajouter_skill_page(skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    skills_json: List[Dict[str, Any]] = []
    for skill in skills:
        # Récupérer les informations du skill
        name = skill.get('name')
        description = skill.get('description')
        slot = skill.get('slot')
        image = skill.get('icon_filename')
        progress = skill.get('level_progress_description')
        other = skill.get('other_skill')
        cooldown = skill.get('cooltime')
        hits = skill.get('hits')
        aoe = skill.get('aoe')
        passive = skill.get('passive')
        # Ajouter les informations du skill à une liste
        if not other:
            skill_info = {
                'id': skill.get('id'),
                'name': name,
                'description': description,
                'cooldown': cooldown,
                'hits': hits,
                'aoe': aoe,
                'passive': passive,
                'slot': slot,
                'image': image,
                'progress': progress,
            }
            skills_json.append(skill_info)
    return skills_json


def ajouter_monstre_page(monsters: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    monsters_json: List[Dict[str, Any]] = []
    for monster in monsters:
        name = monster.get('name')
        stars = monster.get('natural_stars')
        image = monster.get('image_filename')
        element = monster.get('element')
        archetype = monster.get('archetype')
        skills = monster.get('skills')
        nb_skill_ups = monster.get('skill_ups_to_max')
        leader_skill = monster.get('leader_skill')
        hp = monster.get('base_hp')
        attack = monster.get('base_attack')
        defense = monster.get('base_defense')
        speed = monster.get('speed')
        crit_rate = monster.get('crit_rate')
        crit_dmg = monster.get('crit_damage')
        resistance = monster.get('resistance')
        accuracy = monster.get('accuracy')
        # Ajouter les informations du monstre à une liste
        monster_info = {
            'id': monster.get('id'),
            'name': name,
            'stars': stars,
            'image': image,
            'element': element,
            'archetype': archetype,
            'skills': skills,
            'nb_skill_ups': nb_skill_ups,
            'leader_skill': leader_skill,
            'hp': hp,
            'attack': attack,
            'defense': defense,
            'speed': speed,
            'crit_rate': crit_rate,
            'crit_dmg': crit_dmg,
            'resistance': resistance,
            'accuracy': accuracy,
        }
        monsters_json.append(monster_info)
    return monsters_json


def traiter_monster(monsters: List[Dict[str, Any]]):
    leader_skills: List[Dict[str, Any]] = []
    skills_monsters: List[Dict[str, Any]] = []
    for monster in monsters:
        if monster.get('leader_skill'):
            leader_skill = monster.get('leader_skill')
            leader_skill_info = {
                'id': leader_skill.get('id'),
                'attribute': leader_skill.get('attribute'),
                'area': leader_skill.get('area'),
                'amount': leader_skill.get('amount'),
                'element': leader_skill.get('element'),
            }
            monster['leader_skill'] = leader_skill_info.get('id')
            leader_skills.append(leader_skill_info)
        for skill in monster.get('skills', []):
            skills_monsters.append({
                'monster_id': monster.get('id'),
                'skill_id': skill,
            })
        monster['skills'] = len(monster.get('skills', []))
    leader_skills_final: List[Dict[str, Any]] = []
    leader_skills_final_enum: List[Any] = []
    for leader_skill in leader_skills:
        if leader_skill.get('id') not in leader_skills_final_enum:
            leader_skills_final_enum.append(leader_skill.get('id'))
            leader_skills_final.append(leader_skill)
    return monsters, leader_skills_final, skills_monsters


def fetch_data(url: str, fct_specifique: Callable[[List[Dict[str, Any]]], List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    Récupère les données depuis une API paginée (swarfarm).
    Renvoie toujours une liste (vide en cas d'erreur).
    """
    try:
        # Effectuer une requête GET
        response = requests.get(url)
        response.raise_for_status()  # Vérifie s'il y a eu une erreur HTTP

        # Récupérer les données en JSON
        data = response.json()
        all_datas: List[Dict[str, Any]] = []
        if data and data.get('results'):
            print("Les colonnes de data sont:")
            pprint(data.get('results')[0].keys())
        # Afficher les données (vous pouvez aussi les traiter comme vous voulez)
        print("Données récupérées avec succès:")
        # Gestion de la première page
        if data and data.get('results'):
            all_datas.extend(fct_specifique(data.get('results')))
        # Gestion des pages suivantes (si l'API utilise une pagination)
        next_page = data.get('next') if data else None
        while next_page:
            response = requests.get(next_page)
            response.raise_for_status()
            data = response.json()
            if data and data.get('results'):
                all_datas.extend(fct_specifique(data.get('results')))
            next_page = data.get('next') if data else None
        return all_datas
    except requests.exceptions.RequestException as e:
        # afficher l'erreur et renvoyer une liste vide pour éviter des NoneType plus tard
        print(f"Une erreur s'est produite lors de la requête HTTP: {e}")
        return []
    except ValueError as e:
        # JSON invalide
        print(f"Impossible de parser la réponse JSON: {e}")
        return []
    except Exception as e:
        # erreur inattendue
        print(f"Erreur inattendue dans fetch_data: {e}")
        return []


def fetch_skills_data() -> None:
    url = "https://swarfarm.com/api/v2/skills/"
    all_skills = fetch_data(url, ajouter_skill_page)
    if all_skills is None:
        all_skills = []
    # Sauvegarder les données dans un fichier JSON (utiliser safe_write_json)
    safe_write_json('json_files/skills_data.json', all_skills)
    print("Données sauvegardées avec succès. Nombre total de skills:", len(all_skills))


def fetch_monster_data() -> None:
    url = (
        "https://swarfarm.com/api/v2/monsters/?"
        "id__in=&"
        "com2us_id=&"
        "family_id=&"
        "skill_group_id=&"
        "base_stars=&"
        "base_stars__lte=&"
        "base_stars__gte=&"
        "natural_stars=&"
        "natural_stars__lte=&"
        "natural_stars__gte=3&"
        "obtainable=&"
        "fusion_food=&"
        "homunculus=&"
        "name=&"
        "awaken_level=1&"
        "awaken_level=2&"
        "order_by=-natural_stars"
    )

    all_monsters = fetch_data(url, ajouter_monstre_page)
    if all_monsters is None:
        all_monsters = []

    # Sauvegarder les données dans un fichier JSON
    all_monsters, all_leader_skills, skills_monsters = traiter_monster(all_monsters)

    safe_write_json('json_files/monsters_data.json', all_monsters)
    print("Données sauvegardées avec succès. Nombre total de monstres:", len(all_monsters))

    safe_write_json('json_files/leader_skills_data.json', list(all_leader_skills))
    print("Données sauvegardées avec succès. Nombre total de leader skills:", len(all_leader_skills))

    safe_write_json('json_files/skills_monsters_data.json', skills_monsters)
    print("Données sauvegardées avec succès. Nombre total de skills-monster:", len(skills_monsters))


if __name__ == "__main__":
    fetch_skills_data()
    fetch_monster_data()
