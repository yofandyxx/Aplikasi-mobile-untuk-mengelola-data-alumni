import { apiGet } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Data signature yang dikembalikan backend.
 */
interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
  upload_url: string;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

/**
 * Upload gambar ke Cloudinary menggunakan signed upload.
 *
 * Alur:
 *   1. Minta signature ke backend (Apps Script)
 *   2. Kirim file + api_key + timestamp + signature ke Cloudinary
 *   3. Kembalikan secure_url
 *
 * API_SECRET TIDAK pernah ada di sisi client.
 */
export async function uploadImageToCloudinary(
  uri: string,
  fileName: string,
  mimeType: string
): Promise<CloudinaryUploadResult> {
  // === 1. Minta signature ke backend ===
  const sigRes = await apiGet<CloudinarySignatureResponse>(ENDPOINTS.CLOUDINARY_SIGNATURE);

  if (!sigRes.success || !sigRes.data) {
    throw new Error(
      sigRes.message || 'Gagal mendapatkan signature Cloudinary dari server.'
    );
  }

  const cfg = sigRes.data;

  // === 2. Siapkan FormData ===
  const formData = new FormData();
  formData.append('file', {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);
  formData.append('api_key', cfg.api_key);
  formData.append('timestamp', String(cfg.timestamp));
  formData.append('signature', cfg.signature);
  formData.append('folder', cfg.folder);

  // === 3. Upload ke Cloudinary ===
  // Gunakan XHR native React Native. Pada Expo SDK 58, global fetch
  // memakai expo/fetch yang dapat menolak FormDataPart berbasis URI.
  const json = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', cfg.upload_url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
        } catch {
          reject(new Error('Respons Cloudinary tidak valid.'));
        }
      } else {
        reject(new Error('Upload Cloudinary gagal: ' + xhr.responseText));
      }
    };
    xhr.onerror = () => reject(new Error('Tidak dapat terhubung ke Cloudinary.'));
    xhr.send(formData);
  });
  return json;
}
