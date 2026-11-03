import { apiGet, apiPost } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Alumni, AlumniFormValues, ApiResponse } from '../types';

export async function fetchAlumni(): Promise<ApiResponse<Alumni[]>> {
  return apiGet<Alumni[]>(ENDPOINTS.LIST_ALUMNI);
}

export async function fetchAlumniById(id: string): Promise<ApiResponse<Alumni>> {
  return apiGet<Alumni>(ENDPOINTS.GET_ALUMNI, { id });
}

export async function searchAlumni(keyword: string): Promise<ApiResponse<Alumni[]>> {
  return apiGet<Alumni[]>(ENDPOINTS.SEARCH_ALUMNI, { q: keyword });
}

export async function createAlumni(
  values: AlumniFormValues
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.CREATE_ALUMNI, values);
}

export async function updateAlumni(
  id: string,
  values: Partial<AlumniFormValues>
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.UPDATE_ALUMNI, values, id);
}

export async function deleteAlumni(id: string): Promise<ApiResponse<null>> {
  return apiPost<null>(ENDPOINTS.DELETE_ALUMNI, {}, id);
}

export async function updateAlumniPhoto(
  id: string,
  photoUrl: string
): Promise<ApiResponse<{ photo_url: string }>> {
  return apiPost<{ photo_url: string }>(
    ENDPOINTS.UPDATE_ALUMNI_PHOTO,
    { photo_url: photoUrl },
    id
  );
}