import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '../constants/theme';

interface Props {
  message?: string;
}

export default function LoadingView({ message = 'Memuat data...' }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl, gap: SPACING.md },
  text: { ...FONT.caption },
});