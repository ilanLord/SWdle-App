// types/Monster.ts

import { LeaderSkill } from "./LeaderSkill";

export interface Monster {
    id: number;
    name: string;
    stars: number;
    image?: string | null;
    element?: string | null;
    archetype?: string | null;
    nb_skill_ups?: number | null;
    leader_skill?: LeaderSkill | null;
    hp?: number | null;
    attack?: number | null;
    defense?: number | null;
    speed?: number | null;
    crit_rate?: number | null;
    crit_dmg?: number | null;
    resistance?: number | null;
    accuracy?: number | null;
}