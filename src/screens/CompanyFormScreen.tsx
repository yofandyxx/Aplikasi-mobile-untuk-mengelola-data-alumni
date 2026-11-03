import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONT } from '../constants/theme';
import { SPACING, RADIUS } from '../constants/theme';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { createCompany, deleteCompany, fetchCompanyById, updateCompany } from '../services/companyService';
import { validateCompanyForm } from '../utils/validation';
import type { CompanyFormValues } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyForm'>;
const EMPTY: CompanyFormValues = { name: '', industry: '', location: '', address: '', description: '' };

export default function CompanyFormScreen({ route, navigation }: Props) {
  const companyId = route.params?.companyId;
  const isEdit = Boolean(companyId);
  const [form, setForm] = useState<CompanyFormValues>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    fetchCompanyById(companyId).then((result) => {
      if (result.success && result.data) {
        const { name, industry, location, address, description } = result.data;
        setForm({ name, industry, location, address, description });
      } else Alert.alert('Gagal', result.message);
      setLoading(false);
    });
  }, [companyId]);

  const set = <K extends keyof CompanyFormValues>(key: K, value: CompanyFormValues[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    const validation = validateCompanyForm(form);
    setErrors(validation);
    if (Object.keys(validation).length || submitting) return;
    setSubmitting(true);
    const result = isEdit ? await updateCompany(companyId!, form) : await createCompany(form);
    setSubmitting(false);
    if (result.success) Alert.alert('Berhasil', result.message || (isEdit ? 'Data perusahaan diperbarui.' : 'Perusahaan berhasil ditambahkan.'), [{ text: 'OK', onPress: () => navigation.goBack() }]);
    else Alert.alert('Gagal', result.message);
  };
  const remove = async () => {
    setConfirmDelete(false);
    const result = await deleteCompany(companyId!);
    if (result.success) navigation.goBack(); else Alert.alert('Gagal', result.message);
  };

  if (loading) return <View style={styles.container}><AppHeader title="Perusahaan" onBack={() => navigation.goBack()} /><View style={styles.loading}><ActivityIndicator color={COLORS.accent} /><Text>Memuat data...</Text></View></View>;
  return <View style={styles.container}>
    <AppHeader title={isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'} onBack={() => navigation.goBack()} />
    <ScrollView contentContainerStyle={styles.form}>
      <Field label="Nama Perusahaan *" value={form.name} onChangeText={(value) => set('name', value)} error={errors.name} />
      <Field label="Bidang Industri *" value={form.industry} onChangeText={(value) => set('industry', value)} error={errors.industry} />
      <Field label="Lokasi/Kota" value={form.location} onChangeText={(value) => set('location', value)} />
      <Field label="Alamat" value={form.address} onChangeText={(value) => set('address', value)} multiline />
      <Field label="Deskripsi" value={form.description} onChangeText={(value) => set('description', value)} multiline />
      <TouchableOpacity style={[styles.submit, submitting && { opacity: 0.6 }]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color={COLORS.textOnDark} /> : <Text style={styles.submitText}>{isEdit ? 'Simpan Perubahan' : 'Simpan Perusahaan'}</Text>}</TouchableOpacity>
      {isEdit && <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirmDelete(true)}><Text style={styles.deleteText}>Hapus Perusahaan</Text></TouchableOpacity>}
    </ScrollView>
    <ConfirmDialog visible={confirmDelete} title="Hapus Perusahaan" message="Data perusahaan akan dihapus permanen." destructive confirmLabel="Hapus" onConfirm={remove} onCancel={() => setConfirmDelete(false)} />
  </View>;
}

function Field({ label, value, onChangeText, error, multiline }: { label: string; value: string; onChangeText: (value: string) => void; error?: string; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholderTextColor={COLORS.textMuted} multiline={multiline} style={[styles.input, multiline && styles.multiline, error && styles.invalid]} />{error && <Text style={styles.error}>{error}</Text>}</View>; }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.background }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md }, form: { padding: SPACING.lg, gap: SPACING.md }, field: { gap: 4 }, label: { ...FONT.bodyMedium, fontSize: 13 }, input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, ...FONT.body, minHeight: 42 }, multiline: { minHeight: 82, textAlignVertical: 'top' }, invalid: { borderColor: COLORS.danger }, error: { ...FONT.caption, color: COLORS.danger }, submit: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md }, submitText: { ...FONT.bodyMedium, color: COLORS.textOnDark }, deleteButton: { backgroundColor: '#FEE2E2', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' }, deleteText: { ...FONT.bodyMedium, color: COLORS.danger } });
