
import type { AlumniFormValues } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateAlumniForm(values: AlumniFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.nim.trim()) errors.nim = 'NIM wajib diisi.';
  if (!values.name.trim()) errors.name = 'Nama lengkap wajib diisi.';
  if (!values.study_program.trim()) errors.study_program = 'Program studi wajib diisi.';

  if (!values.graduation_year.trim()) {
    errors.graduation_year = 'Tahun lulus wajib diisi.';
  } else {
    const year = parseInt(values.graduation_year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1980 || year > currentYear + 5) {
      errors.graduation_year = 'Tahun lulus tidak valid.';
    }
  }

  if (values.email.trim() && !validateEmail(values.email.trim())) {
    errors.email = 'Format email tidak valid.';
  }

  return errors;
}

export function validateCompanyForm(values: {
  name: string;
  industry: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!values.name.trim()) errors.name = 'Nama perusahaan wajib diisi.';
  if (!values.industry.trim()) errors.industry = 'Bidang industri wajib diisi.';
  return errors;
}

export function validateJobForm(values: {
  alumni_id: string;
  company_id: string;
  position: string;
  start_date: string;
  end_date: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.alumni_id) errors.alumni_id = 'Alumni wajib dipilih.';
  if (!values.company_id) errors.company_id = 'Perusahaan wajib dipilih.';
  if (!values.position.trim()) errors.position = 'Jabatan wajib diisi.';
  if (!values.start_date.trim()) errors.start_date = 'Tanggal mulai wajib diisi.';

  if (values.start_date && values.end_date) {
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      errors.end_date = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    }
  }

  return errors;
}