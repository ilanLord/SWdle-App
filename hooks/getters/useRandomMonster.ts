// src/hooks/getters/useRandomMonster.ts
import { useEffect, useState } from "react";
import { Monster } from "@/types/Monster";
import { useDb } from "@/utils/useDb";
import { rowToMonster } from "./_helpers";

export function useRandomMonster(trigger?: any) {
  const [monster, setMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = useDb();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!db) throw new Error("DB non initialisée");

        const sql = `
          SELECT m.*,
                 ls.id AS ls_id,
                 ls.attribute AS ls_attribute,
                 ls.amount AS ls_amount,
                 ls.area AS ls_area,
                 ls.element AS ls_element
          FROM monsters m
          LEFT JOIN leader_skills ls ON m.leader_skill_id = ls.id
          ORDER BY RANDOM()
          LIMIT 1;
        `;

        // @ts-ignore
        const rows: any[] = await (db as any).getAllAsync(sql);
        if (!mounted) return;
        setMonster(rows?.[0] ? rowToMonster(rows[0]) : null);
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [db, trigger]);

  return { monster, loading, error };
}
