import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { COLORS, RADIUS, SPACING, FONT } from '../constants/theme';
import { createJob, deleteJob, fetchJobById, updateJob } from '../services/jobService';
import { fetchAlumni } from '../services/alumniService';
import { fetchCompanies } from '../services/companyService';
import { validateJobForm } from '../utils/validation';
import { todayIsoDate } from '../utils/dateUtils';
import type { Alumni, Company, JobFormValues, JobStatus } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'JobForm'>;

const EMPTY: JobFormValues = {
  alumni_id: '', company_id: '', position: '', industry: '',
  work_location: '', start_date: todayIsoDate(), end_date: '',
  status: 'Aktif', description: '',
};

export default function JobFormScreen({ route, navigation }: Props) {
  const jobId = route.params?.jobId;
  const presetAlumniId = route.params?.alumniId;
  const isEdit = !!jobId;
  const [form, setForm] = useState<JobFormValues>({ ...EMPTY, alumni_id: presetAlumniId ?? '' });
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchAlumni().then((r) => r.success && r.data && setAlumni(r.data));
    fetchCompanies().then((r) => r.success && r.data && setCompanies(r.data));
    if (isEdit) {
      fetchJobById(jobId).then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            alumni_id: d.alumni_id, company_id: d.company_id, position: d.position,
            industry: d.industry, work_location: d.work_location,
            start_date: d.start_date, end_date: d.end_date,
            status: d.status, description: d.description,
          });
        }
      });
    }
  }, [jobId, isEdit]);

  const set = <K extends keyof JobFormValues>(k: K, v: JobFormValues[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const v = validateJobForm(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    if (submitting) return;
    setSubmitting(true);
    const res = isEdit ? await updateJob(jobId!, form) : await createJob(form);
    setSubmitting(false);
    if (res.success) { Alert.alert('Berhasil', res.message); navigation.goBack(); }
    else Alert.alert('Gagal', res.message);
  };

  const onDelete = async () => {
    setConfirmDelete(false);
    const res = await deleteJob(jobId!);
    if (res.success) navigation.goBack();
    else Alert.alert('Gagal', res.message);
  };

  const alumniOptions = useMemo(() => alumni.map((a) => ({ id: a.id, label: `${a.name} (${a.nim})` })), [alumni]);
  const companyOptions = useMemo(() => companies.map((c) => ({ id: c.id, label: c.name })), [companies]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title={isEdit ? 'Edit Pekerjaan' : 'Tambah Pekerjaan'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}>
        <Select
          label="Alumni *" value={form.alumni_id}
          options={alumniOptions}
          onChange={(id) => set('alumni_id', id)}
          error={errors.alumni_id}
        />
        <Select
          label="Perusahaan *" value={form.company_id}
          options={companyOptions}
          onChange={(id) => {
            set('company_id', id);
            const c = companies.find((x) => x.id === id);
            if (c) set('industry', c.industry);
          }}
          error={errors.company_id}
        />
        <Field label="Jabatan *" value={form.position} onChangeText={(v) => set('position', v)} error={errors.position} />
        <Field label="Bidang Pekerjaan" value={form.industry} onChangeText={(v) => set('industry', v)} />
        <Field label="Lokasi Kerja" value={form.work_location} onChangeText={(v) => set('work_location', v)} />
        <Field label="Tanggal Mulai * (YYYY-MM-DD)" value={form.start_date} onChangeText={(v) => set('start_date', v)} error={errors.start_date} />
        <Field label="Tanggal Selesai (opsional)" value={form.end_date} onChangeText={(v) => set('end_date', v)} error={errors.end_date} />

        <Text style={styles.label}>Status Pekerjaan</Text>
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          {(['Aktif', 'Selesai'] as JobStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, form.status === s && styles.chipActive]}
              onPress={() => set('status', s)}
            >
              <Text style={[styles.chipText, form.status === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field label="Deskripsi" value={form.description} onChangeText={(v) => set('description', v)} multiline />

        <TouchableOpacity style={[styles.submit, submitting && { opacity: 0.6 }]} onPress={submit} disabled={submitting}>
          {submitting ? <ActivityIndicator color={COLORS.textOnDark} /> : <Text style={styles.submitText}>{isEdit ? 'Simpan Perubahan' : 'Simpan Pekerjaan'}</Text>}
        </TouchableOpacity>

        {isEdit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setConfirmDelete(true)}>
            <Text style={styles.deleteText}>Hapus Pekerjaan</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete} title="Hapus Pekerjaan"
        message="Riwayat pekerjaan akan dihapus permanen."
        destructive confirmLabel="Hapus"
        onConfirm={onDelete} onCancel={() => setConfirmDelete(false)}
      />
    </View>
  );
}

function Field({ label, value, onChangeText, error, multiline }: {
  label: string; value: string; onChangeText: (v: string) => void; error?: string; multiline?: boolean;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }, !!error && { borderColor: COLORS.danger }]}
        value={value} onChangeText={onChangeText} multiline={multiline}
        placeholderTextColor={COLORS.textMuted} autoCapitalize="none"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function Select({ label, value, options, onChange, error }: {
  label: string; value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.id === value);
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={[styles.input, { justifyContent: 'center' }, !!error && { borderColor: COLORS.danger }]} onPress={() => setOpen((v) => !v)}>
        <Text style={{ color: current ? COLORS.text : COLORS.textMuted }}>{current?.label ?? 'Pilih...'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 200 }}>
            {options.length === 0 ? <Text style={styles.emptyOption}>Tidak ada pilihan</Text> : options.map((opt) => (
              <TouchableOpacity key={opt.id} style={styles.option} onPress={() => { onChange(opt.id); setOpen(false); }}>
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...FONT.bodyMedium, fontSize: 13 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.borderLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    ...FONT.body, minHeight: 42,
  },
  errorText: { ...FONT.caption, color: COLORS.danger, fontSize: 11 },
  dropdown: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md, overflow: 'hidden',
  },
  option: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  optionText: { ...FONT.body },
  emptyOption: { ...FONT.caption, padding: SPACING.md },
  chip: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, alignItems: 'center', backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...FONT.bodyMedium, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.textOnDark },
  submit: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  submitText: { ...FONT.bodyMedium, color: COLORS.textOnDark },
  deleteBtn: { backgroundColor: '#FEE2E2', padding: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center' },
  deleteText: { ...FONT.bodyMedium, color: COLORS.danger },
});