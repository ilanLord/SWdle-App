// src/components/ResultRowTitle.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SizeAttr } from '@/config/size_attr';

export default function ResultRowTitle() {
  return (
    <View style={styles.row}>
      <View style={styles.col}><Text style={styles.meta}>Monstre</Text></View>
      <View style={styles.col}><Text style={styles.meta}>Nom</Text></View>
      <View style={styles.col}><Text style={styles.meta}>Etoiles</Text></View>
      <View style={styles.col}><Text style={styles.meta}>Élément</Text></View>
      <View style={styles.col}><Text style={styles.meta}>Type</Text></View>
      <View style={styles.col}><Text style={styles.meta}>LeaderSkill Attribut</Text></View>
      <View style={styles.col}><Text style={styles.meta}>LeaderSkill Valeur</Text></View>
      <View style={styles.col}><Text style={styles.meta}>LeaderSkill Zone</Text></View>
      <View style={styles.col}><Text style={styles.meta}>LeaderSkill Élément</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 12,
  },
  col: {
    width: SizeAttr,
    alignItems: 'center',
    marginRight: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
