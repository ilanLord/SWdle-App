import { useEffect, useState, useContext } from "react";
import { Platform } from "react-native";
import { Monster } from "@/types/Monster";
import { rowToMonster } from "./_helpers";
import { WebDbContext } from "@/app/_layout";
import { useDb } from "@/utils/useDb";

export function useAllMonsters() {
  const isWeb = Platform.OS === "web";
  const webDb = useContext(WebDbContext);
  const mobileDb = useDb();

  const [data, setData] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async (db: any) => {
      try {
        let rows: any[] = [];
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

        if (isWeb) {
          const res = db.exec(sql);
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
          rows = await db.getAllAsync(sql);
        }

        if (!mounted) return;
        setData(rows.map(rowToMonster));
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const db = isWeb ? webDb : mobileDb;
    if (db) fetchAll(db);

    return () => { mounted = false; };
  }, [isWeb, webDb, mobileDb]);

  return { data, loading, error };
}
