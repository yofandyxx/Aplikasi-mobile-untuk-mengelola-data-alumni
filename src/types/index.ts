export type EmploymentStatus =
  | 'Bekerja'
  | 'Wirausaha'
  | 'Melanjutkan Studi'
  | 'Belum Bekerja';

export type JobStatus = 'Aktif' | 'Selesai';

export interface Alumni {
  id: string;
  nim: string;
  name: string;
  study_program: string;
  graduation_year: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
  employment_status: EmploymentStatus;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  address: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  alumni_id: string;
  company_id: string;
  position: string;
  industry: string;
  work_location: string;
  start_date: string;
  end_date: string;
  status: JobStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_alumni: number;
  employed: number;
  entrepreneur: number;
  studying: number;
  unemployed: number;
  total_companies: number;
  total_jobs: number;
  active_jobs: number;
}

export interface AlumniStatistics {
  by_study_program: Record<string, number>;
  by_graduation_year: Record<string, number>;
}

export interface CompanyStatistic {
  id: string;
  name: string;
  industry: string;
  alumni_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface AlumniFormValues {
  nim: string;
  name: string;
  study_program: string;
  graduation_year: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
  employment_status: EmploymentStatus;
  photo_url: string;
}

export interface CompanyFormValues {
  name: string;
  industry: string;
  location: string;
  address: string;
  description: string;
}

export interface JobFormValues {
  alumni_id: string;
  company_id: string;
  position: string;
  industry: string;
  work_location: string;
  start_date: string;
  end_date: string;
  status: JobStatus;
  description: string;
}