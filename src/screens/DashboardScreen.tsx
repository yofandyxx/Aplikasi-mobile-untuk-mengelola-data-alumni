import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import StatCard from '../components/StatCard';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import { fetchDashboardSummary, fetchAlumniStatistics } from '../services/dashboardService';
import type { AlumniStatistics, DashboardSummary } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stats, setStats] = useState<AlumniStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [sumRes, statRes] = await Promise.all([
      fetchDashboardSummary(),
      fetchAlumniStatistics(),
    ]);
    if (sumRes.success && sumRes.data) setSummary(sumRes.data);
    else setError(sumRes.message);
    if (statRes.success && statRes.data) setStats(statRes.data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <LoadingView message="Menyiapkan dashboard..." />;

  const employmentData = summary ? [
    { label: 'Bekerja', value: summary.employed },
    { label: 'Wirausaha', value: summary.entrepreneur },
    { label: 'Studi', value: summary.studying },
    { label: 'Belum Bekerja', value: summary.unemployed },
  ] : [];
  const maxEmployment = Math.max(1, ...employmentData.map((d) => d.value));

  const yearEntries = stats
    ? Object.entries(stats.by_graduation_year).sort((a, b) => a[0].localeCompare(b[0]))
    : [];
  const maxYear = Math.max(1, ...yearEntries.map(([, v]) => v));

  const programEntries = stats
    ? Object.entries(stats.by_study_program).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];
  const maxProgram = Math.max(1, ...programEntries.map(([, v]) => v));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader
        title="Dashboard Alumni"
        subtitle="Ringkasan data PPNP Alumni"
        rightAction={{ icon: 'stats-chart-outline', onPress: () => navigation.navigate('Report') }}
      />
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={load}><Text style={styles.retry}>Coba lagi</Text></TouchableOpacity>
          </View>
        ) : null}

        {/* Stat cards — dua baris */}
        <View style={styles.row}>
          <StatCard label="Total Alumni" value={summary?.total_alumni ?? 0} icon="people" tint={COLORS.primary} />
          <StatCard label="Sudah Bekerja" value={summary?.employed ?? 0} icon="briefcase" tint={COLORS.accent} />
        </View>
        <View style={styles.row}>
          <StatCard label="Wirausaha" value={summary?.entrepreneur ?? 0} icon="storefront" tint={COLORS.purple} />
          <StatCard label="Melanjutkan Studi" value={summary?.studying ?? 0} icon="school" tint={COLORS.success} />
        </View>
        <View style={styles.row}>
          <StatCard label="Belum Bekerja" value={summary?.unemployed ?? 0} icon="hourglass" tint={COLORS.warning} />
          <StatCard label="Perusahaan" value={summary?.total_companies ?? 0} icon="business" tint={COLORS.primaryLight} />
        </View>

        {/* Chart: Status Pekerjaan */}
        <Section title="Status Pekerjaan Alumni">
          {employmentData.map((item, idx) => (
            <View key={item.label} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{item.label}</Text>
              <View style={styles.chartBarTrack}>
                <View
                  style={[styles.chartBar, {
                    width: `${(item.value / maxEmployment) * 100}%`,
                    backgroundColor: COLORS.chart[idx % COLORS.chart.length],
                  }]}
                />
              </View>
              <Text style={styles.chartValue}>{item.value}</Text>
            </View>
          ))}
        </Section>

        {/* Chart: Tahun Lulus */}
        <Section title="Alumni per Tahun Lulus">
          {yearEntries.length === 0 ? (
            <EmptyState title="Belum ada data tahun lulus" />
          ) : (
            yearEntries.map(([year, count], idx) => (
              <View key={year} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{year}</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBar, {
                    width: `${(count / maxYear) * 100}%`,
                    backgroundColor: COLORS.chart[idx % COLORS.chart.length],
                  }]} />
                </View>
                <Text style={styles.chartValue}>{count}</Text>
              </View>
            ))
          )}
        </Section>

        {/* Chart: Program Studi */}
        <Section title="Alumni per Program Studi">
          {programEntries.map(([program, count], idx) => (
            <View key={program} style={styles.chartRow}>
              <Text style={styles.chartLabel} numberOfLines={1}>{program}</Text>
              <View style={styles.chartBarTrack}>
                <View style={[styles.chartBar, {
                  width: `${(count / maxProgram) * 100}%`,
                  backgroundColor: COLORS.chart[idx % COLORS.chart.length],
                }]} />
              </View>
              <Text style={styles.chartValue}>{count}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ gap: SPACING.sm }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.md },
  section: {
    backgroundColor: COLORS.surface, padding: SPACING.lg,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, gap: SPACING.md,
  },
  sectionTitle: { ...FONT.h3, fontSize: 15 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  chartLabel: { width: 96, ...FONT.caption, fontSize: 11 },
  chartBarTrack: { flex: 1, height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  chartBar: { height: 8, borderRadius: 4 },
  chartValue: { width: 28, textAlign: 'right', ...FONT.bodyMedium, fontSize: 12 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: '#FEE2E2', padding: SPACING.md, borderRadius: RADIUS.md,
  },
  errorText: { ...FONT.caption, color: COLORS.danger, flex: 1 },
  retry: { ...FONT.caption, color: COLORS.danger, fontWeight: '700', textDecorationLine: 'underline' },
});