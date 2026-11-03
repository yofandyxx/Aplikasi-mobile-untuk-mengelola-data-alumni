/**
 * Mengubah error tidak dikenal menjadi pesan yang aman ditampilkan.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Terjadi kesalahan tidak dikenal.';
}