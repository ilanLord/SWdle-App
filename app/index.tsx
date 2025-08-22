// src/screens/GameScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import { useAllMonsters } from "@/hooks/getters/useAllMonsters";
import { searchMonsters } from "@/services/monsterService";
import MonsterCard from "@/components/MonsterCard";
import ResultRow from "@/components/ResultRow";
import { Monster } from "@/types/Monster";
import { compareMonster } from "@/services/monsterService";
import type { Compare } from "@/services/monsterService";

type ResultItem = {
    monster: Monster;
    compare: Compare;
};

export default function GameScreen() {
    const { data: allMonsters, loading, error } = useAllMonsters();

    const [input, setInput] = useState("");
    const [results, setResults] = useState<ResultItem[]>([]);
    const [target, setTarget] = useState<Monster | null>(null);
    const [solved, setSolved] = useState(false);

    const [solutionTitle, setSolutionTitle] = useState("Montrer la solution");

    // Choisit la cible dès que la table est chargée (ou quand on reset)
    useEffect(() => {
        if (allMonsters.length > 0 && !target) {
            const index = Math.floor(Math.random() * allMonsters.length);
            setTarget(allMonsters[index]);
        }
    }, [allMonsters, target]);

    const onPick = useCallback(
        (m: Monster) => {
            if (!target) return;
            // évite les doublons
            if (results.some(r => r.monster.id === m.id)) return;

            const cmp = compareMonster(target, m);
            setResults(prev => [{ monster: m, compare: cmp }, ...prev]);
            setInput("");

            if (cmp.name === 'ok') {
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

        // Exclure déjà essayés
        const triedIds = results.map(r => r.monster.id);
        const available = allMonsters.filter(m => !triedIds.includes(m.id));

        // 1) Chercher un match exact (case-insensitive)
        const exact = available.find(m => m.name.toLowerCase() === trimmed.toLowerCase());
        if (exact) {
            onPick(exact);
            return;
        }

        // 2) Sinon, fallback sur la recherche includes (fuzzy minimaliste)
        const found = searchMonsters(available, trimmed)[0];
        if (found) {
            onPick(found);
            return;
        }

        // 3) nothing found
        Alert.alert("Non trouvé", "Aucun monstre correspondant.");
    }, [input, allMonsters, results, onPick]);

    // Render suggestions (autocomplétion)
    const triedIds = results.map(r => r.monster.id);
    const suggestions = input.trim().length > 0
        ? searchMonsters(
            allMonsters.filter(m => !triedIds.includes(m.id)),
            input.trim()
        ).slice(0, 10)
        : [];

    if (loading) return <Text>Chargement…</Text>;
    if (error) return <Text>Erreur: {error}</Text>;
    if (!target) return <Text>Aucun monstre dispo</Text>;

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

            {/* Suggestions : quand l'utilisateur tape, on affiche une liste cliquable */}
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        // Important : passe l'objet entier au handler onPick
                        <MonsterCard monster={item} onPress={() => onPick(item)} />
                    )}
                    style={{ maxHeight: 350, marginVertical: 8 }}
                />
            )}

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
                        setTarget(null); // useEffect choira une nouvelle target
                        setInput("");
                    }}
                />
                <Button title={solutionTitle} onPress={() => {
                    setSolutionTitle(prev => prev === 'Montrer la solution' ? 'Cacher la solution' : 'Montrer la solution');
                    setSolved(prev => !prev);
                }} />
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
