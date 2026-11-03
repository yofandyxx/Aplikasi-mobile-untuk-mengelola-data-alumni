import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT } from '../constants/theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export default function EmptyState({ icon = 'albums-outline', title, message }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={56} color={COLORS.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  title: { ...FONT.h3, color: COLORS.textSecondary },
  message: { ...FONT.caption, textAlign: 'center', maxWidth: 260 },
});