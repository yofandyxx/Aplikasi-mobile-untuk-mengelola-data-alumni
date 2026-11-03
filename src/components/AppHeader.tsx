import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export default function AppHeader({ title, subtitle, onBack, rightAction }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + SPACING.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.back}>
            <Ionicons name={rightAction.icon} size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
        ) : <View style={{ width: 32 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  back: { padding: 4 },
  title: { ...FONT.h2, color: COLORS.textOnDark },
  subtitle: { ...FONT.caption, color: '#B8C4D8', marginTop: 2 },
});