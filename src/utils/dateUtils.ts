/**
 * Format tanggal ISO / yyyy-MM-dd menjadi format Indonesia.
 */
export function formatDateId(value: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Mendapatkan tanggal hari ini dalam format yyyy-MM-dd.
 */
export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}