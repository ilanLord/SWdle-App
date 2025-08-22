import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import { useAllMonsters } from "@/hooks/getters/useAllMonsters";
import { useSearchMonsters } from "@/hooks/getters/useSearchMonsters";
import MonsterCard from "@/components/MonsterCard";
import ResultRow from "@/components/ResultRow";
import ResultRowTitle from "@/components/ResultRowTitle";
import { compareMonster } from "@/services/monsterService";

export default function GameScreen() {
  const { data: allMonsters, loading, error } = useAllMonsters();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [target, setTarget] = useState<any | null>(null);
  const [solved, setSolved] = useState(false);

  const { results: suggestions } = useSearchMonsters(input, 10);

  // Choisir la cible automatiquement quand les monstres sont chargés
  useEffect(() => {
    if (allMonsters.length > 0 && !target) {
      const index = Math.floor(Math.random() * allMonsters.length);
      setTarget(allMonsters[index]);
    }
  }, [allMonsters, target]);

  const onPick = useCallback(
    (m: any) => {
      if (!target) return;
      if (results.some(r => r.monster.id === m.id)) return;
      const cmp = compareMonster(target, m);
      setResults(prev => [{ monster: m, compare: cmp }, ...prev]);
      setInput("");
      if (cmp.name === "ok") {
        setSolved(true);
        Alert.alert("Bravo", `C'était bien ${m.name} !`);
      }
    },
    [target, results]
  );

  const onSubmit = useCallback(() => {
    if (!allMonsters.length) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    const triedIds = results.map(r => r.monster.id);
    const available = allMonsters.filter(m => !triedIds.includes(m.id));
    const exact = available.find(m => m.name.toLowerCase() === trimmed.toLowerCase());
    if (exact) return onPick(exact);

    const found = suggestions.find(m => m.name.toLowerCase() === trimmed.toLowerCase());
    if (found) return onPick(found);

    Alert.alert("Non trouvé", "Aucun monstre correspondant.");
  }, [input, allMonsters, results, suggestions, onPick]);

  const triedIds = results.map(r => r.monster.id);
  const filteredSuggestions = useMemo(
    () => suggestions.filter(m => !triedIds.includes(m.id)),
    [suggestions, triedIds]
  );

  if (loading) return <Text>Chargement des monstres…</Text>;
  if (error) return <Text>Erreur: {error}</Text>;
  if (!target) return <Text>Aucun monstre disponible</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devine le monstre !</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du monstre…"
        placeholderTextColor="#aaa"
        value={input}
        onChangeText={setInput}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Button title="Valider" onPress={onSubmit} />

      {filteredSuggestions.length > 0 && (
        <FlatList
          data={filteredSuggestions}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <MonsterCard monster={item} onPress={() => onPick(item)} />}
          style={{ maxHeight: 350, marginVertical: 8 }}
        />
      )}

      <ResultRowTitle />
      <ScrollView horizontal>
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item.monster.id}-${idx}`}
          renderItem={({ item }) => <ResultRow monster={item.monster} compare={item.compare} />}
          ListEmptyComponent={<Text style={{ marginTop: 12 }}>Aucune tentative encore.</Text>}
          style={{ marginTop: 12 }}
        />
      </ScrollView>

      <View style={{ marginTop: 12, gap: 16 }}>
        <Button
          title="Nouvelle partie"
          onPress={() => {
            setResults([]);
            setSolved(false);
            setTarget(null);
            setInput("");
          }}
        />
        <Button
          title={solved ? "Cacher la solution" : "Montrer la solution"}
          onPress={() => setSolved(prev => !prev)}
        />
      </View>

      {solved && target && (
        <View style={{ marginTop: 12 }}>
          <MonsterCard monster={target} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 40, paddingTop: 70 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 12, width: "100%", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
});
