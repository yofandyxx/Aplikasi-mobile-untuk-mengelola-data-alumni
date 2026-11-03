export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface ImageValidationResult {
  valid: boolean;
  message?: string;
}

export function validateImage(
  fileSize: number | undefined,
  mimeType: string | undefined
): ImageValidationResult {
  if (fileSize && fileSize > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, message: 'Ukuran foto maksimal 5 MB.' };
  }
  if (mimeType && ALLOWED_IMAGE_TYPES.indexOf(mimeType) === -1) {
    return { valid: false, message: 'Format foto harus JPG, PNG, atau WEBP.' };
  }
  return { valid: true };
}