// src/hooks/getters/useAllMonsters.ts
import { useEffect, useState } from "react";
import { Monster } from "@/types/Monster";
import { useDb } from "@/utils/useDb";
import { rowToMonster } from "./_helpers";

export function useAllMonsters() {
  const [data, setData] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = useDb();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!db) throw new Error("DB non initialisée (useDb() renvoie undefined). Vérifie que SQLiteProvider entoure l'app.");

        const sql = `
          SELECT m.*,
                 ls.id AS ls_id,
                 ls.attribute AS ls_attribute,
                 ls.amount AS ls_amount,
                 ls.area AS ls_area,
                 ls.element AS ls_element
          FROM monsters m
          LEFT JOIN leader_skills ls ON m.leader_skill_id = ls.id
          ORDER BY m.stars DESC, m.name ASC;
        `;

        // @ts-ignore
        const rows: any[] = await (db as any).getAllAsync(sql);

        if (!mounted) return;
        setData((rows ?? []).map(rowToMonster));
      } catch (e: any) {
        console.error("Erreur useAllMonsters:", e);
        if (!mounted) return;
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [db]);

  return { data, loading, error };
}
