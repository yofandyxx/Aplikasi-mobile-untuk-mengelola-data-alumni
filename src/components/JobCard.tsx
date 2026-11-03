import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import { formatDateId } from '../utils/dateUtils';
import type { Job } from '../types';

interface Props {
  job: Job;
  companyName: string;
  alumniName?: string;
  onPress?: () => void;
}

export default function JobCard({ job, companyName, alumniName, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.position} numberOfLines={1}>{job.position}</Text>
          <Text style={styles.company}>{companyName}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>
      {alumniName ? <Text style={styles.alumni}>👤 {alumniName}</Text> : null}
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.metaText}>{job.work_location || '-'}</Text>
        <Text style={styles.dot}>·</Text>
        <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.metaText}>
          {formatDateId(job.start_date)} – {job.end_date ? formatDateId(job.end_date) : 'Sekarang'}
        </Text>
      </View>
      {job.industry ? <Text style={styles.industry}>{job.industry}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, padding: SPACING.md,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, gap: 6,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  position: { ...FONT.bodyMedium, fontSize: 15 },
  company: { ...FONT.caption, color: COLORS.accent, marginTop: 1 },
  alumni: { ...FONT.caption, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { ...FONT.caption, fontSize: 11 },
  dot: { color: COLORS.textMuted, fontSize: 11, marginHorizontal: 2 },
  industry: { ...FONT.caption, fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' },
});