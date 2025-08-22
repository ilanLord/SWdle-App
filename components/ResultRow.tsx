// src/components/ResultRow.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Monster } from '@/types/Monster';
import { Compare } from '@/services/monsterService';
import ResultChip from './ResultChip';
import { SizeAttr } from '@/config/size_attr';

interface Props {
  monster: Monster;
  compare: Compare;
}

export default function ResultRow({ monster, compare }: Props) {
  return (
    <View style={styles.row}>
      {/* Image */}
      {monster.image ? (
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/swarfarm/swarfarm/refs/heads/master/herders/static/herders/images/monsters/' +
              monster.image,
          }}
          style={styles.icon}
        />
      ) : (
        <View style={[styles.icon, styles.placeholder]} />
      )}

      {/* Colonnes alignées avec titre */}
      <View style={styles.chips}>
        <View style={styles.col}><ResultChip label={monster.name} status={compare.name} /></View>
        <View style={styles.col}><ResultChip label={`${monster.stars}★`} status={compare.stars} /></View>
        <View style={styles.col}><ResultChip label={monster.element ?? "/"} status={compare.element} /></View>
        <View style={styles.col}><ResultChip label={monster.archetype ?? "/"} status={compare.archetype} /></View>
        <View style={styles.col}><ResultChip label={monster.leader_skill?.attribute ?? "/"} status={compare.leader_skill.attribute} /></View>
        {monster.leader_skill?.amount !== undefined ? (
          <View style={styles.col}><ResultChip label={`${monster.leader_skill?.amount ?? "/"}%`} status={compare.leader_skill.amount} /></View>
        ) : 
          <View style={styles.col}><ResultChip label={`${monster.leader_skill?.amount ?? "/"}`} status={compare.leader_skill.amount} /></View>

        }
        <View style={styles.col}><ResultChip label={monster.leader_skill?.area ?? "/"} status={compare.leader_skill.area} /></View>
        <View style={styles.col}><ResultChip label={monster.leader_skill?.element ?? "/"} status={compare.leader_skill.element} /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 12,
  },
  icon: {
    width: SizeAttr,
    height: SizeAttr,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  col: {
    width: SizeAttr,
    alignItems: 'center',
    marginRight: 12,
  },
});
