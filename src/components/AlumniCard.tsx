import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileAvatar from './ProfileAvatar';
import StatusBadge from './StatusBadge';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import type { Alumni } from '../types';

interface Props {
  alumni: Alumni;
  onPress: () => void;
}

export default function AlumniCard({ alumni, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <ProfileAvatar uri={alumni.photo_url} name={alumni.name} size={52} />
      <View style={styles.body}>
        <View style={styles.rowTop}>
          <Text style={styles.name} numberOfLines={1}>{alumni.name}</Text>
          <StatusBadge status={alumni.employment_status} />
        </View>
        <Text style={styles.meta}>
          {alumni.nim} · {alumni.study_program}
        </Text>
        <Text style={styles.meta}>
          Lulus {alumni.graduation_year || '-'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  body: { flex: 1, gap: 2 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  name: { ...FONT.bodyMedium, flex: 1, fontSize: 15 },
  meta: { ...FONT.caption },
});