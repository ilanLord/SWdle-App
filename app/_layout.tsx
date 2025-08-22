import React, { useEffect, useState, createContext } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { ensureDatabaseCopied, DB_NAME } from "@/utils/ensureDatabase";
import { StatusBar } from "expo-status-bar";

export const WebDbContext = createContext<any>(null);

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [webDb, setWebDb] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = await ensureDatabaseCopied({ overwrite: false });
        if (Platform.OS === "web") setWebDb(db);
      } catch (e) {
        console.error("[RootLayout] DB copy/init error:", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Initialisation de la base de données...</Text>
        <ActivityIndicator style={{ marginTop: 12 }} />
      </View>
    );
  }

  const isWeb = Platform.OS === "web";

  return isWeb ? (
    <WebDbContext.Provider value={webDb}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </WebDbContext.Provider>
  ) : (
    <SQLiteProvider databaseName={DB_NAME}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
