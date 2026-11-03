import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONT } from '../constants/theme';
import { SPACING, RADIUS } from '../constants/theme';
import AppHeader from '../components/AppHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { createAlumni, deleteAlumni, fetchAlumniById, updateAlumni } from '../services/alumniService';
import { validateAlumniForm } from '../utils/validation';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { validateImage } from '../utils/imageUtils';
import type { AlumniFormValues, EmploymentStatus } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AlumniForm'>;
const EMPTY: AlumniFormValues = { nim: '', name: '', study_program: '', graduation_year: '', email: '', phone: '', address: '', skills: '', employment_status: 'Belum Bekerja', photo_url: '' };

export default function AlumniFormScreen({ route, navigation }: Props) {
  const alumniId = route.params?.alumniId;
  const isEdit = Boolean(alumniId);
  const [form, setForm] = React.useState<AlumniFormValues>(EMPTY);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [photoUri, setPhotoUri] = React.useState('');
  const [loading, setLoading] = React.useState(isEdit);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  React.useEffect(() => {
    if (!alumniId) return;
    fetchAlumniById(alumniId).then((result) => {
      if (result.success && result.data) {
        const data = result.data;
        setForm({ nim: data.nim, name: data.name, study_program: data.study_program, graduation_year: data.graduation_year, email: data.email, phone: data.phone, address: data.address, skills: data.skills, employment_status: data.employment_status, photo_url: data.photo_url });
        setPhotoUri(data.photo_url || '');
      } else Alert.alert('Gagal', result.message);
      setLoading(false);
    });
  }, [alumniId]);
  const set = <K extends keyof AlumniFormValues>(key: K, value: AlumniFormValues[K]) => setForm((current) => ({ ...current, [key]: value }));
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const validation = validateImage(asset.fileSize, asset.mimeType);
    if (!validation.valid) { Alert.alert('Foto tidak valid', validation.message); return; }
    setPhotoUri(asset.uri);
    setUploading(true);
    try {
      const fileName = asset.fileName || `alumni-${Date.now()}.jpg`;
      const uploaded = await uploadImageToCloudinary(asset.uri, fileName, asset.mimeType || 'image/jpeg');
      set('photo_url', uploaded.secure_url);
      Alert.alert('Berhasil', 'Foto berhasil diunggah.');
    } catch (error) {
      setPhotoUri('');
      Alert.alert('Gagal upload', error instanceof Error ? error.message : 'Foto gagal diunggah.');
    } finally { setUploading(false); }
  };
  const submit = async () => {
    const validation = validateAlumniForm(form); setErrors(validation); if (Object.keys(validation).length || submitting || uploading) return;
    setSubmitting(true); const result = isEdit ? await updateAlumni(alumniId!, form) : await createAlumni(form); setSubmitting(false);
    if (result.success) { Alert.alert('Berhasil', result.message || 'Alumni berhasil ditambahkan.', [{ text: 'OK', onPress: () => navigation.goBack() }]); } else Alert.alert('Gagal', result.message);
  };
  const remove = async () => { setConfirmDelete(false); const result = await deleteAlumni(alumniId!); if (result.success) navigation.goBack(); else Alert.alert('Gagal', result.message); };
  if (loading) return <View style={styles.container}><AppHeader title="Edit Alumni" onBack={() => navigation.goBack()} /><View style={styles.loading}><ActivityIndicator color={COLORS.accent} /><Text>Memuat data...</Text></View></View>;
  return <View style={styles.container}><AppHeader title={isEdit ? 'Edit Alumni' : 'Tambah Alumni'} onBack={() => navigation.goBack()} /><ScrollView contentContainerStyle={styles.form}>
    <View style={styles.photoSection}>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoPlaceholderText}>Belum ada foto</Text></View>}
      <TouchableOpacity style={styles.photoButton} onPress={choosePhoto} disabled={uploading}>{uploading ? <ActivityIndicator color={COLORS.textOnDark} /> : <Text style={styles.photoButtonText}>{photoUri ? 'Ganti Foto' : 'Upload Foto'}</Text>}</TouchableOpacity>
      <Text style={styles.photoHint}>JPG, PNG, atau WEBP — maksimal 5 MB</Text>
    </View>
    <Field label="NIM *" value={form.nim} onChangeText={(v) => set('nim', v)} error={errors.nim} />
    <Field label="Nama Lengkap *" value={form.name} onChangeText={(v) => set('name', v)} error={errors.name} />
    <Field label="Program Studi *" value={form.study_program} onChangeText={(v) => set('study_program', v)} error={errors.study_program} />
    <Field label="Tahun Lulus *" value={form.graduation_year} onChangeText={(v) => set('graduation_year', v.replace(/[^0-9]/g, ''))} keyboardType="numeric" error={errors.graduation_year} />
    <Field label="Email" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" error={errors.email} />
    <Field label="Nomor Telepon" value={form.phone} onChangeText={(v) => set('phone', v)} keyboardType="phone-pad" />
    <Field label="Alamat" value={form.address} onChangeText={(v) => set('address', v)} multiline />
    <Field label="Keahlian" value={form.skills} onChangeText={(v) => set('skills', v)} placeholder="Contoh: JavaScript, desain, analisis data" />
    <Text style={styles.label}>Status Pekerjaan</Text><View style={styles.chips}>{(['Bekerja', 'Wirausaha', 'Melanjutkan Studi', 'Belum Bekerja'] as EmploymentStatus[]).map((status) => <TouchableOpacity key={status} style={[styles.chip, form.employment_status === status && styles.chipActive]} onPress={() => set('employment_status', status)}><Text style={form.employment_status === status ? styles.chipTextActive : styles.chipText}>{status}</Text></TouchableOpacity>)}</View>
    <TouchableOpacity style={styles.submit} onPress={submit} disabled={submitting || uploading}>{submitting ? <ActivityIndicator color={COLORS.textOnDark} /> : <Text style={styles.submitText}>{isEdit ? 'Simpan Perubahan' : 'Simpan Alumni'}</Text>}</TouchableOpacity>
    {isEdit && <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirmDelete(true)}><Text style={styles.deleteText}>Hapus Alumni</Text></TouchableOpacity>}
  </ScrollView><ConfirmDialog visible={confirmDelete} title="Hapus Alumni" message="Data alumni akan dihapus permanen." destructive confirmLabel="Hapus" onConfirm={remove} onCancel={() => setConfirmDelete(false)} /></View>;
}

