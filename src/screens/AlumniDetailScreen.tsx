import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import AppHeader from '../components/AppHeader';
import { fetchAlumniById } from '../services/alumniService';
import type { Alumni } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AlumniDetail'>;

export default function AlumniDetailScreen({ route, navigation }: Props) {
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  useFocusEffect(useCallback(() => { setLoading(true); fetchAlumniById(route.params.alumniId).then((r) => { if (r.success && r.data) setAlumni(r.data); else Alert.alert('Gagal', r.message); setLoading(false); }); }, [route.params.alumniId]));
  return <View style={styles.container}><AppHeader title="Detail Alumni" onBack={() => navigation.goBack()} rightAction={{ icon: 'create-outline', onPress: () => navigation.navigate('AlumniForm', { alumniId: route.params.alumniId }) }} />{loading ? <View style={styles.center}><ActivityIndicator color={COLORS.accent} /></View> : !alumni ? <View style={styles.center}><Text>Data alumni tidak ditemukan.</Text></View> : <ScrollView contentContainerStyle={styles.content}>
    {alumni.photo_url ? <Image source={{ uri: alumni.photo_url }} style={styles.photo} /> : <View style={styles.placeholder}><Text style={styles.placeholderText}>Tidak ada foto</Text></View>}
    <Text style={styles.name}>{alumni.name}</Text><Text style={styles.sub}>{alumni.nim}</Text>
    <Info label="Program Studi" value={alumni.study_program} /><Info label="Tahun Lulus" value={alumni.graduation_year} /><Info label="Status Pekerjaan" value={alumni.employment_status} /><Info label="Email" value={alumni.email || '—'} /><Info label="Nomor Telepon" value={alumni.phone || '—'} /><Info label="Alamat" value={alumni.address || '—'} /><Info label="Keahlian" value={alumni.skills || '—'} />
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AlumniForm', { alumniId: alumni.id })}><Text style={styles.buttonText}>Edit Data Alumni</Text></TouchableOpacity>
  </ScrollView>}</View>;
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.background }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, content: { padding: SPACING.lg, gap: SPACING.md }, photo: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center' }, placeholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.surfaceAlt, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }, placeholderText: { ...FONT.caption }, name: { ...FONT.h2, textAlign: 'center' }, sub: { ...FONT.caption, textAlign: 'center' }, info: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md }, label: { ...FONT.caption, marginBottom: 4 }, value: { ...FONT.body }, button: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center', marginTop: SPACING.sm }, buttonText: { ...FONT.bodyMedium, color: COLORS.textOnDark } });
