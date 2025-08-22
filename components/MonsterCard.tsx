// src/components/MonsterCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Monster } from '@/types/Monster';
import { formatMeta } from '@/services/monsterService';

export default function MonsterCard({ monster, small = false, onPress }: { monster: Monster; small?: boolean, onPress?: () => void }) {
    return (
        <TouchableOpacity style={[styles.container, small && styles.small]} onPress={onPress}>
            {monster.image ? (
                <Image source={{ uri: 'https://raw.githubusercontent.com/swarfarm/swarfarm/refs/heads/master/herders/static/herders/images/monsters/' + monster.image }} style={[styles.image, small && styles.smallImage]} />
            ) : (
                <View style={[styles.image, styles.placeholder, small && styles.smallImage]} />
            )}
            <View style={styles.info}>
                <Text style={styles.name}>{monster.name}</Text>
                <Text style={styles.meta}>{formatMeta(monster)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fff', borderRadius: 8, marginVertical: 6 },
    small: { padding: 6 },
    image: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
    smallImage: { width: 40, height: 40 },
    placeholder: { backgroundColor: '#ddd' },
    info: { marginLeft: 10 },
    name: { fontWeight: '700' },
    meta: { color: '#666', marginTop: 4 },
});