function Field({ label, value, onChangeText, error, multiline, keyboardType, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; error?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad'; placeholder?: string }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.textMuted} keyboardType={keyboardType} multiline={multiline} style={[styles.input, multiline && styles.multiline, error && styles.invalid]} />{error && <Text style={styles.error}>{error}</Text>}</View>; }
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.background }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md }, form: { padding: SPACING.lg, gap: SPACING.md }, photoSection: { alignItems: 'center', gap: SPACING.sm }, photo: { width: 120, height: 120, borderRadius: 60 }, photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' }, photoPlaceholderText: { ...FONT.caption }, photoButton: { backgroundColor: COLORS.accent, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, minWidth: 120, alignItems: 'center' }, photoButtonText: { ...FONT.bodyMedium, color: COLORS.textOnDark }, photoHint: { ...FONT.caption, fontSize: 11 }, field: { gap: 4 }, label: { ...FONT.bodyMedium, fontSize: 13 }, input: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, ...FONT.body, minHeight: 42 }, multiline: { minHeight: 78, textAlignVertical: 'top' }, invalid: { borderColor: COLORS.danger }, error: { ...FONT.caption, color: COLORS.danger }, chips: { gap: SPACING.sm }, chip: { padding: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.surface }, chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary }, chipText: { ...FONT.caption, color: COLORS.text }, chipTextActive: { ...FONT.caption, color: COLORS.textOnDark }, submit: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md }, submitText: { ...FONT.bodyMedium, color: COLORS.textOnDark }, deleteButton: { backgroundColor: '#FEE2E2', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' }, deleteText: { ...FONT.bodyMedium, color: COLORS.danger } });
