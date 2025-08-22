// src/utils/useDb.ts
import { useSQLiteContext } from "expo-sqlite";

/**
 * Petit hook pour récupérer l'instance DB fournie par SQLiteProvider.
 */
export function useDb() {
    const db = useSQLiteContext();
    return db;
}
