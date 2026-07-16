/**
 * Utility Formatting Functions
 * Solusi Mr Bi
 */

/**
 * Format raw number to Indonesian Rupiah currency format
 */
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format string date to comfortable Indonesian reading format
 */
export const formatDateIndo = (dateStr: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  } catch (error) {
    return dateStr;
  }
};

/**
 * Validates basic email pattern
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
