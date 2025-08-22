// src/hooks/getters/useSearchMonsters.ts
import { useEffect, useState } from "react";
import { Monster } from "@/types/Monster";
import { useDb } from "@/utils/useDb";
import { rowToMonster } from "./_helpers";

export function useSearchMonsters(query: string, limit = 12) {
  const [results, setResults] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const db = useDb();

  useEffect(() => {
    let mounted = true;
    if (!query || query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        if (!db) throw new Error("DB non initialisée");
        const q = `%${query.replace(/%/g, "")}%`;

        const sql = `
          SELECT m.*,
                 ls.id AS ls_id,
                 ls.attribute AS ls_attribute,
                 ls.amount AS ls_amount,
                 ls.area AS ls_area,
                 ls.element AS ls_element
          FROM monsters m
          LEFT JOIN leader_skills ls ON m.leader_skill_id = ls.id
          WHERE m.name LIKE ? COLLATE NOCASE
          ORDER BY m.stars DESC, m.name ASC
          LIMIT ?;
        `;

        setLoading(true);
        // @ts-ignore
        const rows: any[] = await (db as any).getAllAsync(sql, q, limit);

        if (!mounted) return;
        setResults((rows ?? []).map(rowToMonster));
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [db, query, limit]);

  return { results, loading, error };
}
