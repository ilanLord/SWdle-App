// src/components/ResultRow.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Monster } from '@/types/Monster';
import { Compare, formatMeta } from '@/services/monsterService';
import ResultChip from './ResultChip';
import { SizeAttr } from '@/config/size_attr';

interface Props {
  monster: Monster;
  compare: Compare;
}

export default function ResultRow({ monster, compare }: Props) {
  return (
    <View style={styles.row}>
      {monster.image ? (
        <Image source={{ uri: 'https://raw.githubusercontent.com/swarfarm/swarfarm/refs/heads/master/herders/static/herders/images/monsters/' + monster.image }} style={styles.icon} />
      ) : (
        <View style={[styles.icon, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <View style={styles.chips}>
            <ResultChip label={monster.name} status={compare.name} />
            <ResultChip label={`${monster.stars}★`} status={compare.stars} />
            <ResultChip label={monster.element ?? "/"} status={compare.element} />
            <ResultChip label={monster.archetype ?? "/"} status={compare.archetype} />
            <ResultChip label={monster.leader_skill?.attribute ?? "/"} status={compare.leader_skill.attribute} />
            <ResultChip label={`${monster.leader_skill?.amount ?? "/"}%`} status={compare.leader_skill.amount} />
            <ResultChip label={monster.leader_skill?.area ?? "/"} status={compare.leader_skill.area} />
            <ResultChip label={monster.leader_skill?.element ?? "/"} status={compare.leader_skill.element} />
        </View>
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
  },
  icon: {
    width: SizeAttr,
    height: SizeAttr,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
