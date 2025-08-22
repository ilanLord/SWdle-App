// src/hooks/getters/useMonstersByFilter.ts
import { useEffect, useState } from "react";
import { Monster } from "@/types/Monster";
import { useDb } from "@/utils/useDb";
import { rowToMonster } from "./_helpers";

export function useMonstersByFilter({ stars, element, archetype }: { stars?: number; element?: string; archetype?: string }) {
  const [data, setData] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = useDb();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!db) throw new Error("DB non initialisée");

        const clauses: string[] = [];
        const params: any[] = [];

        if (typeof stars === "number") { clauses.push("m.stars = ?"); params.push(stars); }
        if (element) { clauses.push("LOWER(m.element) = LOWER(?)"); params.push(element); }
        if (archetype) { clauses.push("LOWER(m.archetype) = LOWER(?)"); params.push(archetype); }

        const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

        const sql = `
          SELECT m.*,
                 ls.id AS ls_id,
                 ls.attribute AS ls_attribute,
                 ls.amount AS ls_amount,
                 ls.area AS ls_area,
                 ls.element AS ls_element
          FROM monsters m
          LEFT JOIN leader_skills ls ON m.leader_skill_id = ls.id
          ${where}
          ORDER BY m.stars DESC, m.name ASC
          LIMIT 100;
        `;

        // @ts-ignore
        const rows: any[] = await (db as any).getAllAsync(sql, ...params);
        if (!mounted) return;
        setData((rows ?? []).map(rowToMonster));
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [db, stars, element, archetype]);

  return { data, loading, error };
}
