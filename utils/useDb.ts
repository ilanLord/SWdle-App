import { useContext } from "react";
import { Platform } from "react-native";
import { WebDbContext } from "@/app/_layout";
import { useSQLiteContext } from "expo-sqlite";

/**
 * Retourne la DB SQLite selon la plateforme
 * - Web : retourne l'instance SQL.js du contexte
 * - Mobile : retourne la DB expo-sqlite
 */
export function useDb() {
  if (Platform.OS === "web") {
    const db = useContext(WebDbContext);
    if (!db) return null; // DB pas encore prête
    return db;
  } else {
    return useSQLiteContext();
  }
}
