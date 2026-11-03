import { apiGet, apiPost } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import type { Job, JobFormValues, ApiResponse } from '../types';

export async function fetchJobs(): Promise<ApiResponse<Job[]>> {
  return apiGet<Job[]>(ENDPOINTS.LIST_JOBS);
}

export async function fetchJobById(id: string): Promise<ApiResponse<Job>> {
  return apiGet<Job>(ENDPOINTS.GET_JOB, { id });
}

export async function fetchAlumniJobs(alumniId: string): Promise<ApiResponse<Job[]>> {
  return apiGet<Job[]>(ENDPOINTS.GET_ALUMNI_JOBS, { id: alumniId });
}

export async function createJob(
  values: JobFormValues
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.CREATE_JOB, values);
}

export async function updateJob(
  id: string,
  values: Partial<JobFormValues>
): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.UPDATE_JOB, values, id);
}

export async function deleteJob(id: string): Promise<ApiResponse<null>> {
  return apiPost<null>(ENDPOINTS.DELETE_JOB, {}, id);
}

export async function finishJob(id: string): Promise<ApiResponse<{ id: string }>> {
  return apiPost<{ id: string }>(ENDPOINTS.FINISH_JOB, {}, id);
}