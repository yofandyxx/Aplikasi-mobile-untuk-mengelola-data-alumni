import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface Props {
  uri?: string;
  name: string;
  size?: number;
}

export default function ProfileAvatar({ uri, name, size = 52 }: Props) {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const dim = { width: size, height: size, borderRadius: RADIUS.full };

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        style={[styles.img, dim]}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.fallback, dim]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: COLORS.surfaceAlt },
  fallback: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: COLORS.textOnDark, fontWeight: '800' },
});