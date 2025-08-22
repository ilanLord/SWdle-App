// src/components/ResultChip.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SizeAttr } from '@/config/size_attr';

export default function ResultChip({ label, status }: { label: string | number; status: 'ok' | 'partial' | 'no' }) {
    const bg = status === 'ok' ? '#4caf50' : status === 'partial' ? '#ffd54f' : '#e0e0e0';
    const color = status === 'no' ? '#333' : '#fff';
    return (
        <View style={[styles.chip, { backgroundColor: bg }]}>
            <Text style={[styles.text, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        width: SizeAttr,
        height: SizeAttr,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        width: '100%',
        textAlign: 'center'
    }
});