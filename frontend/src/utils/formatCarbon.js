// frontend/src/utils/formatCarbon.js

/**
 * Formats a CO2 value (always stored/passed in grams) according to the
 * user's preferred display unit.
 *
 * @param {number} grams - raw CO2 value in grams
 * @param {'gCO₂'|'kgCO₂'} unit - user's preferred unit from settings
 * @returns {string} formatted value with unit, e.g. "12.34 gCO₂" or "0.01 kgCO₂"
 */
export const formatCarbonValue = (grams, unit = 'gCO₂') => {
  const value = Number(grams) || 0;

  if (unit === 'kgCO₂') {
    return `${(value / 1000).toFixed(3)} kgCO₂`;
  }

  return `${value.toFixed(2)} gCO₂`;
};

export default formatCarbonValue;
