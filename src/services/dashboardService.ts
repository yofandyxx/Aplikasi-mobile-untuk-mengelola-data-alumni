import { apiGet } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import type {
  AlumniStatistics,
  ApiResponse,
  CompanyStatistic,
  DashboardSummary,
} from '../types';

export async function fetchDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
  return apiGet<DashboardSummary>(ENDPOINTS.DASHBOARD_SUMMARY);
}

export async function fetchAlumniStatistics(): Promise<ApiResponse<AlumniStatistics>> {
  return apiGet<AlumniStatistics>(ENDPOINTS.ALUMNI_STATISTICS);
}

export async function fetchGraduationStatistics(): Promise<
  ApiResponse<Record<string, number>>
> {
  return apiGet<Record<string, number>>(ENDPOINTS.GRADUATION_STATISTICS);
}

export async function fetchCompanyStatistics(): Promise<ApiResponse<CompanyStatistic[]>> {
  return apiGet<CompanyStatistic[]>(ENDPOINTS.COMPANY_STATISTICS);
}