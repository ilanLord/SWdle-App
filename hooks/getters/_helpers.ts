// src/hooks/getters/_helpers.ts
import { Monster } from '@/types/Monster';
import { LeaderSkill } from '@/types/LeaderSkill';

/**
 * Transforme une ligne SQL (obj) en Monster en extrayant les colonnes de leader skill
 * attendues : ls_id, ls_attribute, ls_amount, ls_area, ls_element
 */
export function rowToMonster(row: any): Monster {
  const monster: Monster = {
    id: row.id,
    name: row.name,
    stars: row.stars,
    image: row.image ?? null,
    element: row.element ?? null,
    archetype: row.archetype ?? null,
    nb_skill_ups: row.nb_skill_ups ?? null,
    leader_skill: null,
    hp: row.hp ?? null,
    attack: row.attack ?? null,
    defense: row.defense ?? null,
    speed: row.speed ?? null,
    crit_rate: row.crit_rate ?? null,
    crit_dmg: row.crit_dmg ?? null,
    resistance: row.resistance ?? null,
    accuracy: row.accuracy ?? null,
  };

  // Si les colonnes leader skill sont présentes, construit l'objet
  if (row.ls_id != null) {
    const ls: LeaderSkill = {
      id: row.ls_id,
      attribute: row.ls_attribute ?? null,
      amount: row.ls_amount ?? null,
      area: row.ls_area ?? null,
      element: row.ls_element ?? null,
    };
    monster.leader_skill = ls;
  }

  return monster;
}
