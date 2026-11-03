import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { COLORS, FONT } from '../constants/theme';
import AppHeader from '../components/AppHeader';
import { fetchAlumni } from '../services/alumniService';
import type { Alumni } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export default function AlumniScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  useFocusEffect(useCallback(() => { fetchAlumni().then((r) => r.success && r.data && setAlumni(r.data)); }, []));
  return <View style={styles.container}>
    <AppHeader title="Alumni" subtitle={`${alumni.length} alumni terdaftar`} rightAction={{ icon: 'add-circle-outline', onPress: () => navigation.navigate('AlumniForm', {}) }} />
    <View style={styles.body}>
      {alumni.length === 0 ? <Text style={styles.empty}>Belum ada data alumni.</Text> : alumni.map((item) => <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate('AlumniDetail', { alumniId: item.id })}><Text style={styles.name}>{item.name}</Text><Text>{item.nim} · {item.study_program}</Text></TouchableOpacity>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.background }, body: { padding: 16, gap: 10 }, empty: { ...FONT.body, color: COLORS.textMuted, textAlign: 'center', marginTop: 24 }, card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12 }, name: { ...FONT.bodyMedium, marginBottom: 4 } });
