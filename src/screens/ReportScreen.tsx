import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../components/AppHeader';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import { fetchAlumni } from '../services/alumniService';
import type { Alumni, EmploymentStatus } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;
const STATUSES: EmploymentStatus[] = ['Bekerja', 'Wirausaha', 'Melanjutkan Studi', 'Belum Bekerja'];

export default function ReportScreen({ navigation }: Props) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('');
  const [program, setProgram] = useState('');
  const [status, setStatus] = useState<EmploymentStatus | ''>('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAlumni();
    if (res.success && res.data) setAlumni(res.data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const years = useMemo(() => Array.from(new Set(alumni.map((a) => a.graduation_year).filter(Boolean))).sort((a, b) => b.localeCompare(a)), [alumni]);
  const programs = useMemo(() => Array.from(new Set(alumni.map((a) => a.study_program).filter(Boolean))).sort(), [alumni]);

  const filtered = alumni.filter((a) => {
    if (year && a.graduation_year !== year) return false;
    if (program && a.study_program !== program) return false;
    if (status && a.employment_status !== status) return false;
    return true;
  });

  const statusCounts = STATUSES.map((s) => ({ label: s, count: filtered.filter((a) => a.employment_status === s).length }));
  const maxStatus = Math.max(1, ...statusCounts.map((s) => s.count));

  if (loading) return <LoadingView message="Menyiapkan laporan..." />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Laporan & Statistik" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl }}>
        <Text style={styles.sectionLabel}>Filter</Text>
        <FilterRow label="Tahun" value={year} options={['Semua', ...years]} onChange={(v) => setYear(v === 'Semua' ? '' : v)} />
        <FilterRow label="Prodi" value={program || 'Semua'} options={['Semua', ...programs]} onChange={(v) => setProgram(v === 'Semua' ? '' : v)} />
        <FilterRow label="Status" value={status || 'Semua'} options={['Semua', ...STATUSES]} onChange={(v) => setStatus(v === 'Semua' ? '' : v as EmploymentStatus)} />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Total: {filtered.length} alumni</Text>
          {statusCounts.map((s, idx) => (
            <View key={s.label} style={styles.barRow}>
              <Text style={styles.barLabel}>{s.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { width: `${(s.count / maxStatus) * 100}%`, backgroundColor: COLORS.chart[idx % COLORS.chart.length] }]} />
              </View>
              <Text style={styles.barValue}>{s.count}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Daftar Alumni Terfilter</Text>
        {filtered.length === 0
          ? <EmptyState title="Tidak ada data cocok" />
          : filtered.map((a) => (
              <TouchableOpacity key={a.id} style={styles.row} onPress={() => navigation.navigate('AlumniDetail', { alumniId: a.id })}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{a.name}</Text>
                  <Text style={styles.meta}>{a.nim} · {a.study_program} · {a.graduation_year}</Text>
                </View>
                <StatusBadge status={a.employment_status} />
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
}

function FilterRow({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.sm }}>
        {options.map((o) => (
          <TouchableOpacity
            key={o}
            style={[styles.chip, value === o && styles.chipActive]}
            onPress={() => onChange(o)}
          >
            <Text style={[styles.chipText, value === o && styles.chipTextActive]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...FONT.bodyMedium, color: COLORS.textSecondary, marginTop: SPACING.sm },
  sectionTitle: { ...FONT.h3, fontSize: 15 },
  filterLabel: { ...FONT.caption, fontSize: 11, fontWeight: '600' },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...FONT.caption, fontSize: 12 },
  chipTextActive: { color: COLORS.textOnDark, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.surface, padding: SPACING.lg,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, gap: SPACING.sm,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  barLabel: { width: 110, ...FONT.caption, fontSize: 11 },
  barTrack: { flex: 1, height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  bar: { height: 8, borderRadius: 4 },
  barValue: { width: 24, textAlign: 'right', ...FONT.bodyMedium, fontSize: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface, padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  name: { ...FONT.bodyMedium, fontSize: 14 },
  meta: { ...FONT.caption },
});