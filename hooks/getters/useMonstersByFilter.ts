import { useEffect, useState, useContext } from "react";
import { Platform } from "react-native";
import { Monster } from "@/types/Monster";
import { rowToMonster } from "./_helpers";
import { WebDbContext } from "@/app/_layout";
import { useDb } from "@/utils/useDb";

export function useMonstersByFilter({ stars, element, archetype }: { stars?: number; element?: string; archetype?: string }) {
  const isWeb = Platform.OS === "web";
  const webDb = useContext(WebDbContext);
  const mobileDb = useDb();

  const [data, setData] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchMonsters = async (db: any) => {
      try {
        const clauses: string[] = [];
        const params: any[] = [];
        if (typeof stars === "number") { clauses.push("m.stars = ?"); params.push(stars); }
        if (element) { clauses.push("LOWER(m.element) = LOWER(?)"); params.push(element); }
        if (archetype) { clauses.push("LOWER(m.archetype) = LOWER(?)"); params.push(archetype); }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

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

        let rows: any[] = [];
        if (isWeb) {
          const res = db.exec(sql.replace(/\?/g, () => params.shift()));
          if (res.length) {
            const keys = res[0].columns;
            rows = res[0].values.map((row: any[]) => {
              const obj: any = {};
                keys.forEach((k: string, i: number) => (obj[k] = row[i]));
              return obj;
            });
          }
        } else {
          // @ts-ignore
          rows = await db.getAllAsync(sql, ...params);
        }

        if (!mounted) return;
        setData(rows.map(rowToMonster));
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const db = isWeb ? webDb : mobileDb;
    if (db) fetchMonsters(db);

    return () => { mounted = false; };
  }, [stars, element, archetype, isWeb, webDb, mobileDb]);

  return { data, loading, error };
}
