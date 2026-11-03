import React, { useCallback, useMemo, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import CompanyCard from '../components/CompanyCard';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import { fetchCompanies } from '../services/companyService';
import { fetchJobs } from '../services/jobService';
import type { Company } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CompanyScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<{ company_id: string }[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, j] = await Promise.all([fetchCompanies(), fetchJobs()]);
    if (c.success && c.data) setData(c.data);
    if (j.success && j.data) setJobs(j.data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const alumniCount = useMemo(() => {
    const m = new Map<string, number>();
    jobs.forEach((j) => m.set(j.company_id, (m.get(j.company_id) ?? 0) + 1));
    return m;
  }, [jobs]);

  const filtered = data.filter((c) => {
    if (!keyword.trim()) return true;
    const q = keyword.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader
        title="Perusahaan"
        subtitle={`${data.length} perusahaan terdaftar`}
        rightAction={{ icon: 'add-circle-outline', onPress: () => navigation.navigate('CompanyForm', {}) }}
      />
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama atau industri..."
          placeholderTextColor={COLORS.textMuted}
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}
          renderItem={({ item }) => (
            <CompanyCard
              company={item}
              alumniCount={alumniCount.get(item.id) ?? 0}
              onPress={() => navigation.navigate('CompanyForm', { companyId: item.id })}
            />
          )}
          ListEmptyComponent={<EmptyState icon="business-outline" title="Belum ada perusahaan" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    margin: SPACING.lg, marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  searchInput: { flex: 1, paddingVertical: SPACING.sm, ...FONT.body },
});