import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../components/AppHeader';
import JobCard from '../components/JobCard';
import LoadingView from '../components/LoadingView';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING } from '../constants/theme';
import { fetchJobs } from '../services/jobService';
import { fetchCompanies } from '../services/companyService';
import { fetchAlumni } from '../services/alumniService';
import type { Alumni, Company, Job } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function JobScreen() {
  const navigation = useNavigation<Nav>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [j, c, a] = await Promise.all([fetchJobs(), fetchCompanies(), fetchAlumni()]);
    if (j.success && j.data) setJobs(j.data);
    if (c.success && c.data) setCompanies(c.data);
    if (a.success && a.data) setAlumni(a.data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? '—';
  const alumniName = (id: string) => alumni.find((a) => a.id === id)?.name ?? '—';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader
        title="Pekerjaan"
        subtitle={`${jobs.length} riwayat pekerjaan`}
        rightAction={{ icon: 'add-circle-outline', onPress: () => navigation.navigate('JobForm', {}) }}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
          contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              companyName={companyName(item.company_id)}
              alumniName={alumniName(item.alumni_id)}
              onPress={() => navigation.navigate('JobForm', { jobId: item.id })}
            />
          )}
          ListEmptyComponent={<EmptyState icon="briefcase-outline" title="Belum ada pekerjaan" message="Tambahkan riwayat pekerjaan alumni." />}
        />
      )}
    </View>
  );
}