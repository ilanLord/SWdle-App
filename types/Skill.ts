// types/Skill.ts
export interface Skill {
    id: number;
    name: string;
    description?: string | null;
    cooldown?: number | null;
    hits?: number | null;
    aoe?: boolean | null;
    passive?: boolean | null;
    slot?: number | null;
    image?: string | null;
    nb_progress?: number | null;
}