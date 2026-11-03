import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';

interface Props {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
}

export default function StatCard({ label, value, icon, tint }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: tint + '18' }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconBox: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  value: { ...FONT.statNumber, fontSize: 26 },
  label: { ...FONT.caption, marginTop: 2, lineHeight: 16 },
});