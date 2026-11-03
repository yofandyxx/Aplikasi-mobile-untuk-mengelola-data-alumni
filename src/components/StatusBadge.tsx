import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import type { EmploymentStatus, JobStatus } from '../types';

interface Props {
  status: EmploymentStatus | JobStatus;
}

const MAP: Record<string, { bg: string; text: string }> = {
  Bekerja: { bg: COLORS.badgeBekerja, text: COLORS.badgeBekerjaText },
  Wirausaha: { bg: COLORS.badgeWirausaha, text: COLORS.badgeWirausahaText },
  'Melanjutkan Studi': { bg: COLORS.badgeStudi, text: COLORS.badgeStudiText },
  'Belum Bekerja': { bg: COLORS.badgeBelum, text: COLORS.badgeBelumText },
  Aktif: { bg: COLORS.badgeStudi, text: COLORS.badgeStudiText },
  Selesai: { bg: COLORS.surfaceAlt, text: COLORS.textSecondary },
};

export default function StatusBadge({ status }: Props) {
  const c = MAP[status] ?? { bg: COLORS.surfaceAlt, text: COLORS.textSecondary };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600' },
});