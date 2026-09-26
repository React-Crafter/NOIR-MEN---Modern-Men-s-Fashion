/**
 * Format numeric price into Bangladeshi Taka currency format
 * @param {number} amount
 * @returns {string} formatted string e.g. "৳ 3,450"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '৳ 0';
  }
  return `৳ ${Number(amount).toLocaleString('en-BD')}`;
}

export default formatPrice;
