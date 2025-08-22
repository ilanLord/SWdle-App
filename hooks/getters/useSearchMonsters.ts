import { useEffect, useState, useContext } from "react";
import { Platform } from "react-native";
import { Monster } from "@/types/Monster";
import { rowToMonster } from "./_helpers";
import { WebDbContext } from "@/app/_layout";
import { useDb } from "@/utils/useDb";

export function useSearchMonsters(query: string, limit = 12) {
  const isWeb = Platform.OS === "web";
  const webDb = useContext(WebDbContext);
  const mobileDb = useDb();

  const [results, setResults] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchSearch = async (db: any) => {
      try {
        setLoading(true);
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

        let rows: any[] = [];
        if (isWeb) {
          const res = db.exec(sql.replace("?", `"${q}"`).replace("?", limit.toString()));
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
          rows = await db.getAllAsync(sql, q, limit);
        }

        if (!mounted) return;
        setResults(rows.map(rowToMonster));
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const db = isWeb ? webDb : mobileDb;
    if (db) fetchSearch(db);

    return () => { mounted = false; };
  }, [query, limit, isWeb, webDb, mobileDb]);

  return { results, loading, error };
}
