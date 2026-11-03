export const ENDPOINTS = {
  // Alumni
  LIST_ALUMNI: 'listAlumni',
  GET_ALUMNI: 'getAlumni',
  CREATE_ALUMNI: 'createAlumni',
  UPDATE_ALUMNI: 'updateAlumni',
  DELETE_ALUMNI: 'deleteAlumni',
  UPDATE_ALUMNI_PHOTO: 'updateAlumniPhoto',
  SEARCH_ALUMNI: 'searchAlumni',

  // Companies
  LIST_COMPANIES: 'listCompanies',
  GET_COMPANY: 'getCompany',
  CREATE_COMPANY: 'createCompany',
  UPDATE_COMPANY: 'updateCompany',
  DELETE_COMPANY: 'deleteCompany',
  SEARCH_COMPANIES: 'searchCompanies',

  // Jobs
  LIST_JOBS: 'listJobs',
  GET_JOB: 'getJob',
  CREATE_JOB: 'createJob',
  UPDATE_JOB: 'updateJob',
  DELETE_JOB: 'deleteJob',
  GET_ALUMNI_JOBS: 'getAlumniJobs',
  FINISH_JOB: 'finishJob',

  // Dashboard
  DASHBOARD_SUMMARY: 'getDashboardSummary',
  ALUMNI_STATISTICS: 'getAlumniStatistics',
  EMPLOYMENT_STATISTICS: 'getEmploymentStatistics',
  GRADUATION_STATISTICS: 'getGraduationYearStatistics',
  COMPANY_STATISTICS: 'getCompanyStatistics',

  // === CLOUDINARY ===
  CLOUDINARY_SIGNATURE: 'getCloudinarySignature',
} as const;