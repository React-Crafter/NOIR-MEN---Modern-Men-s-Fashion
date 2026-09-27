/**
 * Formats a numeric value into Bangladeshi Taka currency format (৳)
 * @param {number} amount
 * @returns {string} e.g. "৳ 2,450"
 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return '৳0';
  return `৳${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Calculates discount percentage
 * @param {number} current
 * @param {number} previous
 * @returns {number}
 */
export function getDiscountPercentage(current, previous) {
  if (!previous || previous <= current) return 0;
  return Math.round(((previous - current) / previous) * 100);
}
