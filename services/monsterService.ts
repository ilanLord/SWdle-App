// src/services/monsterService.ts
import { Monster } from '@/types/Monster';
import { LeaderSkill } from '@/types/LeaderSkill';

export type CompareFlags = {
  nameMatch: boolean;
  starsMatch: boolean;
  elementMatch: boolean;
  archetypeMatch: boolean;
  leaderSkill?: {
    attributeMatch: boolean;
    amountMatch: boolean;
    areaMatch: boolean;
    elementMatch: boolean;
  };
};

// Status form used by UI (compatible with ResultChip)
export type Compare = {
  name: 'ok' | 'no' | 'partial';
  stars: 'ok' | 'no' | 'partial';
  element: 'ok' | 'no' | 'partial';
  archetype: 'ok' | 'no' | 'partial';
  leader_skill: {
    attribute: 'ok' | 'no' | 'partial';
    amount: 'ok' | 'no' | 'partial';
    area: 'ok' | 'no' | 'partial';
    element: 'ok' | 'no' | 'partial';
  };
};

/** Compare deux leader skills champ par champ (sans l'id) */
function compareLeaderSkillFlags(targetLs: LeaderSkill | null | undefined, guessLs: LeaderSkill | null | undefined) {
  const defaultFlags = {
    attributeMatch: false,
    amountMatch: false,
    areaMatch: false,
    elementMatch: false,
  };

  if (!targetLs && !guessLs) {
    // pas de leader skill pour les deux -> tout considéré "match" ? ici on considère 'ok'
    return {
      attributeMatch: true,
      amountMatch: true,
      areaMatch: true,
      elementMatch: true,
    };
  }

  if (!targetLs || !guessLs) {
    // l'un des deux manque -> aucun champ ne matche
    return defaultFlags;
  }

  const attributeMatch = (targetLs.attribute ?? '').toLowerCase() === (guessLs.attribute ?? '').toLowerCase();
  const amountMatch = (targetLs.amount ?? null) === (guessLs.amount ?? null);
  const areaMatch = (targetLs.area ?? '').toLowerCase() === (guessLs.area ?? '').toLowerCase();
  const elementMatch = (targetLs.element ?? '').toLowerCase() === (guessLs.element ?? '').toLowerCase();

  return {
    attributeMatch,
    amountMatch,
    areaMatch,
    elementMatch,
  };
}

/** old boolean comparison */
export function compareMonsterFlags(target: Monster, guess: Monster): CompareFlags {
  const leaderFlags = compareLeaderSkillFlags(target.leader_skill ?? null, guess.leader_skill ?? null);

  return {
    nameMatch: target.id === guess.id,
    starsMatch: (target.stars ?? 0) === (guess.stars ?? 0),
    elementMatch: (target.element ?? '').toLowerCase() === (guess.element ?? '').toLowerCase(),
    archetypeMatch: (target.archetype ?? '').toLowerCase() === (guess.archetype ?? '').toLowerCase(),
    leaderSkill: leaderFlags,
  };
}

/** convert boolean flags to status strings */
export function flagsToStatus(f: CompareFlags): Compare {
  const toStatus = (b: boolean) => (b ? 'ok' : 'no') as 'ok' | 'no' | 'partial';

  // si leaderSkill absent dans flags, on considère ok par défaut (mais on normalise)
  const ls = f.leaderSkill ?? {
    attributeMatch: true,
    amountMatch: true,
    areaMatch: true,
    elementMatch: true,
  };

  return {
    name: toStatus(f.nameMatch),
    stars: toStatus(f.starsMatch),
    element: toStatus(f.elementMatch),
    archetype: toStatus(f.archetypeMatch),
    leader_skill: {
      attribute: toStatus(ls.attributeMatch),
      amount: toStatus(ls.amountMatch),
      area: toStatus(ls.areaMatch),
      element: toStatus(ls.elementMatch),
    },
  };
}

/** main compare used by UI: returns status object */
export function compareMonster(target: Monster, guess: Monster): Compare {
  const flags = compareMonsterFlags(target, guess);
  return flagsToStatus(flags);
}

/* rest of your service functions (formatMeta, searchMonsters...) */
export function formatMeta(m: Monster) {
  return `★${m.stars} • ${m.element ?? '—'} • ${m.archetype ?? '—'}`;
}

export function sortMonstersByName(list: Monster[]) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByStars(list: Monster[], stars: number) {
  return list.filter((m) => m.stars === stars);
}

export function pickRandomFromList<T>(list: T[], seed?: number): T | null {
  if (!list || list.length === 0) return null;
  if (typeof seed === 'number') {
    const idx = Math.abs(Math.floor(seed)) % list.length;
    return list[idx];
  }
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// basic search
export function searchMonsters(list: Monster[], query: string): Monster[] {
  if (!query.trim()) return list;
  const q = query.toLowerCase();
  return list.filter((m) => m.name.toLowerCase().includes(q));
}
