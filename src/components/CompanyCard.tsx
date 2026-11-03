import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import type { Company } from '../types';

interface Props {
  company: Company;
  alumniCount?: number;
  onPress: () => void;
}

export default function CompanyCard({ company, alumniCount, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name="business-outline" size={22} color={COLORS.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{company.name}</Text>
        <Text style={styles.meta}>{company.industry}</Text>
        <Text style={styles.meta}>
          <Ionicons name="location-outline" size={11} color={COLORS.textSecondary} /> {company.location || '-'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {typeof alumniCount === 'number' ? (
          <View style={styles.countBox}>
            <Text style={styles.countValue}>{alumniCount}</Text>
            <Text style={styles.countLabel}>alumni</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginTop: 4 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface, padding: SPACING.md,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.badgeBekerja,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { ...FONT.bodyMedium, fontSize: 15 },
  meta: { ...FONT.caption, marginTop: 1 },
  countBox: { alignItems: 'center', paddingHorizontal: SPACING.sm },
  countValue: { ...FONT.h3, fontSize: 16, color: COLORS.accent },
  countLabel: { ...FONT.caption, fontSize: 10 },
});