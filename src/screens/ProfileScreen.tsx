import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT } from '../constants/theme';

export default function ProfileScreen() {
  return <View style={styles.container}><Text style={styles.title}>Profil</Text><Text>Profil pengguna belum tersedia.</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }, title: { ...FONT.h2, marginBottom: 8 } });
