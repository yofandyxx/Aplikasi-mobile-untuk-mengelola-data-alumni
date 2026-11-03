import { apiGet, apiPost } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Company, CompanyFormValues, ApiResponse } from '../types';

export async function fetchCompanies(): Promise<ApiResponse<Company[]>> {
  return apiGet<Company[]>(ENDPOINTS.LIST_COMPANIES);
}

export async function fetchCompanyById(id: string): Promise<ApiResponse<Company>> {
  return apiGet<Company>(ENDPOINTS.GET_COMPANY, { id });
}

export async function searchCompanies(keyword: string): Promise<ApiResponse<Company[]>> {
  return apiGet<Company[]>(ENDPOINTS.SEARCH_COMPANIES, { q: keyword });
}

export async function createCompany(
  values: CompanyFormValues
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.CREATE_COMPANY, values);
}

export async function updateCompany(
  id: string,
  values: Partial<CompanyFormValues>
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.UPDATE_COMPANY, values, id);
}

export async function deleteCompany(id: string): Promise<ApiResponse<null>> {
  return apiPost<null>(ENDPOINTS.DELETE_COMPANY, {}, id);
}