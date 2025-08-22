// app/_layout.tsx (RootLayout.tsx)
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { ensureDatabaseCopied, DB_NAME } from "@/utils/ensureDatabase";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Pas d'overwrite par défaut : la fonction compare les tailles et
        // recopie uniquement si nécessaire.
        await ensureDatabaseCopied({ overwrite: false });
      } catch (e) {
        // Affiche l'erreur pour debug ; en prod tu peux envoyer vers Sentry/log serveur
        console.error("DB copy error:", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Recrutement de tous les monstres pour le jeu...</Text>
        <ActivityIndicator style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <SQLiteProvider databaseName={DB_NAME}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
