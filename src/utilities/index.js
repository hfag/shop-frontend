/**
 * Strips html tags from a string
 * @param {string} string The string to strip
 * @returns {string} The stripped string
 */
export const stripTags = string =>
  (string && string.replace(/<(?:.|\n)*?>/gm, "")) || "";
